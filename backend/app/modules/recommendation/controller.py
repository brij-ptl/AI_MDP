from sqlalchemy.orm import Session
from app.modules.recommendation import service as rec_service


def handle_get_recommendations(db: Session, user_id: str) -> dict:
    return rec_service.build_recommendations(db, user_id)
