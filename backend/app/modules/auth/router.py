from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user, get_or_set_tracking_id
from app.core.config import settings
from app.schemas.auth import (
    RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest,
    VerifyEmailRequest, TokenResponse, AuthUserOut,
)
from app.modules.auth import controller, service as auth_service
from app.utils.response import success_response
from app.database.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, response: Response, request: Request, db: Session = Depends(get_db)):
    tracking_id = get_or_set_tracking_id(request, response)
    user_out = controller.handle_register(db, response, payload, tracking_id)
    return TokenResponse(message="Registration successful.", user=user_out)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user_out = controller.handle_login(db, response, payload)
    return TokenResponse(message="Login successful.", user=user_out)


@router.post("/logout")
def logout(response: Response):
    controller.handle_logout(response)
    return success_response(message="Logged out successfully.")


@router.post("/refresh")
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)
    from app.core.exceptions import UnauthorizedException
    if not refresh_token:
        raise UnauthorizedException("No refresh token found. Please sign in again.")
    new_access, user = auth_service.refresh_access_token(db, refresh_token)
    response.set_cookie(
        key=settings.COOKIE_NAME, value=new_access, httponly=True,
        secure=settings.COOKIE_SECURE, samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, path="/",
    )
    return success_response(message="Token refreshed.")


@router.post("/verify-email")
def verify_email(payload: VerifyEmailRequest, db: Session = Depends(get_db)):
    auth_service.verify_email(db, payload.token)
    return success_response(message="Email verified successfully.")


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    auth_service.request_password_reset(db, payload.email)
    return success_response(message="If that email exists, a reset link has been sent.")


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    auth_service.reset_password(db, payload.token, payload.new_password)
    return success_response(message="Password reset successfully. Please sign in.")


@router.get("/me", response_model=AuthUserOut)
def me(current_user: User = Depends(get_current_user)):
    return AuthUserOut.model_validate(current_user)
