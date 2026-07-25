"""
Shared FastAPI dependencies.

`get_current_user` is the single place that enforces "compulsory sign-in everywhere":
every protected router depends on it, and it raises 401 if there's no valid access-token
cookie. `get_or_set_tracking_id` implements the separate anonymous tracking cookie that is
set on a visitor's very first request (before they ever register), used for basic funnel
analytics regardless of login state.
"""
from __future__ import annotations

from fastapi import Depends, Request, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import try_decode_token, new_tracking_id
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.database.session import get_db
from app.database.models.user import User


def get_or_set_tracking_id(request: Request, response: Response) -> str:
    tracking_id = request.cookies.get(settings.TRACKING_COOKIE_NAME)
    if not tracking_id:
        tracking_id = new_tracking_id()
        response.set_cookie(
            key=settings.TRACKING_COOKIE_NAME, value=tracking_id,
            httponly=False, secure=settings.COOKIE_SECURE, samesite=settings.COOKIE_SAMESITE,
            max_age=60 * 60 * 24 * 365 * 2, path="/",
        )
    return tracking_id


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get(settings.COOKIE_NAME)
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]
    if not token:
        raise UnauthorizedException("Please sign in to continue.")

    payload = try_decode_token(token)
    if not payload or payload.get("type") != "access":
        raise UnauthorizedException("Your session has expired. Please sign in again.")

    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user or not user.is_active:
        raise UnauthorizedException("Account not found or deactivated.")
    return user


def get_current_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise ForbiddenException("Admin access required.")
    return user


def get_optional_user(request: Request, db: Session = Depends(get_db)) -> User | None:
    """Used only by public pages that want to *personalize* if logged in, without requiring it."""
    token = request.cookies.get(settings.COOKIE_NAME)
    if not token:
        return None
    payload = try_decode_token(token)
    if not payload or payload.get("type") != "access":
        return None
    return db.query(User).filter(User.id == payload.get("sub")).first()
