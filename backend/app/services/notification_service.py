"""Creates in-app notifications (surfaced via app/modules/notifications)."""
from sqlalchemy.orm import Session

from app.database.models.notification import Notification


def create_notification(db: Session, user_id: str, type_: str, title: str, message: str,
                         link: str | None = None) -> Notification:
    notif = Notification(user_id=user_id, type=type_, title=title, message=message, link=link)
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def notify_prediction_ready(db: Session, user_id: str, disease_name: str, risk_level: str) -> Notification:
    return create_notification(
        db, user_id, "prediction", f"{disease_name} prediction ready",
        f"Your {disease_name} risk assessment is complete: {risk_level}. View the full report on your dashboard.",
        link="/dashboard/history",
    )


def notify_payment_success(db: Session, user_id: str, plan: str) -> Notification:
    return create_notification(
        db, user_id, "payment", "Payment successful",
        f"Your payment for the {plan} plan was successful. Enjoy unlimited predictions!",
        link="/dashboard/subscription",
    )


def notify_free_limit_reached(db: Session, user_id: str) -> Notification:
    return create_notification(
        db, user_id, "subscription", "Free predictions used up",
        "You've used all your free predictions. Upgrade to Premium for unlimited access.",
        link="/dashboard/subscription",
    )
