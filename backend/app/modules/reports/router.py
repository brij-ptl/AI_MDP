from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.database.models.user import User
from app.schemas.report import ReportOut
from app.modules.reports import controller
from app.utils.response import success_response

router = APIRouter(prefix="/reports", tags=["PDF Reports"])


@router.post("/generate/{prediction_id}")
def generate_report(prediction_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    report = controller.handle_generate(db, user, prediction_id)
    return success_response(ReportOut.model_validate(report), "Report generated.")


@router.get("/")
def list_reports(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    reports = controller.handle_list(db, user)
    return success_response([ReportOut.model_validate(r) for r in reports], "Reports fetched.")


@router.get("/{report_id}/download")
def download_report(report_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    file_path, file_name = controller.handle_download(db, user, report_id)
    return FileResponse(path=file_path, filename=file_name, media_type="application/pdf")
