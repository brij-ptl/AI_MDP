from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.models.prediction import Prediction


def get_prediction_stats(db: Session, user_id: str) -> dict:
    total = db.query(func.count(Prediction.id)).filter(Prediction.user_id == user_id).scalar() or 0
    by_risk = dict(
        db.query(Prediction.risk_level, func.count(Prediction.id))
        .filter(Prediction.user_id == user_id).group_by(Prediction.risk_level).all()
    )
    recent = (db.query(Prediction).filter(Prediction.user_id == user_id)
              .order_by(Prediction.created_at.desc()).limit(5).all())
    return {"total_predictions": total, "by_risk_level": by_risk, "recent": recent}


def get_risk_trend(db: Session, user_id: str, disease_slug: str | None = None, limit: int = 20):
    q = db.query(Prediction).filter(Prediction.user_id == user_id)
    if disease_slug:
        q = q.filter(Prediction.disease_slug == disease_slug)
    return q.order_by(Prediction.created_at.asc()).limit(limit).all()
