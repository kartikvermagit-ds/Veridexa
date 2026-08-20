from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    products,
    processing,
    validation,
    enrichment,
    evidence,
    catalog,
    dashboard
)

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(products.router)
api_router.include_router(processing.router)
api_router.include_router(validation.router)
api_router.include_router(enrichment.router)
api_router.include_router(evidence.router)
api_router.include_router(catalog.router)
api_router.include_router(dashboard.router)
