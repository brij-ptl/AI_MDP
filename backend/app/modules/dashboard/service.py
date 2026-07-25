from sqlalchemy.orm import Session

from app.modules.dashboard import repository as dash_repo
from app.modules.subscription import service as sub_service
from app.modules.notifications import service as notif_service

RISK_PENALTY = {"Low Risk": 2, "Moderate Risk": 8, "High Risk": 18, "Critical Risk": 30}


def compute_health_score(by_risk_level: dict) -> int:
    """A simple, transparent 0-100 'health score': starts at 100 and is reduced by the mix
    of risk levels seen across the user's most recent predictions across all disease modules."""
    score = 100
    for level, count in by_risk_level.items():
        score -= RISK_PENALTY.get(level, 5) * count
    return max(0, min(100, score))


def get_overview(db: Session, user_id: str) -> dict:
    stats = dash_repo.get_prediction_stats(db, user_id)
    subscription = sub_service.get_subscription(db, user_id)
    quota = sub_service.remaining_quota(subscription)
    unread_notifications = notif_service.get_unread_count(db, user_id)

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
        "subscription_plan": subscription.plan,
        "is_premium_active": subscription.is_premium_active(),
        **quota,
        "unread_notifications": unread_notifications,
    }
