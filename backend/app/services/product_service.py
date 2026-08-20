import uuid
from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Product, ValidationStatus
from app.models.product_attribute import ProductAttribute, OriginType, AttributeStatus
from app.models.source import ProductSource, SourceType
from app.models.evidence import ProductEvidence
from app.models.validation import ValidationResult
from app.models.enrichment import EnrichmentResult
from app.repositories.product_repository import ProductRepository
from app.services.confidence_service import ConfidenceService
from app.services.validation_service import ValidationService
from app.services.enrichment_service import EnrichmentService
from app.core.exceptions import NotFoundException

class ProductService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ProductRepository(session)

    async def get_product(self, product_id: str) -> Dict[str, Any]:
        product = await self.repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product", product_id)
        
        # Calculate counts and breakdown
        extracted = [a for a in product.attributes if a.origin_type == OriginType.EXTRACTED]
        enriched = [a for a in product.attributes if a.origin_type == OriginType.ENRICHED]
        inferred = [a for a in product.attributes if a.origin_type == OriginType.INFERRED]

        # Calculate category completeness and missing fields
        attr_dicts = [{"name": a.name, "value": a.value, "confidence": a.confidence} for a in product.attributes]
        metrics = ConfidenceService.calculate_product_metrics(attr_dicts, product.category)

        # Build conflict list from validation results
        conflicts = []
        for v in product.validation_results:
            if v.status.value == "CONFLICT":
                conflicts.append({
                    "rule_name": v.rule_name,
                    "field_name": v.field_name,
                    "message": v.message,
                    "conflicting_data": v.conflicting_data
                })

        return {
            "id": product.id,
            "sku": product.sku,
            "product_name": product.product_name,
            "brand": product.brand,
            "category": product.category,
            "subcategory": product.subcategory,
            "description": product.description,
            "completeness": product.completeness,
            "overall_confidence": product.overall_confidence,
            "validation_status": product.validation_status,
            "raw_attributes": product.raw_attributes or {},
            "created_at": product.created_at,
            "updated_at": product.updated_at,
            "attributes": product.attributes,
            "sources": product.sources,
            "validation_results": product.validation_results,
            "enrichment_results": product.enrichment_results,
            "extracted_count": len(extracted),
            "enriched_count": len(enriched),
            "inferred_count": len(inferred),
            "missing_attributes": metrics["missing_fields"],
            "conflicts": conflicts
        }

    async def list_products(
        self,
        category: Optional[str] = None,
        validation_status: Optional[str] = None,
        min_confidence: Optional[float] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Product], int]:
        skip = (page - 1) * page_size
        return await self.repo.list_products(
            category=category,
            validation_status=validation_status,
            min_confidence=min_confidence,
            search=search,
            skip=skip,
            limit=page_size
        )

    async def delete_product(self, product_id: str) -> bool:
        product = await self.repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product", product_id)
        return await self.repo.delete_by_id(product_id)

    async def revalidate_product(self, product_id: str) -> Dict[str, Any]:
        product = await self.repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product", product_id)

        attr_dicts = [{"name": a.name, "value": a.value, "unit": a.unit, "status": a.status.value} for a in product.attributes]
        val_status, results, conflicts = ValidationService.validate_attributes(product.category, attr_dicts)

        # Clear old validation results & save new
        product.validation_results.clear()
        for r in results:
            val_obj = ValidationResult(
                product_id=product.id,
                rule_name=r["rule_name"],
                rule_type=r["rule_type"],
                status=r["status"],
                field_name=r.get("field_name"),
                message=r["message"]
            )
            product.validation_results.append(val_obj)

        product.validation_status = ValidationStatus(val_status)
        await self.repo.save(product)

        return {
            "product_id": product.id,
            "validation_status": product.validation_status.value,
            "total_checks": len(results),
            "passed_checks": len([r for r in results if r["status"].value == "PASS"]),
            "failed_checks": len([r for r in results if r["status"].value in ["FAIL", "WARNING"]]),
            "conflicts_detected": len(conflicts),
            "results": results
        }

    async def enrich_product(self, product_id: str) -> Dict[str, Any]:
        product = await self.repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product", product_id)

        product_dict = {
            "product_name": product.product_name,
            "category": product.category,
            "attributes": [{"name": a.name, "value": a.value} for a in product.attributes]
        }

        enrichment_items = await EnrichmentService.enrich(product_dict)
        product.enrichment_results.clear()
        
        for item in enrichment_items:
            origin = OriginType.ENRICHED if item.get("enrichment_type") == "ENRICHED" else OriginType.INFERRED
            en_obj = EnrichmentResult(
                product_id=product.id,
                field_name=item["field_name"],
                enriched_value=item["enriched_value"],
                enrichment_type=origin,
                rationale=item.get("rationale"),
                confidence=item.get("confidence", 0.85)
            )
            product.enrichment_results.append(en_obj)

        await self.repo.save(product)
        return {
            "product_id": product.id,
            "enriched_fields_count": len(enrichment_items),
            "items": enrichment_items
        }

    async def resolve_conflict(
        self,
        product_id: str,
        attribute_name: str,
        selected_value: str,
        selected_source: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        product = await self.repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product", product_id)

        target_attr = next((a for a in product.attributes if a.name.lower() == attribute_name.lower()), None)
        if target_attr:
            target_attr.value = selected_value
            target_attr.status = AttributeStatus.VALIDATED
            target_attr.confidence = 0.98

        # Clear conflict validation flags for this attribute
        remaining_conflicts = 0
        for v in product.validation_results:
            if v.field_name and v.field_name.lower() == attribute_name.lower() and v.status == ValidationResultStatus.CONFLICT:
                v.status = ValidationResultStatus.PASS
                v.message = f"Resolved manually by engineer: {selected_value}. Note: {notes or 'Authoritative value confirmed'}"
            elif v.status == ValidationResultStatus.CONFLICT:
                remaining_conflicts += 1

        if remaining_conflicts == 0:
            product.validation_status = ValidationStatus.VALIDATED

        await self.repo.save(product)
        return {"success": True, "resolved_attribute": attribute_name, "value": selected_value}
