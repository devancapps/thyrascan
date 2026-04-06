"""
Email sender using Gmail SMTP with App Password.
"""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from . import config


class EmailSendError(Exception):
    pass


def send_application_email(
    to_address: str,
    subject: str,
    body: str,
) -> None:
    """
    Send a plain-text application email via Gmail SMTP.
    Raises EmailSendError on failure.
    """
    if not config.GMAIL_ADDRESS or not config.GMAIL_APP_PASSWORD:
        raise EmailSendError(
            "GMAIL_ADDRESS and GMAIL_APP_PASSWORD must be set in .env"
        )

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = config.GMAIL_ADDRESS
    msg["To"] = to_address

    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(config.GMAIL_ADDRESS, config.GMAIL_APP_PASSWORD)
            server.sendmail(config.GMAIL_ADDRESS, to_address, msg.as_string())
    except smtplib.SMTPAuthenticationError as e:
        raise EmailSendError(
            "Gmail authentication failed. Make sure you're using an App Password, "
            "not your regular Gmail password. "
            "Generate one at: Google Account → Security → 2-Step Verification → App passwords"
        ) from e
    except smtplib.SMTPException as e:
        raise EmailSendError(f"SMTP error: {e}") from e


def send_daily_digest(
    jobs_pending_review: int,
    jobs_sent_today: int,
    dashboard_url: str = "http://localhost:5000",
) -> None:
    """Send a daily summary email to yourself."""
    if not config.GMAIL_ADDRESS:
        return

    subject = f"JobBot Daily: {jobs_pending_review} jobs to review, {jobs_sent_today} sent today"
    body = f"""Your daily JobBot report:

Jobs waiting for your review: {jobs_pending_review}
Applications sent today: {jobs_sent_today}

Open your dashboard to review and approve:
{dashboard_url}

---
JobBot — your AI-powered PM job search assistant
"""
    try:
        send_application_email(config.GMAIL_ADDRESS, subject, body)
    except EmailSendError as e:
        print(f"[sender] Could not send digest: {e}")
