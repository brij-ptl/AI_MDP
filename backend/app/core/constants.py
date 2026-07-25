"""Enumerations and static constants shared across the app."""
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class SubscriptionPlan(str, Enum):
    FREE = "free"
    PREMIUM_MONTHLY = "premium_monthly"
    PREMIUM_YEARLY = "premium_yearly"


class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    NONE = "none"


class PaymentStatus(str, Enum):
    CREATED = "created"
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class PredictionInputType(str, Enum):
    MANUAL_FORM = "manual_form"
    DOCUMENT_UPLOAD = "document_upload"
    SYMPTOM_TEXT = "symptom_text"


class RiskLevel(str, Enum):
    LOW = "Low Risk"
    MODERATE = "Moderate Risk"
    HIGH = "High Risk"
    CRITICAL = "Critical Risk"


class NotificationType(str, Enum):
    SYSTEM = "system"
    PREDICTION = "prediction"
    PAYMENT = "payment"
    SUBSCRIPTION = "subscription"
    SECURITY = "security"


class DiseaseCategory(str, Enum):
    CARDIOVASCULAR = "Cardiovascular"
    METABOLIC = "Metabolic"
    ORGAN_DISEASE = "Organ Disease"
    CANCER = "Cancer"
    ENDOCRINE = "Endocrine"
    NEUROLOGICAL = "Neurological"
    BLOOD_DISORDER = "Blood Disorder"
    LIFESTYLE_DISEASE = "Lifestyle Disease"


DISEASE_SLUGS = [
    "heart", "diabetes", "stroke", "hypertension", "kidney", "liver",
    "fatty_liver", "breast_cancer", "lung_cancer", "cervical_cancer",
    "prostate_cancer", "thyroid", "parkinsons", "alzheimers", "anemia", "obesity",
]

# Risk score thresholds (probability of positive class, 0-1)
RISK_THRESHOLDS = {
    "low": 0.30,
    "moderate": 0.55,
    "high": 0.80,
    # >= 0.80 -> critical
}
