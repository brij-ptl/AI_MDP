from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.database.models.user import User
from app.modules.recommendation import controller
from app.utils.response import success_response

router = APIRouter(prefix="/recommendation", tags=["Recommendations"])


@router.get("/me")
def get_my_recommendations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    data = controller.handle_get_recommendations(db, user.id)
    return success_response(data, "Recommendations fetched.")
