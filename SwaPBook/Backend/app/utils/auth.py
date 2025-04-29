from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from app.core.security import verify_password
from fastapi.security import OAuth2PasswordBearer
from app.db.database import get_db
from app.models.estudiantes import Estudiante
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session


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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Estudiante:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar la autenticación.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        correo_institucional: str = payload.get("sub")
        if correo_institucional is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == correo_institucional).first()
    if estudiante is None:
        raise credentials_exception
    return estudiante
