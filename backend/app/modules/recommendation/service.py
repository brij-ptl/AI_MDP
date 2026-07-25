from sqlalchemy.orm import Session

from app.modules.recommendation import repository as rec_repo
from app.modules.users import service as users_service
from app.ml.preprocessing.feature_engineering import compute_bmi, bmi_category


def build_recommendations(db: Session, user_id: str) -> dict:
    predictions = rec_repo.get_recent_predictions(db, user_id, limit=10)
    profile = users_service.get_medical_profile(db, user_id)

    disease_specific = []
    seen_slugs = set()
    for p in predictions:
        if p.disease_slug in seen_slugs or not p.recommendations:
            continue
        seen_slugs.add(p.disease_slug)
        disease_specific.append({
            "disease_slug": p.disease_slug, "risk_level": p.risk_level,
            "recommendations": p.recommendations,
        })

    general_tips = []
    if profile:
        if profile.get("smoking") == "current":
            general_tips.append("Quitting smoking is the single most impactful step for your long-term cardiovascular and cancer risk.")
        if profile.get("physical_activity") == "sedentary":
            general_tips.append("Adding even light daily activity (e.g. a 20-minute walk) meaningfully reduces chronic disease risk.")
        if profile.get("alcohol") == "regular":
            general_tips.append("Reducing regular alcohol intake lowers your risk of liver disease, hypertension and several cancers.")
        bmi = compute_bmi(profile.get("weight_kg") or 0, profile.get("height_cm") or 0) if profile.get("height_cm") else None
        if bmi:
            cat = bmi_category(bmi)
            if cat in ("overweight", "obese"):
                general_tips.append(f"Your BMI ({bmi}) falls in the '{cat}' range — a gradual, sustainable weight "
                                     "reduction plan would benefit several of the risk areas above.")

    if not general_tips:
        general_tips.append("Maintain a balanced diet, regular exercise, adequate sleep, and routine annual checkups.")

    return {"disease_specific": disease_specific, "general_tips": general_tips}
