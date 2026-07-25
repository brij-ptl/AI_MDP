from __future__ import annotations
from datetime import datetime, timedelta
import secrets

from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, try_decode_token
from app.modules.auth import repository as auth_repo
from app.modules.auth.exceptions import (
    EmailAlreadyRegisteredException, InvalidCredentialsException,
    InvalidOrExpiredTokenException, AccountDeactivatedException,
)
from app.services.email_service import send_verification_email, send_password_reset_email
from app.database.models.user import User


def register_user(db: Session, full_name: str, email: str, password: str, phone: str | None,
                   tracking_id: str | None) -> User:
    if auth_repo.get_by_email(db, email):
        raise EmailAlreadyRegisteredException()

    verification_token = secrets.token_urlsafe(24)
    user = auth_repo.create_user(
        db, full_name=full_name, email=email, password_hash=hash_password(password),
        phone=phone, role="user", is_active=True, is_email_verified=False,
        email_verification_token=verification_token, tracking_id=tracking_id,
    )
    send_verification_email(user.email, user.full_name, verification_token)
    return user


def authenticate(db: Session, email: str, password: str) -> User:
    user = auth_repo.get_by_email(db, email)

    if not user or not verify_password(password, user.password_hash):
        raise InvalidCredentialsException()

    if not user.is_active:
        raise AccountDeactivatedException()

    user.last_login_at = datetime.utcnow()
    user.login_count = (user.login_count or 0) + 1
    auth_repo.save(db, user)

    return user


def issue_tokens(user: User) -> tuple[str, str]:
    access = create_access_token(user.id, user.role)
    refresh = create_refresh_token(user.id)
    return access, refresh


def refresh_access_token(db: Session, refresh_token: str) -> tuple[str, User]:
    payload = try_decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise InvalidOrExpiredTokenException()
    user = auth_repo.get_by_id(db, payload.get("sub"))
    if not user or not user.is_active:
        raise InvalidOrExpiredTokenException()
    return create_access_token(user.id, user.role), user


def verify_email(db: Session, token: str) -> User:
    user = auth_repo.get_by_verification_token(db, token)
    if not user:
        raise InvalidOrExpiredTokenException()
    user.is_email_verified = True
    user.email_verification_token = None
    return auth_repo.save(db, user)


def request_password_reset(db: Session, email: str) -> None:
    user = auth_repo.get_by_email(db, email)
    if not user:
        # Do not leak whether the email exists.
        return
    token = secrets.token_urlsafe(24)
    user.password_reset_token = token
    user.password_reset_expires = datetime.utcnow() + timedelta(hours=1)
    auth_repo.save(db, user)
    send_password_reset_email(user.email, user.full_name, token)


def reset_password(db: Session, token: str, new_password: str) -> User:
    user = auth_repo.get_by_reset_token(db, token)
    if not user or not user.password_reset_expires or user.password_reset_expires < datetime.utcnow():
        raise InvalidOrExpiredTokenException()
    user.password_hash = hash_password(new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    return auth_repo.save(db, user)
