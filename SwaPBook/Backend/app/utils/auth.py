from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from app.core.security import verify_password


load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EXPIRE_MINUTES = 60 * 24 #1 DIA

def crear_token(data: dict):
    datos = data.copy()
    expira = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    datos.update({"exp": expira})
    token = jwt.encode(datos, SECRET_KEY, algorithm=ALGORITHM)
    return token

def autenticar_usuario(plain_password: str, hashed_password: str) -> bool:
    try:
        return verify_password(plain_password, hashed_password)  # Verificar las contraseñas
    except Exception as e:
        raise Exception(f"Error al autenticar el usuario: {e}")
    
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)