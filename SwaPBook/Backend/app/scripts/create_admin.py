from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.estudiantes import Estudiante, RolEnum
from app.models.libros import Libro
from app.models.categorias import Categoria

import bcrypt

def hash_password(plain_password: str) -> str:
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

# Datos del admin por defecto
ADMIN_CORREO = "admin@swapbook.edu.com"
ADMIN_CONTRASENIA = hash_password("admin123")
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
