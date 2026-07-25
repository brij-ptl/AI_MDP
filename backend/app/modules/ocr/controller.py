from sqlalchemy.orm import Session
from fastapi import UploadFile

from app.database.models.user import User
from app.services.file_service import validate_upload, generate_unique_filename
from app.services.storage_service import save_upload
from app.modules.ocr import service as ocr_service
from app.modules.ocr import repository as ocr_repo


async def handle_upload_and_extract(db: Session, user: User, file: UploadFile, disease_slug: str | None) -> dict:
    contents = await file.read()
    ext = validate_upload(file, contents)
    filename = generate_unique_filename(ext)
    file_path = save_upload(contents, "reports", filename)

    raw_text = ocr_service.extract_raw_text(contents, ext)

    extraction = {"parameters": {}, "notes": []}
    if disease_slug:
        extraction = ocr_service.extract_parameters(raw_text, disease_slug)

    doc = ocr_repo.create_document(
        db, user_id=user.id, disease_slug=disease_slug, file_path=file_path,
        original_filename=file.filename, file_type=ext.lstrip("."),
        raw_extracted_text=raw_text, extracted_parameters=extraction["parameters"],
        normalization_notes=extraction["notes"], status="processed",
    )

    return {
        "document_id": doc.id,
        "disease_slug": disease_slug,
        "extracted_parameters": extraction["parameters"],
        "raw_text_preview": raw_text[:500],
        "normalization_notes": extraction["notes"],
        "status": "processed",
    }
