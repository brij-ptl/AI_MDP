"""
Primary auth enforcement happens per-route via Depends(get_current_user) (see
app/core/dependencies.py) so each router can decide exactly which endpoints are public
(e.g. /auth/login, /diseases catalogue) vs protected (dashboard, prediction, payment).

This middleware is an optional second layer that blocks a hard-coded list of prefixes
outright at the edge, mainly to guarantee "compulsory sign-in" is enforced even if a
future route forgets to add the dependency.
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.core.config import settings
from app.core.security import try_decode_token

ALWAYS_PROTECTED_PREFIXES = (
    f"{settings.API_V1_PREFIX}/dashboard",
    f"{settings.API_V1_PREFIX}/prediction",
    f"{settings.API_V1_PREFIX}/symptom-checker",
    f"{settings.API_V1_PREFIX}/ocr",
    f"{settings.API_V1_PREFIX}/reports",
    f"{settings.API_V1_PREFIX}/history",
    f"{settings.API_V1_PREFIX}/subscription",
    f"{settings.API_V1_PREFIX}/payment",
    f"{settings.API_V1_PREFIX}/notifications",
    f"{settings.API_V1_PREFIX}/admin",
)


class AuthGuardMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if path.startswith(ALWAYS_PROTECTED_PREFIXES):
            token = request.cookies.get(settings.COOKIE_NAME)
            if not token and not request.headers.get("Authorization", "").startswith("Bearer "):
                return JSONResponse(
                    status_code=401,
                    content={"success": False, "error_code": "UNAUTHORIZED",
                             "message": "Please sign in to continue."},
                )
            if token and not try_decode_token(token):
                return JSONResponse(
                    status_code=401,
                    content={"success": False, "error_code": "UNAUTHORIZED",
                             "message": "Your session has expired. Please sign in again."},
                )
        return await call_next(request)
