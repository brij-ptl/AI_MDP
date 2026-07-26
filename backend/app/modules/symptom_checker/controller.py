from sqlalchemy.orm import Session

from app.database.models.user import User
from app.modules.symptom_checker import service as symptom_service
from app.modules.symptom_checker import repository as symptom_repo
from app.modules.subscription import service as sub_service


def handle_check(db: Session, user: User, text: str) -> dict:
    sub_service.enforce_symptom_check_quota(db, user)

    analysis = symptom_service.analyze(text)

    if analysis["possible_diseases"]:
        top = analysis["possible_diseases"][0]
        risk_level = "High Risk" if top["confidence"] >= 0.7 else "Moderate Risk" if top["confidence"] >= 0.4 else "Low Risk"
        symptom_repo.save_symptom_check(
            db, user_id=user.id, disease_slug=top["slug"], input_type="symptom_text",
            input_features={"symptom_text": text}, prediction_label="Possible Match",
            probability=top["confidence"], risk_level=risk_level, confidence_score=top["confidence"],
            feature_importance=None, doctor_explanation=None,
            recommended_tests=top["recommended_tests"], recommended_specialist=top["recommended_specialist"],
            recommendations=analysis["next_steps"], model_version="symptom-kb-1.0",
        )

    sub_service.consume_symptom_check_credit(db, user)
    return analysis
