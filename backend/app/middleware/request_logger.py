"""
More detailed request logger than middleware/logging.py: attaches a request id, logs
client IP and tracking cookie (if present) for basic funnel/audit purposes. Used for the
admin panel's 'System Logs' screen instead of app/logs/app.log noise.
"""
import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("access")


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = uuid.uuid4().hex[:12]
        request.state.request_id = request_id
        start = time.time()

        response = await call_next(request)

        duration_ms = round((time.time() - start) * 1000, 2)
        tracking_id = request.cookies.get(settings.TRACKING_COOKIE_NAME, "-")
        client_ip = request.client.host if request.client else "-"

        # Log with structured extra fields for JSON formatter
        logger.info(
            f"{request.method} {request.url.path} -> {response.status_code} {duration_ms}ms",
            extra={
                "request_id": request_id,
                "client_ip": client_ip,
                "duration_ms": duration_ms,
                "tracking_id": tracking_id,
                "method": request.method,
                "path": request.url.path,
                "status": response.status_code
            }
        )
        response.headers["X-Request-ID"] = request_id
        return response
