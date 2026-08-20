from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.product_repository import ProductRepository
from app.repositories.processing_repository import ProcessingRepository
from app.schemas.common import ApiResponse
from app.schemas.dashboard import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Telemetry"])

@router.get("/stats", response_model=ApiResponse[DashboardStats])
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db)
):
    """
    Returns high-level catalog intelligence metrics, extraction accuracy rates,
    and validation breakdown.
    """
    prod_repo = ProductRepository(db)
    job_repo = ProcessingRepository(db)

    stats = await prod_repo.get_dashboard_stats()
    recent_jobs = await job_repo.list_recent(limit=50)

    data = DashboardStats(
        total_products=stats["total_products"],
        total_sources=stats["total_sources"],
        average_completeness=stats["average_completeness"],
        average_confidence=stats["average_confidence"],
        validation_breakdown=stats["validation_breakdown"],
        category_distribution=stats["category_distribution"],
        recent_jobs_count=len(recent_jobs),
        active_conflicts_count=stats["active_conflicts_count"]
    )

    return ApiResponse.success_response(data=data, message="Dashboard metrics calculated successfully.")
