from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.database.models.user import User
from app.modules.dashboard import controller
from app.utils.response import success_response

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def overview(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    data = controller.handle_overview(db, user.id)
    return success_response(data, "Dashboard overview fetched.")


@router.get("/risk-trend")
def risk_trend(disease: str | None = Query(default=None), db: Session = Depends(get_db),
               user: User = Depends(get_current_user)):
    data = controller.handle_risk_trend(db, user.id, disease)
    return success_response(data, "Risk trend fetched.")
