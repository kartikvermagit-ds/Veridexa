from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.product_service import ProductService
from app.schemas.common import ApiResponse

router = APIRouter(prefix="/products", tags=["Evidence & Traceability"])

@router.get("/{product_id}/evidence", response_model=ApiResponse[list])
async def get_product_evidence(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves all evidence snippets, source document citations, and page mappings for a product.
    """
    service = ProductService(db)
    detail = await service.get_product(product_id)
    
    evidence_items = []
    for attr in detail["attributes"]:
        for ev in attr.evidence:
            evidence_items.append({
                "attribute_id": attr.id,
                "attribute_name": attr.name,
                "attribute_value": attr.value,
                "origin_type": attr.origin_type.value,
                "confidence": attr.confidence,
                "page_number": ev.page_number,
                "snippet": ev.snippet,
                "char_start": ev.char_start,
                "char_end": ev.char_end,
                "created_at": ev.created_at
            })

    return ApiResponse.success_response(data=evidence_items, message=f"Retrieved {len(evidence_items)} evidence citations.")
