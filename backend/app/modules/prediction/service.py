from __future__ import annotations
from typing import Any, Dict

from sqlalchemy.orm import Session

from app.core.constants import PredictionInputType
from app.modules.prediction import repository as pred_repo
from app.modules.prediction import prediction_engine
from app.modules.prediction.validators import assert_valid_disease
from app.modules.subscription import service as sub_service
from app.modules.users import service as users_service
from app.services.notification_service import notify_prediction_ready
from app.database.models.user import User


def run_prediction(db: Session, user: User, disease_slug: str, raw_features: Dict[str, Any],
                    input_type: str = PredictionInputType.MANUAL_FORM.value,
                    source_document_id: str | None = None) -> "Prediction":
    from app.database.models.prediction import Prediction  # local import avoids circularity in type hints

    assert_valid_disease(disease_slug)

    # 1. business rule: 2 free predictions, then mandatory payment
    access_source = sub_service.enforce_prediction_quota(db, user)

    # 2. enrich with saved medical profile + run the ML pipeline
    profile = users_service.get_medical_profile(db, user.id)
    outcome = prediction_engine.execute(disease_slug, raw_features, profile)
    result = outcome["result"]

    # 3. persist
    prediction = pred_repo.create_prediction(
        db, user_id=user.id, disease_slug=disease_slug, input_type=input_type,
        input_features=raw_features, prediction_label=result.prediction_label,
        probability=result.probability, risk_level=result.risk_level,
        confidence_score=result.confidence_score, feature_importance=result.feature_importance,
        doctor_explanation=outcome["doctor_explanation"], recommended_tests=outcome["recommended_tests"],
        recommended_specialist=outcome["recommended_specialist"], recommendations=outcome["recommendations"],
        source_document_id=source_document_id, model_version=result.model_version,
    )

    # 4. consume the free-tier credit (no-op limit-wise once premium)
    try:
        sub_service.consume_prediction_credit(db, user, access_source)
    except Exception:
        # A concurrent request may have spent the final credit after the initial
        # access check. Do not leave an uncharged prediction in history.
        pred_repo.delete_prediction(db, prediction)
        raise

    # 5. notify
    from app.ml.registry.model_loader import load_disease_config
    disease_name = load_disease_config(disease_slug)["name"]
    notify_prediction_ready(db, user.id, disease_name, result.risk_level)

    return prediction


def get_prediction(db: Session, user: User, prediction_id: str):
    return pred_repo.get_by_id(db, prediction_id, user.id)


def list_predictions(db: Session, user: User, disease_slug: str | None = None, limit: int = 50, offset: int = 0):
    return pred_repo.list_for_user(db, user.id, disease_slug, limit, offset)
