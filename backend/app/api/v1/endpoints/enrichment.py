from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.product_service import ProductService
from app.schemas.common import ApiResponse
from app.schemas.enrichment import EnrichmentRunResponse

router = APIRouter(prefix="/products", tags=["AI Enrichment"])

@router.post("/{product_id}/enrich", response_model=ApiResponse[EnrichmentRunResponse])
async def trigger_enrichment(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Runs AI-driven domain enrichment (application mapping, standard recommendations, search keywords).
    """
    service = ProductService(db)
    result = await service.enrich_product(product_id)
    return ApiResponse.success_response(data=result, message="Enrichment completed.")
