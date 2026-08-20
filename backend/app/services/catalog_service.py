import io
import csv
import json
from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.product_repository import ProductRepository

class CatalogService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ProductRepository(session)

    async def export_catalog(self, format_type: str = "json") -> Tuple[str, str]:
        """
        Exports the entire product catalog in commerce-ready format.
        Returns (content_string, media_type)
        """
        products, _ = await self.repo.list_products(limit=500)

        if format_type.lower() == "csv":
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow([
                "Product ID", "SKU", "Product Name", "Brand", "Category", 
                "Completeness (%)", "Confidence (%)", "Validation Status", "Created Date"
            ])
            for p in products:
                writer.writerow([
                    p.id,
                    p.sku,
                    p.product_name,
                    p.brand or "N/A",
                    p.category,
                    f"{int(p.completeness * 100)}%",
                    f"{int(p.overall_confidence * 100)}%",
                    p.validation_status.value,
                    p.created_at.strftime("%Y-%m-%d %H:%M:%S")
                ])
            return output.getvalue(), "text/csv"

        # JSON export
        export_data = []
        for p in products:
            attrs = {a.name: a.value for a in p.attributes}
            export_data.append({
                "id": p.id,
                "sku": p.sku,
                "product_name": p.product_name,
                "brand": p.brand,
                "category": p.category,
                "subcategory": p.subcategory,
                "description": p.description,
                "completeness": p.completeness,
                "overall_confidence": p.overall_confidence,
                "validation_status": p.validation_status.value,
                "specifications": attrs,
                "created_at": p.created_at.isoformat()
            })
        return json.dumps(export_data, indent=2), "application/json"
