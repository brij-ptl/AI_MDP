from sqlalchemy.orm import Session
from app.database.models.report import Report


def create_report(db: Session, **kwargs) -> Report:
    report = Report(**kwargs)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_by_prediction(db: Session, prediction_id: str) -> Report | None:
    return db.query(Report).filter(Report.prediction_id == prediction_id).first()


def get_by_id(db: Session, report_id: str, user_id: str) -> Report | None:
    return db.query(Report).filter(Report.id == report_id, Report.user_id == user_id).first()


def list_for_user(db: Session, user_id: str):
    return db.query(Report).filter(Report.user_id == user_id).order_by(Report.created_at.desc()).all()


def increment_download_count(db: Session, report: Report) -> Report:
    report.download_count += 1
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
