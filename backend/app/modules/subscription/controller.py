from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.models.user import User
from app.modules.subscription import service as sub_service


def handle_get_subscription(db: Session, user: User) -> dict:
    sub = sub_service.get_subscription(db, user.id)
    is_admin = user.role == "admin"
    quota = sub_service.remaining_quota(sub, is_admin=is_admin)
    prediction_access = sub_service.get_prediction_access(db, user)
    return {
        "plan": "admin" if is_admin else sub.plan,
        "status": "active" if is_admin else sub.status,
        "predictions_used": sub.predictions_used,
        "symptom_checks_used": sub.symptom_checks_used,
        "free_predictions_limit": settings.FREE_PREDICTIONS_LIMIT,
        "free_symptom_checks_limit": settings.FREE_SYMPTOM_CHECKS_LIMIT,
        "is_premium_active": is_admin or sub.is_premium_active(),
        "prediction_tokens": "unlimited" if is_admin else user.prediction_tokens,
        "subscription_remaining": "unlimited" if is_admin or sub.is_premium_active() else 0,
        "free_trial_remaining": 0 if is_admin or sub.is_premium_active() else quota["predictions_remaining"],
        **quota,
        "prediction_access": prediction_access,
        # Kept for existing clients. It now means the remaining credit from the
        # active source, rather than only the free trial.
        "predictions_remaining": prediction_access["predictions_remaining"],
        "starts_at": sub.starts_at,
        "expires_at": sub.expires_at,
    }
