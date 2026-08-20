from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.product_service import ProductService
from app.schemas.common import ApiResponse, ApiMeta
from app.schemas.product import ProductListItem, ProductDetailResponse

router = APIRouter(prefix="/products", tags=["Product Intelligence"])

@router.get("", response_model=ApiResponse[List[ProductListItem]])
async def list_products(
    category: Optional[str] = Query(None, description="Filter by product category"),
    validation_status: Optional[str] = Query(None, description="Filter by validation status (VALIDATED, CONFLICT, ANOMALY, PENDING)"),
    min_confidence: Optional[float] = Query(None, ge=0.0, le=1.0, description="Minimum confidence threshold"),
    search: Optional[str] = Query(None, description="Search keyword in name, SKU, category, or brand"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Search and filter products across the industrial intelligence catalog.
    """
    service = ProductService(db)
    products, total = await service.list_products(
        category=category,
        validation_status=validation_status,
        min_confidence=min_confidence,
        search=search,
        page=page,
        page_size=page_size
    )

    items = []
    for p in products:
        items.append(
            ProductListItem(
                id=p.id,
                sku=p.sku,
                product_name=p.product_name,
                brand=p.brand,
                category=p.category,
                subcategory=p.subcategory,
                completeness=p.completeness,
                overall_confidence=p.overall_confidence,
                validation_status=p.validation_status,
                attribute_count=len(p.attributes) if p.attributes else 0,
                created_at=p.created_at,
                updated_at=p.updated_at
            )
        )

    meta = ApiMeta(total_count=total, page=page, page_size=page_size)
    return ApiResponse(success=True, data=items, meta=meta, message=f"Retrieved {len(items)} products.")

@router.get("/{product_id}", response_model=ApiResponse[ProductDetailResponse])
async def get_product_detail(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve full product intelligence record, including extracted vs enriched specs,
    attached evidence snippets, and active validation conflicts.
    """
    service = ProductService(db)
    detail = await service.get_product(product_id)
    return ApiResponse.success_response(data=detail, message="Product record retrieved successfully.")

@router.delete("/{product_id}", response_model=ApiResponse[dict])
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a product and all associated attributes, evidence, and validation logs.
    """
    service = ProductService(db)
    await service.delete_product(product_id)
    return ApiResponse.success_response(data={"deleted_id": product_id}, message="Product deleted successfully.")
