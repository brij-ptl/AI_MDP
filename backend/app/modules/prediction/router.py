from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.database.models.user import User
from app.schemas.prediction import PredictionRequest, PredictionOut, PredictionListItem
from app.schemas.disease import DiseaseSummaryOut
from app.modules.prediction import controller
from app.modules.prediction.model_registry import list_all_disease_summaries, get_disease_summary
from app.utils.response import success_response

router = APIRouter(prefix="/prediction", tags=["Disease Prediction"])


@router.get("/diseases")
def list_diseases():
    """Public catalogue of all 16 disease modules (used by the disease-picker UI)."""
    return success_response(list_all_disease_summaries(), "Disease modules fetched.")


@router.get("/diseases/{slug}", response_model=None)
def get_disease(slug: str):
    return success_response(get_disease_summary(slug), "Disease details fetched.")


@router.post("/{slug}", response_model=None)
def predict(slug: str, payload: PredictionRequest, db: Session = Depends(get_db),
            user: User = Depends(get_current_user)):
    prediction = controller.handle_predict(db, user, slug, payload)
    return success_response(PredictionOut.model_validate(prediction), "Prediction complete.")


@router.get("/history/list", response_model=None)
def list_predictions(disease: str | None = Query(default=None), limit: int = Query(default=50, le=200),
                      offset: int = Query(default=0, ge=0), db: Session = Depends(get_db),
                      user: User = Depends(get_current_user)):
    predictions = controller.handle_list(db, user, disease, limit, offset)
    return success_response([PredictionListItem.model_validate(p) for p in predictions], "Predictions fetched.")


@router.get("/{prediction_id}/detail", response_model=None)
def get_prediction(prediction_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    prediction = controller.handle_get(db, user, prediction_id)
    if not prediction:
        raise NotFoundException("Prediction not found.")
    return success_response(PredictionOut.model_validate(prediction), "Prediction fetched.")
