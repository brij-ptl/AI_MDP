from sqlalchemy.orm import Session

from app.core.security import verify_password, hash_password
from app.core.exceptions import ValidationException
from app.database.models.user import User
from app.modules.users import repository as users_repo
from app.ml.preprocessing.feature_engineering import compute_bmi


def update_profile_info(db: Session, user: User, full_name: str | None, phone: str | None) -> User:
    return users_repo.update_user(db, user, full_name=full_name, phone=phone)


def change_password(db: Session, user: User, current_password: str, new_password: str) -> User:
    if not verify_password(current_password, user.password_hash):
        raise ValidationException("Current password is incorrect.")
    user.password_hash = hash_password(new_password)
    return users_repo.update_user(db, user)


def save_medical_profile(db: Session, user_id: str, data: dict) -> dict:
    profile = users_repo.upsert_profile(db, user_id, **data)
    out = {c.name: getattr(profile, c.name) for c in profile.__table__.columns}
    if profile.height_cm and profile.weight_kg:
        out["bmi"] = compute_bmi(profile.weight_kg, profile.height_cm)
    else:
        out["bmi"] = None
    return out


def get_medical_profile(db: Session, user_id: str) -> dict | None:
    profile = users_repo.get_profile(db, user_id)
    if not profile:
        return None
    out = {c.name: getattr(profile, c.name) for c in profile.__table__.columns}
    out["bmi"] = compute_bmi(profile.weight_kg, profile.height_cm) if profile.height_cm and profile.weight_kg else None
    return out
