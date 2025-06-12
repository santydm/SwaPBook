import os
import random
import uuid
import requests
from datetime import datetime, timezone
import bcrypt
from faker import Faker
from app.db.database import SessionLocal
from app.models.estudiantes import Estudiante, RolEnum
from app.models.libros import Libro
from app.models.categorias import Categoria

fake = Faker()

# Ruta absoluta al directorio 'static/fotos_perfil'
STATIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'static', 'fotos_perfil')
os.makedirs(STATIC_DIR, exist_ok=True)

def generar_contrasenia_hash(contrasenia_plana: str) -> str:
    return bcrypt.hashpw(contrasenia_plana.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def generar_correo_edu(nombre: str) -> str:
    dominio = fake.domain_word() + ".edu.com"
    username = nombre.lower().replace(" ", ".").replace("ñ", "n")
    return f"{username}@{dominio}"

def descargar_foto_perfil() -> str:
    gender = random.choice(['men', 'women'])
    index = random.randint(0, 99)
    url = f"https://randomuser.me/api/portraits/{gender}/{index}.jpg"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            nombre_archivo = f"{uuid.uuid4().hex}.jpg"
            ruta_local = os.path.join(STATIC_DIR, nombre_archivo)
            with open(ruta_local, 'wb') as f:
                f.write(response.content)
            return f"/static/fotos_perfil/{nombre_archivo}"
    except Exception as e:
        print("Error descargando foto de perfil:", e)

    return "/static/fotos_perfil/default.jpg"  # fallback si falla

def crear_estudiantes_fake(cantidad=40):
    from sqlalchemy.orm import Session
    db: Session = SessionLocal()
    estudiantes = []

    for _ in range(cantidad):
        nombre = fake.name()
        correo = generar_correo_edu(nombre)
        contrasenia_plana = fake.password(length=10)
        contrasenia_hash = generar_contrasenia_hash(contrasenia_plana)
        foto_perfil = descargar_foto_perfil()

        estudiante = Estudiante(
            nombre=nombre,
            rol=RolEnum.estudiante,
            fechaRegistro=datetime.now(timezone.utc),
            fotoPerfil=foto_perfil,
            numeroCelular=fake.phone_number(),
            correoInstitucional=correo,
            contrasenia=contrasenia_hash,
            activo=True
        )

        print(f"{nombre} | {correo} | contraseña: {contrasenia_plana}")
        estudiantes.append(estudiante)

    db.add_all(estudiantes)
    db.commit()
    db.close()
    print(f"\n{cantidad} estudiantes creados exitosamente.")

if __name__ == "__main__":
    crear_estudiantes_fake(40)
