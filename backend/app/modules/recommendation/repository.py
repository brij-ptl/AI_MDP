from sqlalchemy.orm import Session
from app.database.models.prediction import Prediction


def get_recent_predictions(db: Session, user_id: str, limit: int = 10):
    return (db.query(Prediction).filter(Prediction.user_id == user_id)
            .order_by(Prediction.created_at.desc()).limit(limit).all())
