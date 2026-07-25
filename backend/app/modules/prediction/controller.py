from sqlalchemy.orm import Session

from app.database.models.user import User
from app.modules.prediction import service as pred_service
from app.schemas.prediction import PredictionRequest


def handle_predict(db: Session, user: User, disease_slug: str, payload: PredictionRequest):
    return pred_service.run_prediction(
        db, user, disease_slug, payload.features,
        input_type=payload.input_type, source_document_id=payload.source_document_id,
    )


def handle_get(db: Session, user: User, prediction_id: str):
    return pred_service.get_prediction(db, user, prediction_id)


def handle_list(db: Session, user: User, disease_slug: str | None, limit: int, offset: int):
    return pred_service.list_predictions(db, user, disease_slug, limit, offset)
