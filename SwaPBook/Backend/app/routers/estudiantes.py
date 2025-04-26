from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.estudiantes import Estudiante
from app.schemas.estudiantes import EstudianteCreate, EstudianteResponse
from app.utils.email_utils import enviar_correo_bienvenida
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
import os
from app.utils.auth import crear_token
from fastapi.responses import RedirectResponse

load_dotenv()

#Obtener la clave secreta del archivo .env
SECRET_KEY = os.getenv("SECRET_KEY")

router = APIRouter(prefix="/estudiantes", tags=["Estudiantes"])

#CONFIGURACION PARA GENERAR TOKEN
s = URLSafeTimedSerializer(SECRET_KEY)


@router.post("/registro", response_model=EstudianteResponse, status_code=201)
def registrar_estudiante(estudiante: EstudianteCreate, db: Session = Depends(get_db)):
    db_estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == estudiante.correoInstitucional).first()
    print("Datos recibidos del frontend", estudiante.dict())
    if db_estudiante:
        raise HTTPException(status_code=400, detail="Correo institucional ya registrado")

    # Crear nuevo estudiante (inicialmente inactivo)
    nuevo_estudiante = Estudiante(
        nombre=estudiante.nombre,
        correoInstitucional=estudiante.correoInstitucional,
        contrasenia=estudiante.contrasenia,
        activo=False  # Hasta que verifique el correo
    )
    db.add(nuevo_estudiante)
    db.commit()
    db.refresh(nuevo_estudiante)
    
        # Crear token de verificación
    token = s.dumps(estudiante.correoInstitucional, salt="email-confirm")
    verificacion_link = f"http://localhost:8000/estudiantes/verificar/{token}"
    
        # Enviar correo
    enviar_correo_bienvenida(estudiante.correoInstitucional, verificacion_link)

    return nuevo_estudiante

@router.get("/verificar/{token}")
def verificar_correo(token: str, db: Session = Depends(get_db)):
    try:
        #Cargar correo desde el token
        correo = s.loads(token, salt="email-confirm", max_age=3600)  # 1 hora de validez
        #Verificar si el correo ya existe en la base de datos
        db_estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == correo).first()
        if not db_estudiante:
            raise HTTPException(status_code=400, detail="El correo no está registrado")

        #Si todo es correcto, se puede proceder a activar la cuenta del estudiante
        db_estudiante.activo = True
        db.commit()
        db.refresh(db_estudiante)

        jwt_token = crear_token({"sub": db_estudiante.correoInstitucional})

        frontend_url = f"http://localhost:5173/verificado?token={jwt_token}" 
        return RedirectResponse(frontend_url)

    except Exception as e:
        # Agregar detalles del error para facilitar el diagnóstico
        print(f"Error al verificar el correo: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor. Intenta nuevamente más tarde.")

@router.get("/", response_model=list[EstudianteResponse])
def obtener_estudiantes(db: Session = Depends(get_db)):
    estudiantes = db.query(Estudiante).all()
    return estudiantes

@router.get("/{id_estudiante}", response_model=EstudianteResponse)
def obtener_estudiante_por_id(id_estudiante: int, db: Session = Depends(get_db)):
    estudiante = db.query(Estudiante).filter(Estudiante.idEstudiante == id_estudiante).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return estudiante


