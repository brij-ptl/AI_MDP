from sqlalchemy.orm import Session

from app.database.models.prediction import Prediction


def save_symptom_check(db: Session, **kwargs) -> Prediction:
    record = Prediction(**kwargs)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_history(db: Session, user_id: str, limit: int = 50):
    return (db.query(Prediction)
            .filter(Prediction.user_id == user_id, Prediction.input_type == "symptom_text")
            .order_by(Prediction.created_at.desc()).limit(limit).all())
