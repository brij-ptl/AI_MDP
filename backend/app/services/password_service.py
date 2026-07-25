"""Service-layer wrapper around app.core.security's password hashing."""
import secrets

from app.core.security import hash_password, verify_password

__all__ = ["hash_password", "verify_password", "generate_reset_token"]


def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)
