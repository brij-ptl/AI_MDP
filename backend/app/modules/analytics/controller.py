from sqlalchemy.orm import Session
from app.modules.analytics import service as analytics_service


def handle_get_analytics(db: Session) -> dict:
    return analytics_service.get_platform_analytics(db)
