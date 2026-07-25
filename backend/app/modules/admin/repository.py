from sqlalchemy.orm import Session

from app.database.models.user import User
from app.database.models.disease import Disease
from app.database.models.payment import Payment
from app.database.models.feedback import Feedback
from app.database.models.admin import AdminLog


def list_users(db: Session, limit: int = 50, offset: int = 0):
    return db.query(User).order_by(User.created_at.desc()).offset(offset).limit(limit).all()


def get_user(db: Session, user_id: str) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def set_user_active(db: Session, user: User, is_active: bool) -> User:
    user.is_active = is_active
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def list_diseases(db: Session):
    return db.query(Disease).all()


def set_disease_active(db: Session, slug: str, is_active: bool) -> Disease | None:
    disease = db.query(Disease).filter(Disease.slug == slug).first()
    if disease:
        disease.is_active = is_active
        db.add(disease)
        db.commit()
        db.refresh(disease)
    return disease


def list_payments(db: Session, limit: int = 100):
    return db.query(Payment).order_by(Payment.created_at.desc()).limit(limit).all()


def list_feedback(db: Session, status: str | None = None):
    q = db.query(Feedback)
    if status:
        q = q.filter(Feedback.status == status)
    return q.order_by(Feedback.created_at.desc()).all()


def update_feedback_status(db: Session, feedback_id: str, status: str) -> Feedback | None:
    fb = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if fb:
        fb.status = status
        db.add(fb)
        db.commit()
        db.refresh(fb)
    return fb


def log_admin_action(db: Session, admin_id: str, action: str, target_type: str | None = None,
                      target_id: str | None = None, metadata: dict | None = None, ip: str | None = None) -> AdminLog:
    log = AdminLog(admin_id=admin_id, action=action, target_type=target_type, target_id=target_id,
                    metadata_json=metadata, ip_address=ip)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def list_logs(db: Session, limit: int = 100):
    return db.query(AdminLog).order_by(AdminLog.created_at.desc()).limit(limit).all()
