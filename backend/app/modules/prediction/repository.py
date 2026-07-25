from sqlalchemy.orm import Session

from app.database.models.prediction import Prediction


def create_prediction(db: Session, **kwargs) -> Prediction:
    pred = Prediction(**kwargs)
    db.add(pred)
    db.commit()
    db.refresh(pred)
    return pred


def get_by_id(db: Session, prediction_id: str, user_id: str) -> Prediction | None:
    return db.query(Prediction).filter(Prediction.id == prediction_id, Prediction.user_id == user_id).first()


def list_for_user(db: Session, user_id: str, disease_slug: str | None = None, limit: int = 50, offset: int = 0):
    q = db.query(Prediction).filter(Prediction.user_id == user_id)
    if disease_slug:
        q = q.filter(Prediction.disease_slug == disease_slug)
    return q.order_by(Prediction.created_at.desc()).offset(offset).limit(limit).all()


def count_for_user(db: Session, user_id: str) -> int:
    return db.query(Prediction).filter(Prediction.user_id == user_id).count()
