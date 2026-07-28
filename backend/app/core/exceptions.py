"""Application-wide exception hierarchy + FastAPI exception handlers."""
from fastapi import Request, status
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Base class for all predictable, handled application errors."""

    status_code = status.HTTP_400_BAD_REQUEST
    error_code = "APP_ERROR"

    def __init__(self, message: str = "An error occurred", status_code: int | None = None,
                 error_code: str | None = None, details: dict | None = None):
        self.message = message
        self.status_code = status_code or self.status_code
        self.error_code = error_code or self.error_code
        self.details = details or {}
        super().__init__(message)


class NotFoundException(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "NOT_FOUND"


class UnauthorizedException(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "UNAUTHORIZED"


class ForbiddenException(AppException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "FORBIDDEN"


class ConflictException(AppException):
    status_code = status.HTTP_409_CONFLICT
    error_code = "CONFLICT"


class ValidationException(AppException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    error_code = "VALIDATION_ERROR"


class PaymentRequiredException(AppException):
    status_code = status.HTTP_402_PAYMENT_REQUIRED
    error_code = "PAYMENT_REQUIRED"


class RateLimitException(AppException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    error_code = "RATE_LIMITED"


class ModelNotAvailableException(AppException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    error_code = "MODEL_UNAVAILABLE"


from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.logging import get_logger

logger = get_logger("error")

async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    # We do not log 404s or 401s as full errors, but warning if needed.
    # For now, just return the response.
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": exc.error_code,
            "message": exc.message,
            "details": exc.details,
        },
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error_code": "VALIDATION_ERROR",
            "message": "Invalid request parameters.",
            "details": exc.errors(),
        },
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": f"HTTP_{exc.status_code}",
            "message": str(exc.detail),
            "details": {},
        },
    )

async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    # Log the full exception on the server side securely (JSON formatter will handle traceback)
    logger.exception(f"Unhandled server error on {request.method} {request.url.path}: {str(exc)}")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "Something went wrong on our end. Please try again later.",
            "details": {},
        },
    )

def register_exception_handlers(app):
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
