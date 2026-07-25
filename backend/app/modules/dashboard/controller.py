from sqlalchemy.orm import Session
from app.modules.dashboard import service as dash_service
from app.modules.dashboard import repository as dash_repo


def handle_overview(db: Session, user_id: str) -> dict:
    return dash_service.get_overview(db, user_id)


def handle_risk_trend(db: Session, user_id: str, disease_slug: str | None):
    trend = dash_repo.get_risk_trend(db, user_id, disease_slug)
    return [{"date": p.created_at.isoformat(), "disease_slug": p.disease_slug,
             "probability": p.probability, "risk_level": p.risk_level} for p in trend]
