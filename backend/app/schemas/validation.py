from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.validation import ValidationResultStatus

class ValidationRunResponse(BaseModel):
    product_id: str
    validation_status: str
    total_checks: int
    passed_checks: int
    failed_checks: int
    conflicts_detected: int
    results: List[Dict[str, Any]]

class ConflictResolutionRequest(BaseModel):
    attribute_name: str
    selected_value: str
    selected_source: Optional[str] = None
    resolution_notes: Optional[str] = None
