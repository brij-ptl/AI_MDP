from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserProfileOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str | None = None
    role: str
    is_email_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    full_name: str | None = None
    phone: str | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
