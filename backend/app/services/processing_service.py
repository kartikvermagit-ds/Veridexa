import os
import uuid
import asyncio
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging import logger
from app.models.processing_job import ProcessingJob, JobStatus
from app.models.product import Product, ValidationStatus
from app.models.product_attribute import ProductAttribute, OriginType, AttributeStatus
from app.models.source import ProductSource, SourceType
from app.models.evidence import ProductEvidence
from app.models.validation import ValidationResult
from app.models.enrichment import EnrichmentResult
from app.repositories.processing_repository import ProcessingRepository
from app.repositories.product_repository import ProductRepository
from app.processors.pdf_processor import PDFProcessor
from app.processors.text_processor import TextProcessor
from app.ai.llm_client import get_llm_client
from app.services.confidence_service import ConfidenceService
from app.services.validation_service import ValidationService
from app.services.enrichment_service import EnrichmentService
from app.db.database import AsyncSessionLocal

class ProcessingService:
    @classmethod
    async def create_job(
        cls,
        session: AsyncSession,
        source_type: str,
        file_name: Optional[str] = None
    ) -> ProcessingJob:
        repo = ProcessingRepository(session)
        job = ProcessingJob(
            source_type=source_type,
            file_name=file_name,
            status=JobStatus.PENDING,
            stage="QUEUED",
            progress=0
        )
        return await repo.create(job)

    @classmethod
    async def run_pipeline_async(
        cls,
        job_id: str,
        source_type: str,
        raw_text: Optional[str] = None,
        file_path: Optional[str] = None,
        file_name: Optional[str] = None,
        category_hint: Optional[str] = None
    ):
        """
        Asynchronous background task runner executing the 5 core stages of Veridexa:
        1. Parsing & Chunking
        2. AI Extraction
        3. Validation
        4. Enrichment
        5. Evidence Tracking & Database Save
        """
        async with AsyncSessionLocal() as session:
            job_repo = ProcessingRepository(session)
            product_repo = ProductRepository(session)
            
            try:
                # ---------------- STAGE 1: PARSING ----------------
                await job_repo.update_status(job_id, JobStatus.PROCESSING, "PARSING_DOCUMENT", 15)
                await asyncio.sleep(0.5)

                extracted_pages = []
                document_text = ""

                if source_type == "PDF" and file_path and os.path.exists(file_path):
                    extracted_pages = PDFProcessor.extract_pages(file_path)
                    document_text = "\n\n".join([p["text"] for p in extracted_pages])
                else:
                    document_text = TextProcessor.clean_text(raw_text or "")
                    extracted_pages = [{"page_number": 1, "text": document_text}]

                if not document_text.strip():
                    raise ValueError("Document content is empty or unreadable.")

                # ---------------- STAGE 2: AI EXTRACTION ----------------
                await job_repo.update_status(job_id, JobStatus.EXTRACTING, "AI_SCHEMA_EXTRACTION", 40)
                await asyncio.sleep(0.5)

                llm = get_llm_client()
                extracted_data = await llm.extract_product(document_text, category_hint=category_hint)

                # ---------------- STAGE 3: VALIDATION ----------------
                await job_repo.update_status(job_id, JobStatus.VALIDATING, "RULE_&_SEMANTIC_VALIDATION", 65)
                await asyncio.sleep(0.5)

                raw_attrs = extracted_data.get("attributes", [])
                val_status, val_results, conflicts = ValidationService.validate_attributes(
                    extracted_data.get("category", "Industrial Equipment"),
                    raw_attrs
                )

                # ---------------- STAGE 4: ENRICHMENT ----------------
                await job_repo.update_status(job_id, JobStatus.ENRICHING, "AI_DOMAIN_ENRICHMENT", 80)
                await asyncio.sleep(0.5)

                enrichment_items = await EnrichmentService.enrich(extracted_data)

                # ---------------- STAGE 5: EVIDENCE, CONFIDENCE & SAVE ----------------
                # Calculate metrics
                metrics = ConfidenceService.calculate_product_metrics(
                    raw_attrs,
                    extracted_data.get("category", "Industrial Equipment")
                )

                # Ensure unique SKU
                target_sku = extracted_data.get("sku") or f"KAV-{str(uuid.uuid4())[:8].upper()}"
                existing_sku = await product_repo.get_by_sku(target_sku)
                if existing_sku:
                    target_sku = f"{target_sku}-{str(uuid.uuid4())[:4].upper()}"

                # Create Product entity
                product_id = str(uuid.uuid4())
                source_id = str(uuid.uuid4())
                
                product = Product(
                    id=product_id,
                    sku=target_sku,
                    product_name=extracted_data.get("product_name") or "Industrial Component",
                    brand=extracted_data.get("brand") or "KAVRIX Industrial",
                    category=extracted_data.get("category") or "Industrial Equipment",
                    subcategory=extracted_data.get("subcategory"),
                    description=extracted_data.get("description"),
                    completeness=metrics["completeness"],
                    overall_confidence=metrics["overall_confidence"],
                    validation_status=ValidationStatus(val_status),
                    raw_attributes=extracted_data
                )

                # Add Source
                source = ProductSource(
                    id=source_id,
                    product_id=product_id,
                    source_type=SourceType(source_type),
                    file_name=file_name or "Industrial_Datasheet.pdf",
                    file_path=file_path,
                    raw_content=document_text[:5000]
                )
                product.sources.append(source)

                # Add Attributes & Evidence
                for attr_dict in raw_attrs:
                    name = attr_dict.get("name", "").strip()
                    val = str(attr_dict.get("value", "")).strip()
                    
                    if not name or not val:
                        continue

                    # Calculate evidence
                    ev_snippet = attr_dict.get("evidence_snippet") or ""
                    page_num = 1
                    char_start = None
                    char_end = None

                    if source_type == "PDF" and extracted_pages:
                        pdf_ev = PDFProcessor.find_snippet_in_pdf(extracted_pages, val)
                        if pdf_ev:
                            page_num = pdf_ev["page_number"]
                            ev_snippet = pdf_ev["snippet"]
                            char_start = pdf_ev["char_start"]
                            char_end = pdf_ev["char_end"]

                    # Compute transparent confidence
                    attr_conf = ConfidenceService.calculate_attribute_confidence(
                        origin_type=OriginType.EXTRACTED,
                        has_exact_evidence=bool(ev_snippet),
                        is_validated=True
                    )

                    attr_id = str(uuid.uuid4())
                    attr_obj = ProductAttribute(
                        id=attr_id,
                        product_id=product_id,
                        name=name,
                        value=val,
                        unit=attr_dict.get("unit"),
                        data_type=attr_dict.get("data_type", "string"),
                        origin_type=OriginType.EXTRACTED,
                        confidence=attr_conf,
                        status=AttributeStatus.VALIDATED if val_status != "CONFLICT" else AttributeStatus.CONFLICT
                    )

                    # Attach evidence
                    if ev_snippet:
                        ev_obj = ProductEvidence(
                            id=str(uuid.uuid4()),
                            attribute_id=attr_id,
                            source_id=source_id,
                            page_number=page_num,
                            snippet=ev_snippet,
                            char_start=char_start,
                            char_end=char_end
                        )
                        attr_obj.evidence.append(ev_obj)

                    product.attributes.append(attr_obj)

                # Add Validation Results
                for vr in val_results:
                    product.validation_results.append(
                        ValidationResult(
                            id=str(uuid.uuid4()),
                            product_id=product_id,
                            rule_name=vr["rule_name"],
                            rule_type=vr["rule_type"],
                            status=vr["status"],
                            field_name=vr.get("field_name"),
                            message=vr["message"],
                            conflicting_data=vr.get("conflicting_data")
                        )
                    )

                # Add Enrichment Results
                for er in enrichment_items:
                    origin = OriginType.ENRICHED if er.get("enrichment_type") == "ENRICHED" else OriginType.INFERRED
                    product.enrichment_results.append(
                        EnrichmentResult(
                            id=str(uuid.uuid4()),
                            product_id=product_id,
                            field_name=er["field_name"],
                            enriched_value=er["enriched_value"],
                            enrichment_type=origin,
                            rationale=er.get("rationale"),
                            confidence=er.get("confidence", 0.85)
                        )
                    )

                # Save Product to Database
                await product_repo.create(product)

                # Mark Job Completed
                await job_repo.update_status(
                    job_id=job_id,
                    status=JobStatus.COMPLETED,
                    stage="COMPLETED",
                    progress=100,
                    product_id=product.id
                )
                logger.info(f"Processing job {job_id} successfully completed for product {product.id} ({product.product_name})")

            except Exception as e:
                logger.error(f"Processing job {job_id} failed: {str(e)}", exc_info=True)
                await job_repo.update_status(
                    job_id=job_id,
                    status=JobStatus.FAILED,
                    stage="FAILED",
                    progress=100,
                    error_details=str(e)
                )
