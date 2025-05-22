import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
from email.mime.text import MIMEText

load_dotenv()

EMAIL_ORIGEN = os.getenv("EMAIL_ORIGEN")
# Cargar la contraseña del correo electrónico desde las variables de entorno
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


# Enviar correo de bienvenida
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
        
# Enviar correo de recuperación de contraseña
def enviar_correo_recuperacion(destinatario: str, token: str):
    mensaje = EmailMessage()
    mensaje["Subject"] = "Recuperación de contraseña - SwaPBook"
    mensaje["From"] = f"SwaPBook <{EMAIL_ORIGEN}>"
    mensaje["To"] = destinatario

    body = f"""
    Hola,

    Hemos recibido una solicitud para restablecer tu contraseña en SwaPBook.

    Usa el siguiente token para restablecer tu contraseña:

    Token: {token}

    Este token expirará en 1 hora por motivos de seguridad.

    Si no solicitaste este cambio, puedes ignorar este mensaje.
    """

    mensaje.set_content(body)

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_ORIGEN, EMAIL_PASSWORD)
            server.send_message(mensaje)
        print(f"Correo de recuperación enviado a {destinatario}")
    except Exception as e:
        print(f"Error al enviar el correo de recuperación: {e}")
        raise
    
# Enviar correo de verificación para cambio de correo
def enviar_correo_verificacion_cambio(destinatario: str, verificacion_link: str):
    mensaje = EmailMessage()
    mensaje["Subject"] = "Confirma tu cambio de correo en SwaPBook"
    mensaje["From"] = f"SwaPBook <{EMAIL_ORIGEN}>"
    mensaje["To"] = destinatario

    body = f"""
    Hola,

    Hemos recibido una solicitud para cambiar tu correo institucional en SwaPBook.

    Para confirmar este cambio, por favor haz clic en el siguiente enlace:

    {verificacion_link}

    Este enlace expirará en 1 hora.

    Si no solicitaste este cambio, por favor ignora este mensaje.
    """

    mensaje.set_content(body)

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_ORIGEN, EMAIL_PASSWORD)
            server.send_message(mensaje)
        print(f"Correo de verificación para cambio enviado a {destinatario}")
    except Exception as e:
        print(f"Error al enviar el correo de verificación de cambio: {e}")