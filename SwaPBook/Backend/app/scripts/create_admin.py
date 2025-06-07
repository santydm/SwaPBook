from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.estudiantes import Estudiante, RolEnum
from app.models.libros import Libro
from app.models.categorias import Categoria

import bcrypt

def hash_password(plain_password: str) -> str:

    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

if __name__ == "__main__":
    password = "admin123" 
    hashed_password = hash_password(password)

# Datos del admin por defecto
ADMIN_CORREO = "admin@swapbook.com"
ADMIN_CONTRASENIA = hashed_password
ADMIN_NOMBRE = "Administrador General"

def crear_admin():
    db: Session = SessionLocal()

    admin_existente = db.query(Estudiante).filter(Estudiante.correoInstitucional == ADMIN_CORREO).first()
    if admin_existente:
        print("Admin ya existe.")
        db.close()
        return

    nuevo_admin = Estudiante(
        nombre=ADMIN_NOMBRE,
        correoInstitucional=ADMIN_CORREO,
        contrasenia=ADMIN_CONTRASENIA,
        rol=RolEnum.administrador,
        activo=True
    )

    db.add(nuevo_admin)
    db.commit()
    db.refresh(nuevo_admin)
    print(f"✅ Admin creado con correo: {ADMIN_CORREO} y contraseña: {ADMIN_CONTRASENIA}")
    db.close()

if __name__ == "__main__":
    crear_admin()