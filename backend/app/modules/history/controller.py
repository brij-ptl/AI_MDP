from datetime import datetime
from sqlalchemy.orm import Session

from app.modules.history import service as history_service
from app.schemas.prediction import PredictionListItem


def handle_get_history(db: Session, user_id: str, disease_slug: str | None, risk_level: str | None,
                        date_from: datetime | None, date_to: datetime | None, limit: int, offset: int) -> dict:
    result = history_service.get_history(db, user_id, disease_slug, risk_level, date_from, date_to, limit, offset)
    result["items"] = [PredictionListItem.model_validate(p) for p in result["items"]]
    return result
