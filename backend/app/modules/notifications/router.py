from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.database.models.user import User
from app.schemas.notification import NotificationOut
from app.modules.notifications import controller
from app.utils.response import success_response

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/")
def list_notifications(unread_only: bool = Query(default=False), db: Session = Depends(get_db),
                        user: User = Depends(get_current_user)):
    notifications = controller.handle_list(db, user.id, unread_only)
    return success_response([NotificationOut.model_validate(n) for n in notifications], "Notifications fetched.")


@router.post("/{notif_id}/read")
def mark_read(notif_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    notif = controller.handle_mark_read(db, user.id, notif_id)
    return success_response(NotificationOut.model_validate(notif), "Marked as read.")


@router.post("/read-all")
def mark_all_read(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    count = controller.handle_mark_all_read(db, user.id)
    return success_response({"marked": count}, "All notifications marked as read.")


@router.get("/unread-count")
def unread_count(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    count = controller.handle_unread_count(db, user.id)
    return success_response({"unread_count": count}, "Unread count fetched.")
