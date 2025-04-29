from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from passlib.context import CryptContext
from app.models.estudiantes import Estudiante
from app.utils.auth import crear_token, autenticar_usuario
from app.schemas.estudiantes import EstudianteCreate, EstudianteResponse, EstudianteLogin, EstudiantePerfilSchema, EstudianteDeleteRequest
from app.utils.email_utils import enviar_correo_bienvenida
from app.core.security import verify_password
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from dotenv import load_dotenv
import os
from app.utils.auth import crear_token, get_current_user
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError


load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#Obtener la clave secreta del archivo .env
SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv("ALGORITHM")

router = APIRouter(prefix="/estudiantes", tags=["Estudiantes"])

#CONFIGURACION PARA GENERAR TOKEN
s = URLSafeTimedSerializer(SECRET_KEY)


@router.post("/registro", response_model=EstudianteResponse, status_code=201)
def registrar_estudiante(estudiante: EstudianteCreate, db: Session = Depends(get_db)):
    db_estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == estudiante.correoInstitucional).first()
    print("Datos recibidos del frontend", estudiante.dict())
    if db_estudiante:
        raise HTTPException(status_code=400, detail="Correo institucional ya registrado")
    
    hashed_password = pwd_context.hash(estudiante.contrasenia)

    # Crear nuevo estudiante (inicialmente inactivo)
    nuevo_estudiante = Estudiante(
        nombre=estudiante.nombre,
        correoInstitucional=estudiante.correoInstitucional,
        contrasenia=hashed_password,
        activo=False  # Hasta que verifique el correo
    )
    db.add(nuevo_estudiante)
    db.commit()
    db.refresh(nuevo_estudiante)
    
        # Crear token de verificación
    token = s.dumps({'email': estudiante.correoInstitucional}, salt="email-confirm")
    verificacion_link = f"http://localhost:8000/estudiantes/verificar/{token}"
    
        # Enviar correo
    enviar_correo_bienvenida(estudiante.correoInstitucional, verificacion_link)

    return nuevo_estudiante

@router.get("/verificar/{token}")
def verificar_correo(token: str, db: Session = Depends(get_db)):
    try:
        print(f"Token recibido: {token}")  # Depuración
        
        # Decodificar el token (cambia esta línea)
        data = s.loads(token, salt="email-confirm", max_age=3600)
        correo = data['email'] if isinstance(data, dict) else data  # Compatibilidad con tokens antiguos
        print(f"Correo decodificado: {correo}")
        
        db_estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == correo).first()
        if not db_estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")
        
        if not db_estudiante.activo:
            db_estudiante.activo = True
            db.commit()
            print("Cuenta activada en BD")  # Depuración
        
        jwt_token = crear_token({"sub": db_estudiante.correoInstitucional})
        
        # Cambia el return por esto:
        frontend_url = f"http://localhost:5173/cuenta-activada?token={jwt_token}&status=success"
        print(f"Redirigiendo a: {frontend_url}")  # Depuración
        return RedirectResponse(frontend_url)

    except SignatureExpired:
        raise HTTPException(status_code=400, detail="Enlace expirado")
    except BadSignature:
        raise HTTPException(status_code=400, detail="Token inválido")
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno")
    
@router.post("/login", response_model=EstudianteResponse)
async def login(estudiante_login: EstudianteLogin, db: Session = Depends(get_db)):
    # Busca al estudiante en la base de datos con el correo proporcionado
    estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == estudiante_login.correo).first()
    
    # Si no se encuentra al estudiante
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    # Verifica la contraseña
    if not autenticar_usuario(estudiante_login.contrasenia, estudiante.contrasenia):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    # Si la cuenta está inactiva
    if not estudiante.activo:
        raise HTTPException(status_code=400, detail="Cuenta no activada")
    
    # Si las credenciales son correctas, crea el token
    token = crear_token({"sub": estudiante.correoInstitucional})
    
    fecha_registro = estudiante.fechaRegistro.strftime("%Y-%m-%d")

    # Devolver los datos del estudiante (sin la contraseña) y el token
    return {
        "idEstudiante": estudiante.idEstudiante,
        "nombre": estudiante.nombre,
        "correoInstitucional": estudiante.correoInstitucional,
        "fechaRegistro": fecha_registro,
        "activo": estudiante.activo,
        "access_token": token,
        "token_type": "bearer"
    }

def obtener_estudiante_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == user_email).first()
    if estudiante is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    return estudiante



@router.get("/", response_model=list[EstudianteResponse])
def obtener_estudiantes(db: Session = Depends(get_db)):
    estudiantes = db.query(Estudiante).all()
    return estudiantes

#eliminar estudiante
@router.delete("/eliminar", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_mi_cuenta(
    datos: EstudianteDeleteRequest,
    db: Session = Depends(get_db),
    estudiante_actual: Estudiante = Depends(get_current_user)
):
    if not verify_password(datos.contrasenia, estudiante_actual.contrasenia):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contraseña incorrecta. No se pudo eliminar la cuenta."
        )
    
    db.delete(estudiante_actual)
    db.commit()
    return



@router.get("/perfil", response_model=EstudiantePerfilSchema)
def perfil_estudiante(estudiante: Estudiante = Depends(obtener_estudiante_actual)):
    return {
        "idEstudiante": estudiante.idEstudiante,
        "nombre": estudiante.nombre,
        "correoInstitucional": estudiante.correoInstitucional,
        "fechaRegistro": estudiante.fechaRegistro.strftime("%Y-%m-%d"),
        "activo": estudiante.activo
    }
    


