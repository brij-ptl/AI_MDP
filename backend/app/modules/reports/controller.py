from sqlalchemy.orm import Session
from app.database.models.user import User
from app.modules.reports import service as report_service


def handle_generate(db: Session, user: User, prediction_id: str):
    return report_service.generate_report(db, user, prediction_id)


def handle_list(db: Session, user: User):
    return report_service.list_reports(db, user.id)


def handle_download(db: Session, user: User, report_id: str):
    return report_service.get_report_file(db, user, report_id)
