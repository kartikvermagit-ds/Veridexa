from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db
from app.schemas.common import ApiResponse
from app.core.config import settings

router = APIRouter(tags=["Health & System Diagnostics"])

@router.get("/health", response_model=ApiResponse[dict])
async def check_health(db: AsyncSession = Depends(get_db)):
    """
    Returns system status, database connectivity, and configured AI provider.
    """
    db_status = "HEALTHY"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"UNHEALTHY ({str(e)})"

    return ApiResponse.success_response(
        data={
            "app_name": settings.APP_NAME,
            "environment": settings.ENVIRONMENT,
            "database_status": db_status,
            "llm_provider": settings.LLM_PROVIDER,
            "llm_model": settings.LLM_MODEL,
            "version": "1.0.0"
        },
        message="Veridexa intelligence engine is operational."
    )
