from datetime import datetime
from sqlalchemy.orm import Session

from app.database.models.prediction import Prediction


def query_history(db: Session, user_id: str, disease_slug: str | None = None,
                   risk_level: str | None = None, date_from: datetime | None = None,
                   date_to: datetime | None = None, limit: int = 50, offset: int = 0):
    q = db.query(Prediction).filter(Prediction.user_id == user_id)
    if disease_slug:
        q = q.filter(Prediction.disease_slug == disease_slug)
    if risk_level:
        q = q.filter(Prediction.risk_level == risk_level)
    if date_from:
        q = q.filter(Prediction.created_at >= date_from)
    if date_to:
        q = q.filter(Prediction.created_at <= date_to)
    total = q.count()
    items = q.order_by(Prediction.created_at.desc()).offset(offset).limit(limit).all()
    return items, total
