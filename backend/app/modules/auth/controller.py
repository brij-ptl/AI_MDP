from fastapi import Response
from sqlalchemy.orm import Session

from app.modules.auth import service as auth_service
from app.services.jwt_service import set_auth_cookies, clear_auth_cookies
from app.schemas.auth import RegisterRequest, LoginRequest, AuthUserOut


def handle_register(db: Session, response: Response, payload: RegisterRequest, tracking_id: str | None):
    user = auth_service.register_user(
        db, payload.full_name, payload.email, payload.password, payload.phone, tracking_id
    )
    access, refresh = auth_service.issue_tokens(user)
    set_auth_cookies(response, access, refresh)
    return AuthUserOut.model_validate(user)


def handle_login(db: Session, response: Response, payload: LoginRequest):
    user = auth_service.authenticate(db, payload.email, payload.password)
    access, refresh = auth_service.issue_tokens(user)
    set_auth_cookies(response, access, refresh)
    return AuthUserOut.model_validate(user)


def handle_logout(response: Response):
    clear_auth_cookies(response)
