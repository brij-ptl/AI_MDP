"""
Sends transactional emails (verification, password reset, payment receipts, reports-ready).
When settings.EMAIL_ENABLED is False (default for local/dev), emails are logged instead of
sent so the app is fully runnable without SMTP credentials configured.
"""
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def send_email(to: str, subject: str, html_body: str) -> bool:
    if not settings.EMAIL_ENABLED:
        logger.info(f"[EMAIL:DEV-MODE] to={to} subject='{subject}'\n{html_body[:300]}")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_FROM
        msg["To"] = to
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM, [to], msg.as_string())
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {e}")
        return False


def send_verification_email(to: str, name: str, token: str) -> bool:
    link = f"http://localhost:3000/verify-email?token={token}"
    body = f"""
    <h2>Welcome to AI Precision Healthcare Platform, {name}!</h2>
    <p>Please verify your email address to activate your account.</p>
    <p><a href="{link}">Verify Email</a></p>
    """
    return send_email(to, "Verify your email", body)


def send_password_reset_email(to: str, name: str, token: str) -> bool:
    link = f"http://localhost:3000/reset-password?token={token}"
    body = f"""
    <h2>Password Reset Requested</h2>
    <p>Hi {name}, click below to reset your password. This link expires in 1 hour.</p>
    <p><a href="{link}">Reset Password</a></p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    """
    return send_email(to, "Reset your password", body)


def send_payment_receipt_email(to: str, name: str, plan: str, amount_inr: float) -> bool:
    body = f"""
    <h2>Payment Successful</h2>
    <p>Hi {name}, your payment of ₹{amount_inr:.2f} for the <b>{plan}</b> plan was successful.</p>
    <p>You now have unlimited access to all disease prediction modules.</p>
    """
    return send_email(to, "Payment Receipt - Precision Healthcare Platform", body)


def send_report_ready_email(to: str, name: str, disease_name: str) -> bool:
    body = f"""
    <h2>Your Health Report is Ready</h2>
    <p>Hi {name}, your {disease_name} prediction report has been generated and is available
    for download from your dashboard.</p>
    """
    return send_email(to, f"Your {disease_name} Report is Ready", body)
