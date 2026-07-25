from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.subscription import service as sub_service


def handle_get_subscription(db: Session, user_id: str) -> dict:
    sub = sub_service.get_subscription(db, user_id)
    quota = sub_service.remaining_quota(sub)
    return {
        "plan": sub.plan,
        "status": sub.status,
        "predictions_used": sub.predictions_used,
        "symptom_checks_used": sub.symptom_checks_used,
        "free_predictions_limit": settings.FREE_PREDICTIONS_LIMIT,
        "free_symptom_checks_limit": settings.FREE_SYMPTOM_CHECKS_LIMIT,
        "is_premium_active": sub.is_premium_active(),
        "starts_at": sub.starts_at,
        "expires_at": sub.expires_at,
        **quota,
    }
