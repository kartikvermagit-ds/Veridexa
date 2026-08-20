from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy import select, func, desc, or_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.product import Product, ValidationStatus
from app.models.product_attribute import ProductAttribute, OriginType
from app.models.source import ProductSource
from app.models.evidence import ProductEvidence
from app.models.validation import ValidationResult
from app.models.enrichment import EnrichmentResult

class ProductRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, product_id: str) -> Optional[Product]:
        query = (
            select(Product)
            .where(Product.id == product_id)
            .options(
                selectinload(Product.attributes).selectinload(ProductAttribute.evidence),
                selectinload(Product.sources),
                selectinload(Product.validation_results),
                selectinload(Product.enrichment_results)
            )
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_sku(self, sku: str) -> Optional[Product]:
        query = select(Product).where(Product.sku == sku)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def list_products(
        self,
        category: Optional[str] = None,
        validation_status: Optional[str] = None,
        min_confidence: Optional[float] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[Product], int]:
        query = select(Product).options(selectinload(Product.attributes))
        
        if category:
            query = query.where(Product.category.ilike(f"%{category}%"))
        if validation_status:
            query = query.where(Product.validation_status == validation_status)
        if min_confidence is not None:
            query = query.where(Product.overall_confidence >= min_confidence)
        if search:
            search_filter = or_(
                Product.product_name.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%"),
                Product.category.ilike(f"%{search}%"),
                Product.brand.ilike(f"%{search}%")
            )
            query = query.where(search_filter)

        # Count total
        count_query = select(func.count()).select_from(query.order_by(None).subquery())
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one() or 0

        # Paginate
        query = query.order_by(desc(Product.created_at)).offset(skip).limit(limit)
        result = await self.session.execute(query)
        products = list(result.scalars().all())
        return products, total

    async def create(self, product: Product) -> Product:
        self.session.add(product)
        await self.session.commit()
        await self.session.refresh(product)
        return product

    async def save(self, product: Product) -> Product:
        self.session.add(product)
        await self.session.commit()
        await self.session.refresh(product)
        return product

    async def delete_by_id(self, product_id: str) -> bool:
        query = delete(Product).where(Product.id == product_id)
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def get_dashboard_stats(self) -> Dict[str, Any]:
        total_p_query = select(func.count(Product.id))
        total_p = (await self.session.execute(total_p_query)).scalar_one() or 0

        total_s_query = select(func.count(ProductSource.id))
        total_s = (await self.session.execute(total_s_query)).scalar_one() or 0

        avg_c_query = select(func.avg(Product.overall_confidence), func.avg(Product.completeness))
        avg_res = (await self.session.execute(avg_c_query)).first()
        avg_confidence = round(float(avg_res[0] or 0.0), 2)
        avg_completeness = round(float(avg_res[1] or 0.0), 2)

        # Validation status counts
        validated_q = select(func.count(Product.id)).where(Product.validation_status == ValidationStatus.VALIDATED)
        validated_c = (await self.session.execute(validated_q)).scalar_one() or 0

        conflict_q = select(func.count(Product.id)).where(Product.validation_status == ValidationStatus.CONFLICT)
        conflict_c = (await self.session.execute(conflict_q)).scalar_one() or 0

        anomaly_q = select(func.count(Product.id)).where(Product.validation_status == ValidationStatus.ANOMALY)
        anomaly_c = (await self.session.execute(anomaly_q)).scalar_one() or 0

        pending_q = select(func.count(Product.id)).where(Product.validation_status == ValidationStatus.PENDING)
        pending_c = (await self.session.execute(pending_q)).scalar_one() or 0

        # Category distribution
        cat_q = select(Product.category, func.count(Product.id)).group_by(Product.category)
        cat_res = (await self.session.execute(cat_q)).all()
        categories = [{"category": row[0], "count": row[1]} for row in cat_res]

        return {
            "total_products": total_p,
            "total_sources": total_s,
            "average_confidence": avg_confidence,
            "average_completeness": avg_completeness,
            "validation_breakdown": {
                "validated": validated_c,
                "with_conflicts": conflict_c,
                "anomalies": anomaly_c,
                "pending": pending_c
            },
            "category_distribution": categories,
            "active_conflicts_count": conflict_c
        }
