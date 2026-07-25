from sqlalchemy.orm import Session

from app.database.models.user import User
from app.modules.users import service as users_service
from app.schemas.user import UserUpdateRequest, ChangePasswordRequest
from app.schemas.medical_profile import MedicalProfileIn


def handle_update_profile(db: Session, user: User, payload: UserUpdateRequest) -> User:
    return users_service.update_profile_info(db, user, payload.full_name, payload.phone)


def handle_change_password(db: Session, user: User, payload: ChangePasswordRequest) -> User:
    return users_service.change_password(db, user, payload.current_password, payload.new_password)


def handle_save_medical_profile(db: Session, user: User, payload: MedicalProfileIn) -> dict:
    return users_service.save_medical_profile(db, user.id, payload.model_dump())


def handle_get_medical_profile(db: Session, user: User) -> dict | None:
    return users_service.get_medical_profile(db, user.id)
