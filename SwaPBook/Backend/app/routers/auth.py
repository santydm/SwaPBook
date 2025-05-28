from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
import os
from app.models.estudiantes import Estudiante
from app.schemas.auth_schemas import LoginRequest, PasswordResetRequest, PasswordResetConfirm, ChangePasswordRequest
from app.schemas.token_schema import Token
from app.utils.auth import verify_password, crear_token, get_current_user  # Asegúrate de que las funciones están bien importadas
from jose import jwt, JWTError
from app.core.security import hash_password

#Obtener la clave secreta del archivo .env
SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv("ALGORITHM")

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

# recuperar contraseña
@router.post("/recuperar-contrasenia")
def solicitar_recuperacion(request: PasswordResetRequest, db: Session = Depends(get_db)):
    estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == request.correoInstitucional).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Correo no registrado.")
    
    # Crear el token para el estudiante
    token_data = {"idEstudiante": estudiante.idEstudiante}
    token = crear_token(token_data)
    
    # Crear el enlace para la recuperación
    enlace_recuperacion = f"http://localhost:8000/restablecer-contrasenia?token={token}"  # Cambiar URL por la correcta

    # Enviar correo con el enlace de recuperación
    from app.utils.email_utils import enviar_correo_recuperacion
    enviar_correo_recuperacion(estudiante.correoInstitucional, enlace_recuperacion)

    return {"mensaje": "Se ha enviado un correo con instrucciones para restablecer la contraseña."}



# restablecer contraseña
@router.post("/restablecer-contrasenia")
def confirmar_cambio_contrasenia(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    # Verificar que las contraseñas coinciden usando la validación en el schema
    try:
        # Validar el token
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        id_estudiante = payload.get("idEstudiante")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    # Buscar al estudiante en la base de datos
    estudiante = db.query(Estudiante).filter(Estudiante.idEstudiante == id_estudiante).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado.")
    
    # Si el schema ya validó que las contraseñas coinciden, se puede proceder a actualizar
    from app.core.security import hash_password
    estudiante.contrasenia = hash_password(data.nueva_contrasenia)
    
    # Guardar el cambio en la base de datos
    db.commit()

    return {"mensaje": "Contraseña actualizada exitosamente."}

#cambio de contraseña
@router.post("/cambiar-contrasenia")
def cambiar_contrasenia(
    data: ChangePasswordRequest, 
    db: Session = Depends(get_db), 
    current_user: Estudiante = Depends(get_current_user)
):
    """
    Cambiar la contraseña de un estudiante autenticado.
    """
    # Verificar que la contraseña actual sea la correcta
    if not verify_password(data.current_password, current_user.contrasenia):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La contraseña actual es incorrecta"
    )
    
    # Hashear la nueva contraseña antes de guardarla
    current_user.contrasenia = hash_password(data.new_password)

    # Actualizar la contraseña en la base de datos
    db.commit()

    return {"mensaje": "Contraseña actualizada exitosamente."}
