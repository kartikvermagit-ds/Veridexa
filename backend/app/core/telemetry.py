import time
from typing import Dict, Any
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.core.logging import logger

class TelemetryTracker:
    """
    In-memory performance and observability metrics for Veridexa.
    Tracks request latency, total API requests, and error counters.
    """
    total_requests: int = 0
    total_errors: int = 0
    total_processing_jobs: int = 0
    avg_latency_ms: float = 0.0
    _latencies: list = []

    @classmethod
    def record_request(cls, duration_ms: float, status_code: int):
        cls.total_requests += 1
        if status_code >= 400:
            cls.total_errors += 1
        cls._latencies.append(duration_ms)
        if len(cls._latencies) > 200:
            cls._latencies.pop(0)
        cls.avg_latency_ms = round(sum(cls._latencies) / len(cls._latencies), 2)

    @classmethod
    def get_metrics(cls) -> Dict[str, Any]:
        return {
            "total_requests": cls.total_requests,
            "total_errors": cls.total_errors,
            "error_rate_pct": round((cls.total_errors / cls.total_requests * 100) if cls.total_requests > 0 else 0.0, 2),
            "avg_latency_ms": cls.avg_latency_ms,
            "recorded_samples": len(cls._latencies)
        }

class TelemetryMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.perf_counter()
        response = await call_next(request)
        duration_ms = (time.perf_counter() - start_time) * 1000.0
        
        TelemetryTracker.record_request(duration_ms, response.status_code)
        
        # Add latency header
        response.headers["X-Response-Time-Ms"] = f"{duration_ms:.2f}"
        return response
