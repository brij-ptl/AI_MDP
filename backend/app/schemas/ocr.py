from datetime import datetime
from pydantic import BaseModel


class OcrExtractionResult(BaseModel):
    document_id: str
    disease_slug: str | None = None
    extracted_parameters: dict
    raw_text_preview: str
    normalization_notes: list[str] = []
    status: str


class OcrDocumentOut(BaseModel):
    id: str
    original_filename: str
    file_type: str
    status: str
    extracted_parameters: dict | None = None
    created_at: datetime

    class Config:
        from_attributes = True
