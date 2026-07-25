from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.database.models.user import User
from app.modules.history import controller
from app.utils.response import success_response

router = APIRouter(prefix="/history", tags=["Prediction History"])


@router.get("/")
def get_history(
    disease: str | None = Query(default=None),
    risk_level: str | None = Query(default=None),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db), user: User = Depends(get_current_user),
):
    data = controller.handle_get_history(db, user.id, disease, risk_level, date_from, date_to, limit, offset)
    return success_response(data, "History fetched.")
