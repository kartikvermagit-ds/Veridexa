from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import VeridexaException
from app.core.telemetry import TelemetryMiddleware
from app.db.init_db import init_db
from app.api.router import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} in {settings.ENVIRONMENT} mode...")
    await init_db()
    yield
    logger.info("Shutting down Veridexa engine...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Enterprise-grade AI-powered product intelligence engine transforming industrial documents into validated, enriched, and explainable commerce data.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Telemetry and Observability Middleware
app.add_middleware(TelemetryMiddleware)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers
@app.exception_handler(VeridexaException)
async def veridexa_exception_handler(request: Request, exc: VeridexaException):
    logger.warning(f"Domain exception on {request.url.path}: {exc.message} (Code: {exc.code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "data": None,
            "message": exc.message,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details
            }
        }
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "data": None,
            "message": "An internal server error occurred. Please contact system support.",
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": str(exc) if settings.DEBUG else "Internal server error"
            }
        }
    )

# Include Centralized API Router
app.include_router(api_router)

@app.get("/")
async def root():
    return {
        "product": "VERIDEXA",
        "team": "KAVRIX",
        "tagline": "AI-Powered Product Intelligence",
        "challenge": "UniHack 2026",
        "docs": "/docs",
        "status": "ONLINE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
