from typing import List, Dict, Any
from pydantic import BaseModel

class CategoryDistribution(BaseModel):
    category: str
    count: int

class ValidationBreakdown(BaseModel):
    validated: int
    with_conflicts: int
    anomalies: int
    pending: int

class DashboardStats(BaseModel):
    total_products: int
    total_sources: int
    average_completeness: float
    average_confidence: float
    validation_breakdown: ValidationBreakdown
    category_distribution: List[CategoryDistribution]
    recent_jobs_count: int
    active_conflicts_count: int
