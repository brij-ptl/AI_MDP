"""Import every model so Base.metadata is fully populated before create_all()."""
from app.database.models.user import User
from app.database.models.medical_profile import MedicalProfile
from app.database.models.prediction import Prediction, OcrDocument
from app.database.models.disease import Disease
from app.database.models.report import Report
from app.database.models.payment import Payment
from app.database.models.subscription import Subscription
from app.database.models.notification import Notification
from app.database.models.feedback import Feedback
from app.database.models.admin import AdminLog

__all__ = [
    "User", "MedicalProfile", "Prediction", "OcrDocument", "Disease", "Report",
    "Payment", "Subscription", "Notification", "Feedback", "AdminLog",
]
