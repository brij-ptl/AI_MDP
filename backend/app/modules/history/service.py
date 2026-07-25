from datetime import datetime
from sqlalchemy.orm import Session

from app.modules.history import repository as history_repo


def get_history(db: Session, user_id: str, disease_slug: str | None, risk_level: str | None,
                 date_from: datetime | None, date_to: datetime | None, limit: int, offset: int) -> dict:
    items, total = history_repo.query_history(db, user_id, disease_slug, risk_level, date_from, date_to, limit, offset)
    return {"items": items, "total": total, "limit": limit, "offset": offset}
