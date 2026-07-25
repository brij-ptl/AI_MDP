"""
Simple in-memory sliding-window rate limiter, keyed by client IP. Adequate for a single-
process deployment; swap for a Redis-backed limiter (e.g. slowapi + redis) behind a load
balancer with multiple workers.
"""
import time
from collections import defaultdict, deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.core.config import settings

_hits: dict[str, deque] = defaultdict(deque)


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window = 60.0
        limit = settings.RATE_LIMIT_PER_MINUTE

        bucket = _hits[client_ip]
        while bucket and now - bucket[0] > window:
            bucket.popleft()

        if len(bucket) >= limit:
            return JSONResponse(
                status_code=429,
                content={"success": False, "error_code": "RATE_LIMITED",
                         "message": "Too many requests. Please slow down and try again shortly."},
            )
        bucket.append(now)
        return await call_next(request)
