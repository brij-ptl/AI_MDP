from datetime import datetime
from pydantic import BaseModel


class ReportOut(BaseModel):
    id: str
    prediction_id: str
    file_name: str
    download_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class ReportDownloadOut(BaseModel):
    file_name: str
    download_url: str
