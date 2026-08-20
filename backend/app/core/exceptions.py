from typing import Any, Optional, Dict

class VeridexaException(Exception):
    """Base exception for Veridexa backend domain errors."""
    def __init__(self, message: str, code: str = "INTERNAL_ERROR", status_code: int = 500, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}


class NotFoundException(VeridexaException):
    def __init__(self, resource: str, identifier: Any):
        super().__init__(
            message=f"{resource} with identifier '{identifier}' was not found.",
            code="NOT_FOUND",
            status_code=404,
            details={"resource": resource, "identifier": str(identifier)}
        )


class ValidationException(VeridexaException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="VALIDATION_FAILED",
            status_code=422,
            details=details
        )


class ConflictException(VeridexaException):
    def __init__(self, message: str, conflicts: list):
        super().__init__(
            message=message,
            code="SPEC_CONFLICT",
            status_code=409,
            details={"conflicts": conflicts}
        )


class IngestionException(VeridexaException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="INGESTION_ERROR",
            status_code=400,
            details=details
        )


class AIProviderException(VeridexaException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="AI_PROVIDER_ERROR",
            status_code=502,
            details=details
        )
