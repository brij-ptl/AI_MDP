"""
JWT token creation/verification and password hashing.
Session strategy: HttpOnly JWT cookie (access + refresh) -> compulsory sign-in
is enforced by app.core.dependencies.get_current_user on every protected route.
"""
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------------------------------------------------------------- passwords
def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ---------------------------------------------------------------- JWT
def _create_token(data: dict, expires_delta: timedelta, token_type: str) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    to_encode.update({
        "exp": now + expires_delta,
        "iat": now,
        "type": token_type,
        "jti": str(uuid.uuid4()),
    })
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(user_id: str, role: str, extra: Optional[dict] = None) -> str:
    payload = {"sub": user_id, "role": role}
    if extra:
        payload.update(extra)
    return _create_token(payload, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES), "access")


def create_refresh_token(user_id: str) -> str:
    return _create_token({"sub": user_id}, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS), "refresh")


def decode_token(token: str) -> dict:
    """Raises JWTError on invalid/expired token."""
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])


def try_decode_token(token: str) -> Optional[dict]:
    try:
        return decode_token(token)
    except JWTError:
        return None


def new_tracking_id() -> str:
    """Anonymous tracking cookie id, set on very first visit (pre-login)."""
    return f"trk_{uuid.uuid4().hex}"
