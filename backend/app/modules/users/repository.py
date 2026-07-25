from sqlalchemy.orm import Session

from app.database.models.user import User
from app.database.models.medical_profile import MedicalProfile


def get_user(db: Session, user_id: str) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def update_user(db: Session, user: User, **fields) -> User:
    for k, v in fields.items():
        if v is not None:
            setattr(user, k, v)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_profile(db: Session, user_id: str) -> MedicalProfile | None:
    return db.query(MedicalProfile).filter(MedicalProfile.user_id == user_id).first()


def upsert_profile(db: Session, user_id: str, **fields) -> MedicalProfile:
    profile = get_profile(db, user_id)
    if not profile:
        profile = MedicalProfile(user_id=user_id, **fields)
        db.add(profile)
    else:
        for k, v in fields.items():
            if v is not None:
                setattr(profile, k, v)
    db.commit()
    db.refresh(profile)
    return profile
