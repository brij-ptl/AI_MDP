from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_admin
from app.database.models.user import User
from app.schemas.user import UserProfileOut
from app.schemas.payment import PaymentOut
from app.schemas.feedback import FeedbackOut
from app.modules.admin import controller
from app.utils.response import success_response

router = APIRouter(prefix="/admin", tags=["Admin Panel"])


@router.get("/users")
def list_users(limit: int = Query(default=50, le=200), offset: int = Query(default=0, ge=0),
                db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    users = controller.handle_list_users(db, limit, offset)
    return success_response([UserProfileOut.model_validate(u) for u in users], "Users fetched.")


@router.post("/users/{user_id}/suspend")
def suspend_user(user_id: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    user = controller.handle_toggle_user(db, admin.id, user_id, False)
    return success_response(UserProfileOut.model_validate(user), "User suspended.")


@router.post("/users/{user_id}/reactivate")
def reactivate_user(user_id: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    user = controller.handle_toggle_user(db, admin.id, user_id, True)
    return success_response(UserProfileOut.model_validate(user), "User reactivated.")


@router.get("/diseases")
def list_diseases(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    diseases = controller.handle_list_diseases(db)
    data = [{
        "slug": d.slug, "name": d.name, "category": d.category, "is_active": d.is_active,
        "model_accuracy": d.model_accuracy, "model_version": d.model_version, "data_source": d.data_source,
    } for d in diseases]
    return success_response(data, "Disease modules fetched.")


@router.post("/diseases/{slug}/disable")
def disable_disease(slug: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    controller.handle_toggle_disease(db, admin.id, slug, False)
    return success_response(message=f"Disease module '{slug}' disabled.")


@router.post("/diseases/{slug}/enable")
def enable_disease(slug: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    controller.handle_toggle_disease(db, admin.id, slug, True)
    return success_response(message=f"Disease module '{slug}' enabled.")


@router.get("/models/accuracy-reports")
def model_accuracy_reports(admin: User = Depends(get_current_admin)):
    return success_response(controller.handle_model_reports(), "Model accuracy reports fetched.")


@router.get("/payments")
def list_payments(limit: int = Query(default=100, le=500), db: Session = Depends(get_db),
                   admin: User = Depends(get_current_admin)):
    payments = controller.handle_list_payments(db, limit)
    return success_response([PaymentOut.model_validate(p) for p in payments], "Payments fetched.")


@router.get("/feedback")
def list_feedback(status: str | None = Query(default=None), db: Session = Depends(get_db),
                   admin: User = Depends(get_current_admin)):
    feedback = controller.handle_list_feedback(db, status)
    return success_response([FeedbackOut.model_validate(f) for f in feedback], "Feedback fetched.")


@router.post("/feedback/{feedback_id}/status")
def moderate_feedback(feedback_id: str, status: str, db: Session = Depends(get_db),
                       admin: User = Depends(get_current_admin)):
    fb = controller.handle_moderate_feedback(db, admin.id, feedback_id, status)
    return success_response(FeedbackOut.model_validate(fb), "Feedback status updated.")


@router.get("/logs")
def system_logs(limit: int = Query(default=100, le=500), db: Session = Depends(get_db),
                 admin: User = Depends(get_current_admin)):
    logs = controller.handle_list_logs(db, limit)
    data = [{"id": l.id, "admin_id": l.admin_id, "action": l.action, "target_type": l.target_type,
             "target_id": l.target_id, "created_at": l.created_at.isoformat()} for l in logs]
    return success_response(data, "System logs fetched.")
