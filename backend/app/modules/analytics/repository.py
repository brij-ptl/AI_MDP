from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.models.user import User
from app.database.models.prediction import Prediction
from app.database.models.payment import Payment
from app.database.models.subscription import Subscription


def total_users(db: Session) -> int:
    return db.query(func.count(User.id)).scalar() or 0


def total_predictions(db: Session) -> int:
    return db.query(func.count(Prediction.id)).scalar() or 0


def predictions_by_disease(db: Session) -> dict:
    rows = db.query(Prediction.disease_slug, func.count(Prediction.id)).group_by(Prediction.disease_slug).all()
    return dict(rows)


def total_revenue_paise(db: Session) -> int:
    return db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(Payment.status == "success").scalar() or 0


def active_subscriptions(db: Session) -> int:
    return db.query(func.count(Subscription.id)).filter(Subscription.plan != "free",
                                                          Subscription.status == "active").scalar() or 0


def signups_over_time(db: Session, days: int = 30):
    since = func.date(User.created_at)
    rows = (db.query(since.label("day"), func.count(User.id))
            .group_by("day").order_by("day").limit(days).all())
    return [{"date": str(d), "signups": c} for d, c in rows]
