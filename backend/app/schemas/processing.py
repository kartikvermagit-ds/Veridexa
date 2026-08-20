from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.models.processing_job import JobStatus

class IngestTextRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Raw unstructured industrial product text or datasheet excerpt")
    product_name_hint: Optional[str] = None
    category_hint: Optional[str] = None
    source_name: Optional[str] = "Manual Input"

class IngestUrlRequest(BaseModel):
    url: str = Field(..., description="Target product webpage or datasheet URL")
    category_hint: Optional[str] = None

class JobResponse(BaseModel):
    job_id: str
    status: JobStatus
    stage: str
    progress: int
    source_type: str
    file_name: Optional[str] = None
    product_id: Optional[str] = None
    error_details: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
