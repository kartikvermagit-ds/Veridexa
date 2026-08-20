from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.models.product import ValidationStatus
from app.models.product_attribute import OriginType, AttributeStatus
from app.models.source import SourceType
from app.models.validation import RuleType, ValidationResultStatus

class EvidenceBase(BaseModel):
    page_number: Optional[int] = None
    snippet: str
    char_start: Optional[int] = None
    char_end: Optional[int] = None
    bounding_box: Optional[Dict[str, Any]] = None

class EvidenceResponse(EvidenceBase):
    id: str
    attribute_id: str
    source_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AttributeBase(BaseModel):
    name: str
    value: str
    raw_value: Optional[str] = None
    unit: Optional[str] = None
    data_type: str = "string"
    origin_type: OriginType = OriginType.EXTRACTED
    confidence: float = Field(ge=0.0, le=1.0, default=0.9)
    status: AttributeStatus = AttributeStatus.VALIDATED

class AttributeResponse(AttributeBase):
    id: str
    product_id: str
    evidence: List[EvidenceResponse] = []
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SourceResponse(BaseModel):
    id: str
    source_type: SourceType
    file_name: Optional[str] = None
    source_url: Optional[str] = None
    checksum: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ValidationResultResponse(BaseModel):
    id: str
    rule_name: str
    rule_type: RuleType
    status: ValidationResultStatus
    message: str
    field_name: Optional[str] = None
    conflicting_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class EnrichmentResultResponse(BaseModel):
    id: str
    field_name: str
    original_value: Optional[str] = None
    enriched_value: str
    enrichment_type: OriginType
    rationale: Optional[str] = None
    confidence: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProductBase(BaseModel):
    product_name: str
    sku: str
    brand: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    description: Optional[str] = None

class ProductListItem(BaseModel):
    id: str
    sku: str
    product_name: str
    brand: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    completeness: float
    overall_confidence: float
    validation_status: ValidationStatus
    attribute_count: int = 0
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProductDetailResponse(BaseModel):
    id: str
    sku: str
    product_name: str
    brand: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    description: Optional[str] = None
    completeness: float
    overall_confidence: float
    validation_status: ValidationStatus
    raw_attributes: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    # Nested graph
    attributes: List[AttributeResponse] = []
    sources: List[SourceResponse] = []
    validation_results: List[ValidationResultResponse] = []
    enrichment_results: List[EnrichmentResultResponse] = []
    
    # Computed breakdown
    extracted_count: int = 0
    enriched_count: int = 0
    inferred_count: int = 0
    missing_attributes: List[str] = []
    conflicts: List[Dict[str, Any]] = []
    model_config = ConfigDict(from_attributes=True)
