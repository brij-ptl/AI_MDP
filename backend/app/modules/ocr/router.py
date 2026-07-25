from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.database.models.user import User
from app.modules.ocr import controller
from app.utils.response import success_response

router = APIRouter(prefix="/ocr", tags=["Document Upload / OCR"])


@router.post("/upload")
async def upload_report(
    file: UploadFile = File(..., description="Blood test / lab report - PDF, PNG or JPG"),
    disease: str | None = Form(default=None, description="Disease slug to auto-fill (e.g. 'diabetes')"),
    db: Session = Depends(get_db), user: User = Depends(get_current_user),
):
    data = await controller.handle_upload_and_extract(db, user, file, disease)
    return success_response(data, "Document processed. Please review the extracted values before predicting.")
