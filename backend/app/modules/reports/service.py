from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.database.models.user import User
from app.modules.reports import repository as report_repo
from app.modules.reports.pdf_generator import generate_prediction_report_pdf
from app.modules.prediction import repository as pred_repo
from app.services.storage_service import save_generated_file
from app.services.email_service import send_report_ready_email
from app.ml.registry.model_loader import load_disease_config


def generate_report(db: Session, user: User, prediction_id: str):
    prediction = pred_repo.get_by_id(db, prediction_id, user.id)
    if not prediction:
        raise NotFoundException("Prediction not found.")

    existing = report_repo.get_by_prediction(db, prediction_id)
    if existing:
        return existing

    pdf_bytes = generate_prediction_report_pdf(prediction, user.full_name)
    filename = f"{prediction.disease_slug}_{prediction.id[:8]}.pdf"
    file_path = save_generated_file(pdf_bytes, filename)

    report = report_repo.create_report(
        db, user_id=user.id, prediction_id=prediction.id, file_path=file_path, file_name=filename,
    )
    disease_name = load_disease_config(prediction.disease_slug)["name"]
    send_report_ready_email(user.email, user.full_name, disease_name)
    return report


def list_reports(db: Session, user_id: str):
    return report_repo.list_for_user(db, user_id)


def get_report_file(db: Session, user: User, report_id: str) -> tuple[str, str]:
    report = report_repo.get_by_id(db, report_id, user.id)
    if not report:
        raise NotFoundException("Report not found.")
    report_repo.increment_download_count(db, report)
    return report.file_path, report.file_name
