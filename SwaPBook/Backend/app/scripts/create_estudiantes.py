import sys
import os
from datetime import datetime, timezone
import bcrypt
from faker import Faker
from app.db.database import SessionLocal
from app.models.estudiantes import Estudiante, RolEnum
from app.models.libros import Libro
from app.models.categorias import Categoria


fake = Faker()

# Función para hashear contraseñas
def generar_contrasenia_hash(contrasenia_plana: str) -> str:
    return bcrypt.hashpw(contrasenia_plana.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Función para crear un correo .edu.com a partir del nombre
def generar_correo_edu(nombre: str) -> str:
    dominio = fake.domain_word() + ".edu.com"
    username = nombre.lower().replace(" ", ".").replace("ñ", "n")
    return f"{username}@{dominio}"

# Función principal para crear estudiantes falsos
def crear_estudiantes_fake(cantidad=20):
    db = SessionLocal()
    estudiantes = []

    for _ in range(cantidad):
        nombre = fake.name()
        correo = generar_correo_edu(nombre)
        contrasenia_plana = fake.password(length=10)
        contrasenia_hash = generar_contrasenia_hash(contrasenia_plana)

        estudiante = Estudiante(
            nombre=nombre,
            rol=RolEnum.estudiante,
            fechaRegistro=datetime.now(timezone.utc),
            fotoPerfil=fake.image_url(),
            numeroCelular=fake.phone_number(),
            correoInstitucional=correo,
            contrasenia=contrasenia_hash,
            activo=True
        )

        print(f"{nombre} | {correo} | contraseña: {contrasenia_plana}")
        estudiantes.append(estudiante)

    db.add_all(estudiantes)  # ahora sí, correcto
    db.commit()
    db.close()
    print(f"\n{cantidad} estudiantes creados exitosamente.")

# Ejecuta el script si se llama directamente
if __name__ == "__main__":
    crear_estudiantes_fake(20)
