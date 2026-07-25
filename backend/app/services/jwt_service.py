"""Service-layer wrapper around app.core.security's JWT helpers, plus cookie helpers."""
from fastapi import Response

from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, decode_token, try_decode_token

__all__ = ["create_access_token", "create_refresh_token", "decode_token", "try_decode_token",
           "set_auth_cookies", "clear_auth_cookies"]


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        key=settings.COOKIE_NAME, value=access_token, httponly=True,
        secure=settings.COOKIE_SECURE, samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, path="/",
    )
    response.set_cookie(
        key=settings.REFRESH_COOKIE_NAME, value=refresh_token, httponly=True,
        secure=settings.COOKIE_SECURE, samesite=settings.COOKIE_SAMESITE,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600, path="/",
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(settings.COOKIE_NAME, path="/")
    response.delete_cookie(settings.REFRESH_COOKIE_NAME, path="/")
