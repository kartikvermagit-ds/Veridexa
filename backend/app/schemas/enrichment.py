from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class EnrichmentRequest(BaseModel):
    include_applications: bool = True
    include_standards: bool = True
    include_search_tags: bool = True

class EnrichmentRunResponse(BaseModel):
    product_id: str
    enriched_fields_count: int
    items: List[Dict[str, Any]]
