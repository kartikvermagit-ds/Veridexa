from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.product_service import ProductService
from app.schemas.common import ApiResponse
from app.schemas.validation import ValidationRunResponse, ConflictResolutionRequest

router = APIRouter(prefix="/products", tags=["Validation & Conflict Resolution"])

@router.post("/{product_id}/validate", response_model=ApiResponse[ValidationRunResponse])
async def trigger_validation(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Triggers re-validation of a product against deterministic rule catalogs and AI semantic auditors.
    """
    service = ProductService(db)
    result = await service.revalidate_product(product_id)
    return ApiResponse.success_response(data=result, message="Validation completed.")

@router.post("/{product_id}/resolve-conflict", response_model=ApiResponse[dict])
async def resolve_conflict(
    product_id: str,
    payload: ConflictResolutionRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Allows domain engineers to resolve conflicting specifications between multiple sources.
    """
    service = ProductService(db)
    result = await service.resolve_conflict(
        product_id=product_id,
        attribute_name=payload.attribute_name,
        selected_value=payload.selected_value,
        selected_source=payload.selected_source,
        notes=payload.resolution_notes
    )
    return ApiResponse.success_response(data=result, message="Conflict resolved successfully.")
