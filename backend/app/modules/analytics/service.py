from sqlalchemy.orm import Session
from app.modules.analytics import repository as analytics_repo


def get_platform_analytics(db: Session) -> dict:
    return {
        "total_users": analytics_repo.total_users(db),
        "total_predictions": analytics_repo.total_predictions(db),
        "predictions_by_disease": analytics_repo.predictions_by_disease(db),
        "total_revenue_inr": analytics_repo.total_revenue_paise(db) / 100,
        "active_subscriptions": analytics_repo.active_subscriptions(db),
        "signups_last_30_days": analytics_repo.signups_over_time(db, 30),
    }
