from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/catalog", tags=["Catalog & Commerce Export"])

@router.get("/export")
async def export_catalog(
    format: str = Query("json", pattern="^(json|csv)$", description="Export format: json or csv"),
    db: AsyncSession = Depends(get_db)
):
    """
    Exports commerce-ready structured catalog data in JSON or CSV format.
    """
    service = CatalogService(db)
    content, media_type = await service.export_catalog(format_type=format)
    
    filename = f"veridexa_catalog_export.{format}"
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
