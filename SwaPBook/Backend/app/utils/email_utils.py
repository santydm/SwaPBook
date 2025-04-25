import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
from email.mime.text import MIMEText

load_dotenv()

EMAIL_ORIGEN = os.getenv("EMAIL_ORIGEN")
# Cargar la contraseña del correo electrónico desde las variables de entorno
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def enviar_correo_bienvenida(destinatario: str, verificacion_link: str):
    mensaje = EmailMessage()
    mensaje["subject"] = "¡Bienvenido a SwaPBook!"
    mensaje["from"] = f"SwaPBook <{EMAIL_ORIGEN}>"
    mensaje["To"] = destinatario
    mensaje.set_content("¡Gracias por registrarte en SwaPBook!")

    body = f"""
    Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:
    
    {verificacion_link}
    
    Este enlace expirara en 1 hora."""

    mensaje.set_content(body)  # El cuerpo del correo
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_ORIGEN, EMAIL_PASSWORD)
            server.send_message(mensaje)
        print(f"Correo de verificación enviado a {destinatario}")
    except Exception as e:
        print(f"Error al enviar el correo de verificación: {e}")