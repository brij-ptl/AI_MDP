from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.database.models.user import User
from app.database.models.feedback import Feedback
from app.schemas.user import UserProfileOut, UserUpdateRequest, ChangePasswordRequest
from app.schemas.medical_profile import MedicalProfileIn, MedicalProfileOut
from app.schemas.feedback import FeedbackCreate, FeedbackOut
from app.modules.users import controller
from app.utils.response import success_response

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileOut)
def get_me(user: User = Depends(get_current_user)):
    return UserProfileOut.model_validate(user)


@router.put("/me")
def update_me(payload: UserUpdateRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    updated = controller.handle_update_profile(db, user, payload)
    return success_response(UserProfileOut.model_validate(updated), "Profile updated.")


@router.post("/me/change-password")
def change_password(payload: ChangePasswordRequest, db: Session = Depends(get_db),
                     user: User = Depends(get_current_user)):
    controller.handle_change_password(db, user, payload)
    return success_response(message="Password changed successfully.")


@router.get("/me/medical-profile")
def get_medical_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = controller.handle_get_medical_profile(db, user)
    return success_response(profile, "Medical profile fetched.")


@router.put("/me/medical-profile")
def save_medical_profile(payload: MedicalProfileIn, db: Session = Depends(get_db),
                          user: User = Depends(get_current_user)):
    profile = controller.handle_save_medical_profile(db, user, payload)
    return success_response(profile, "Medical profile saved.")


@router.post("/me/feedback")
def submit_feedback(payload: FeedbackCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    fb = Feedback(user_id=user.id, prediction_id=payload.prediction_id, rating=payload.rating,
                  comment=payload.comment, category=payload.category)
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return success_response(FeedbackOut.model_validate(fb), "Thanks for your feedback!")
