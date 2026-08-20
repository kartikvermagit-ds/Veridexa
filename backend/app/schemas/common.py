from typing import Generic, TypeVar, Optional, Any, Dict
from datetime import datetime, timezone
from pydantic import BaseModel, Field

T = TypeVar("T")

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class ApiMeta(BaseModel):
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    version: str = "v1"
    total_count: Optional[int] = None
    page: Optional[int] = None
    page_size: Optional[int] = None

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = "Operation completed successfully"
    error: Optional[ErrorDetail] = None
    meta: ApiMeta = Field(default_factory=ApiMeta)

    @classmethod
    def success_response(cls, data: T, message: str = "Operation completed successfully", meta: Optional[ApiMeta] = None):
        return cls(success=True, data=data, message=message, meta=meta or ApiMeta())

    @classmethod
    def error_response(cls, code: str, message: str, details: Optional[Dict[str, Any]] = None):
        return cls(
            success=False,
            data=None,
            message=message,
            error=ErrorDetail(code=code, message=message, details=details),
            meta=ApiMeta()
        )
