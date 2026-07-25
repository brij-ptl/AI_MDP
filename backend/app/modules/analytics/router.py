from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_admin
from app.database.models.user import User
from app.modules.analytics import controller
from app.utils.response import success_response

router = APIRouter(prefix="/analytics", tags=["Admin Analytics"])


@router.get("/platform")
def platform_analytics(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    data = controller.handle_get_analytics(db)
    return success_response(data, "Platform analytics fetched.")
