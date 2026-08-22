import os
import uuid
import asyncio
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.config import settings
from app.core.exceptions import IngestionException
from app.services.processing_service import ProcessingService
from app.repositories.processing_repository import ProcessingRepository
from app.schemas.common import ApiResponse
from app.schemas.processing import JobResponse, IngestTextRequest

router = APIRouter(tags=["Product Ingestion & Pipeline"])

@router.post("/products/process", response_model=ApiResponse[JobResponse])
async def process_product(
    background_tasks: BackgroundTasks,
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    source_url: Optional[str] = Form(None),
    category_hint: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Ingests an industrial product datasheet (PDF upload, raw technical text, or URL)
    and kicks off the Veridexa 5-stage background processing pipeline.
    """
    if not file and not raw_text and not source_url:
        raise IngestionException("At least one input source (file, raw_text, or source_url) must be provided.")

    source_type = "TEXT"
    file_path = None
    file_name = None

    if file:
        fname_lower = (file.filename or "").lower()
        if not (fname_lower.endswith(".pdf") or fname_lower.endswith(".csv") or fname_lower.endswith(".txt")):
            raise IngestionException("Unsupported file type. Only PDF, CSV, and TXT files are accepted.")
        
        if fname_lower.endswith(".pdf"):
            source_type = "PDF"
        elif fname_lower.endswith(".csv"):
            source_type = "CSV"
        else:
            source_type = "TEXT"
            
        file_name = file.filename
        
        # Save file to uploads directory
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        unique_name = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(settings.UPLOAD_DIR, unique_name)
        
        content = await file.read()
        if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
            raise IngestionException(f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB.")
        
        with open(file_path, "wb") as f:
            f.write(content)

    elif source_url:
        source_type = "URL"
        file_name = source_url
        raw_text = f"Product catalog information from {source_url}"

    # Create job in database
    job = await ProcessingService.create_job(db, source_type=source_type, file_name=file_name)

    # Launch pipeline in background task
    background_tasks.add_task(
        ProcessingService.run_pipeline_async,
        job_id=job.id,
        source_type=source_type,
        raw_text=raw_text,
        file_path=file_path,
        file_name=file_name,
        category_hint=category_hint
    )

    job_res = JobResponse(
        job_id=job.id,
        status=job.status,
        stage=job.stage,
        progress=job.progress,
        source_type=job.source_type,
        file_name=job.file_name,
        product_id=job.product_id,
        created_at=job.created_at
    )
    return ApiResponse.success_response(data=job_res, message="Processing job queued successfully.")


@router.post("/products/process-text", response_model=ApiResponse[JobResponse])
async def process_text_payload(
    payload: IngestTextRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Direct JSON endpoint for raw text / datasheet snippet ingestion.
    """
    job = await ProcessingService.create_job(db, source_type="TEXT", file_name=payload.source_name)

    background_tasks.add_task(
        ProcessingService.run_pipeline_async,
        job_id=job.id,
        source_type="TEXT",
        raw_text=payload.text,
        file_path=None,
        file_name=payload.source_name,
        category_hint=payload.category_hint
    )

    job_res = JobResponse(
        job_id=job.id,
        status=job.status,
        stage=job.stage,
        progress=job.progress,
        source_type=job.source_type,
        file_name=job.file_name,
        product_id=job.product_id,
        created_at=job.created_at
    )
    return ApiResponse.success_response(data=job_res, message="Processing job queued successfully.")


@router.get("/processing/jobs/{job_id}", response_model=ApiResponse[JobResponse])
async def get_job_status(
    job_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Poll the status of an ongoing product extraction/validation job.
    """
    repo = ProcessingRepository(db)
    job = await repo.get_by_id(job_id)
    if not job:
        raise IngestionException(f"Job with ID '{job_id}' not found.")

    job_res = JobResponse(
        job_id=job.id,
        status=job.status,
        stage=job.stage,
        progress=job.progress,
        source_type=job.source_type,
        file_name=job.file_name,
        product_id=job.product_id,
        error_details=job.error_details,
        created_at=job.created_at,
        completed_at=job.completed_at
    )
    return ApiResponse.success_response(data=job_res, message=f"Job status is {job.status.value}.")


@router.get("/processing/jobs", response_model=ApiResponse[List[JobResponse]])
async def list_recent_jobs(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    List recent background processing jobs for observability and dashboard tracking.
    """
    repo = ProcessingRepository(db)
    jobs = await repo.list_recent(limit=limit)
    items = [
        JobResponse(
            job_id=j.id,
            status=j.status,
            stage=j.stage,
            progress=j.progress,
            source_type=j.source_type,
            file_name=j.file_name,
            product_id=j.product_id,
            error_details=j.error_details,
            created_at=j.created_at,
            completed_at=j.completed_at
        )
        for j in jobs
    ]
    return ApiResponse.success_response(data=items, message=f"Retrieved {len(items)} jobs.")
