from fastapi import APIRouter, Depends, HTTPException, status , BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from passlib.context import CryptContext
from app.models.estudiantes import Estudiante
from app.models.cambio_correo_pendiente import CambioCorreoPendiente
from app.utils.auth import crear_token, autenticar_usuario
from app.schemas.estudiantes import EstudianteCreate, EstudianteResponse, EstudianteLogin, EstudiantePerfilSchema, EstudianteDeleteRequest, EstudianteUpdate
from app.utils.email_utils import enviar_correo_bienvenida, enviar_correo_verificacion_cambio
from app.core.security import verify_password
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from dotenv import load_dotenv
import os
from datetime import datetime
from app.utils.auth import crear_token, get_current_user
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from fastapi import UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import os
import shutil
from pydantic import EmailStr
from fastapi import Body



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
async def eliminar_cuenta(
    contrasenia: str = Body(..., embed=True), 
    estudiante_actual: Estudiante = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar contraseña
    if not verify_password(contrasenia, estudiante_actual.contrasenia):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta"
        )
    
    # Eliminar cuenta
    db.delete(estudiante_actual)
    db.commit()




@router.get("/perfil", response_model=EstudiantePerfilSchema)
def perfil_estudiante(estudiante: Estudiante = Depends(obtener_estudiante_actual)):
    return {
        "idEstudiante": estudiante.idEstudiante,
        "nombre": estudiante.nombre,
        "correoInstitucional": estudiante.correoInstitucional,
        "fechaRegistro": estudiante.fechaRegistro.strftime("%Y-%m-%d"),
        "activo": estudiante.activo,
        "fotoPerfil": estudiante.fotoPerfil,
        "numeroCelular": estudiante.numeroCelular
    }
    

#edicion de perfil

@router.put("/perfil/editar", response_model=EstudiantePerfilSchema)
async def actualizar_perfil(
    nombre: str = Form(...),
    numeroCelular: str = Form(...),
    correoInstitucional: EmailStr = Form(...),
    fotoPerfil: UploadFile = File(None),
    db: Session = Depends(get_db),
    estudiante: Estudiante = Depends(get_current_user)
):
    # Guardar la foto si se envió archivo
    if fotoPerfil:
        carpeta_fotos = "uploads/fotos_perfil"
        os.makedirs(carpeta_fotos, exist_ok=True)

        extension = os.path.splitext(fotoPerfil.filename)[1]
        nombre_archivo = f"perfil_{estudiante.idEstudiante}{extension}"
        ruta_guardado = os.path.join(carpeta_fotos, nombre_archivo)

        with open(ruta_guardado, "wb") as buffer:
            shutil.copyfileobj(fotoPerfil.file, buffer)

        estudiante.fotoPerfil = f"/uploads/fotos_perfil/{nombre_archivo}"

    # Actualizar campos de texto
    if nombre:
        estudiante.nombre = nombre
    if numeroCelular:
        estudiante.numeroCelular = numeroCelular

    # Validar cambio de correo institucional
    if correoInstitucional and correoInstitucional != estudiante.correoInstitucional:
        correo_en_uso = (
            db.query(Estudiante).filter(Estudiante.correoInstitucional == correoInstitucional).first() or
            db.query(CambioCorreoPendiente).filter(CambioCorreoPendiente.nuevoCorreo == correoInstitucional).first()
        )
        if correo_en_uso:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo institucional ya está en uso o pendiente de verificación."
            )
        cambio = CambioCorreoPendiente(
            idEstudiante=estudiante.idEstudiante,
            nuevoCorreo=correoInstitucional,
            fechaSolicitud=datetime.utcnow()
        )
        db.add(cambio)
        db.commit()
        db.refresh(cambio)
        
        
        # Crear token para verificación del cambio de correo
        token_cambio = s.dumps({'email': correoInstitucional, 'idCambio': cambio.idCambio}, salt="email-change-confirm")

        verificacion_link_cambio = f"http://localhost:8000/estudiantes/verificar_cambio_correo/{token_cambio}"

        # Enviar correo de verificación para cambio de correo
        enviar_correo_verificacion_cambio(correoInstitucional, verificacion_link_cambio)
        
    db.commit()
    db.refresh(estudiante)

    msg = "Perfil actualizado correctamente."
    if correoInstitucional and correoInstitucional != estudiante.correoInstitucional:
        msg += " El cambio de correo está pendiente de verificación."

    return {
        "idEstudiante": estudiante.idEstudiante,
        "nombre": estudiante.nombre,
        "correoInstitucional": estudiante.correoInstitucional,
        "fechaRegistro": estudiante.fechaRegistro,
        "activo": estudiante.activo,
        "mensaje": msg
    }

# Verificación de cambio de correo
@router.get("/verificar_cambio_correo/{token}")
def verificar_cambio_correo(token: str, db: Session = Depends(get_db)):
    try:
        data = s.loads(token, salt="email-change-confirm", max_age=3600)
        
        nuevo_correo = data.get("email")
        id_cambio = data.get("idCambio")
        
        if not nuevo_correo or not id_cambio:
            raise HTTPException(status_code=400, detail="Token inválido o incompleto")

        cambio = db.query(CambioCorreoPendiente).filter(CambioCorreoPendiente.idCambio == id_cambio).first()
        if not cambio:
            raise HTTPException(status_code=404, detail="Solicitud de cambio no encontrada")

        if cambio.nuevoCorreo != nuevo_correo:
            raise HTTPException(status_code=400, detail="Datos del token no coinciden con la solicitud")

        estudiante = db.query(Estudiante).filter(Estudiante.idEstudiante == cambio.idEstudiante).first()
        if not estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")

        estudiante.correoInstitucional = nuevo_correo

        db.delete(cambio)
        db.commit()

        jwt_token = crear_token({"sub": nuevo_correo})
        frontend_url = f"http://localhost:5173/cambio-correo-exitoso?token={jwt_token}&status=success"
        
        return RedirectResponse(frontend_url)

    except SignatureExpired:
        raise HTTPException(status_code=400, detail="Enlace expirado")
    except BadSignature:
        raise HTTPException(status_code=400, detail="Token inválido")
    except Exception as e:
        print(f"Error inesperado en verificación cambio correo: {e}")
        raise HTTPException(status_code=500, detail="Error interno")