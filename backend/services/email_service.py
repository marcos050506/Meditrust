import os
import smtplib
import logging
from email.mime.text import MIMEText

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.mailtrap.io")
SMTP_PORT = int(os.getenv("SMTP_PORT", "2525"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "admin@jsonapi.com")


def send_reset_email(to_email: str, reset_link: str):
    if not SMTP_USER or not SMTP_PASSWORD:
        logging.warning("SMTP no configurado, no se envió email de reset")
        return

    msg = MIMEText(
        f"<p>Solicitaste cambiar tu contraseña. "
        f"Si no hiciste esta solicitud, ignora este mensaje.</p>"
        f"<p><a href='{reset_link}'>Restablecer contraseña</a></p>",
        "html",
    )
    msg["Subject"] = "Restablecer contraseña - Sistema Médico"
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, [to_email], msg.as_string())
    except Exception as e:
        logging.error(f"Error enviando email: {e}")
