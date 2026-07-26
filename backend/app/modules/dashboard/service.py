from sqlalchemy.orm import Session

from app.modules.dashboard import repository as dash_repo
from app.modules.subscription import service as sub_service
from app.modules.notifications import service as notif_service
from app.database.models.user import User

RISK_PENALTY = {"Low Risk": 2, "Moderate Risk": 8, "High Risk": 18, "Critical Risk": 30}


def compute_health_score(by_risk_level: dict) -> int:
    """A simple, transparent 0-100 'health score': starts at 100 and is reduced by the mix
    of risk levels seen across the user's most recent predictions across all disease modules."""
    score = 100
    for level, count in by_risk_level.items():
        score -= RISK_PENALTY.get(level, 5) * count
    return max(0, min(100, score))


def get_overview(db: Session, user: User) -> dict:
    stats = dash_repo.get_prediction_stats(db, user.id)
    subscription = sub_service.get_subscription(db, user.id)
    is_admin = user.role == "admin"
    quota = sub_service.remaining_quota(subscription, is_admin=is_admin)
    prediction_access = sub_service.get_prediction_access(db, user)
    unread_notifications = notif_service.get_unread_count(db, user.id)

    return {
        "health_score": compute_health_score(stats["by_risk_level"]),
        "total_predictions": stats["total_predictions"],
        "risk_breakdown": stats["by_risk_level"],
        "recent_predictions": [
            {
                "id": p.id, "disease_slug": p.disease_slug, "risk_level": p.risk_level,
                "probability": p.probability, "created_at": p.created_at.isoformat(),
            } for p in stats["recent"]
        ],
        "subscription_plan": "admin" if is_admin else subscription.plan,
        "is_premium_active": is_admin or subscription.is_premium_active(),
        "prediction_tokens": "unlimited" if is_admin else user.prediction_tokens,
        "subscription_remaining": "unlimited" if is_admin or subscription.is_premium_active() else 0,
        "free_trial_remaining": 0 if is_admin or subscription.is_premium_active() else quota["predictions_remaining"],
        **quota,
        "prediction_access": prediction_access,
        "predictions_remaining": prediction_access["predictions_remaining"],
        "unread_notifications": unread_notifications,
    }
