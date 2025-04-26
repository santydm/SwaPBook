from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.estudiantes import Estudiante
from app.schemas.auth_schemas import LoginRequest
from app.schemas.token_schema import Token
from app.utils.auth import verify_password, crear_token  # Asegúrate de que las funciones están bien importadas

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Buscar al estudiante por correo
    estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == request.correoInstitucional).first()

    if not estudiante:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )

    # Verificar si la contraseña hasheada coincide
    if not verify_password(request.contrasenia, estudiante.contrasenia):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )

    # Crear un token de acceso para el estudiante autenticado
    access_token = crear_token({"sub": estudiante.correoInstitucional})
    
    # Retornar el token y el tipo de token
    return {"access_token": access_token, "token_type": "bearer"}
