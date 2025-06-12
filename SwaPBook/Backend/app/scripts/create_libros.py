import os
import random
import requests
from datetime import datetime
from faker import Faker
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.libros import Libro, EstadoLibroEnum
from app.models.estudiantes import Estudiante
from app.models.categorias import Categoria

fake = Faker()

# Ruta absoluta a la carpeta static
STATIC_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(STATIC_FOLDER, exist_ok=True)  # Crear carpeta si no existe

# Lista de nombres de categoría
categorias_nombres = [
    "Ficción", "No ficción", "Ciencia ficción", "Fantasía", "Terror", "Romance",
    "Misterio", "Thriller", "Suspenso", "Aventura", "Histórica", "Biografía",
    "Autobiografía", "Memorias", "Poesía", "Teatro", "Ensayo", "Filosofía",
    "Psicología", "Autoayuda", "Negocios", "Finanzas", "Economía", "Política",
    "Sociología", "Arte", "Arquitectura", "Diseño", "Fotografía", "Cine",
    "Música", "Cocina", "Gastronomía", "Salud", "Nutrición", "Deportes",
    "Viajes", "Geografía", "Historia", "Ciencia", "Matemáticas", "Tecnología",
    "Informática", "Medicina", "Ingeniería", "Literatura infantil", "Juvenil",
    "Educación", "Idiomas", "Religión", "Espiritualidad", "Humor", "Cómics",
    "Manga", "Novela gráfica", "Erótica", "Policíaca", "Western", "Ucronía", "Distopía"
]

def descargar_imagen_y_guardar(nombre_archivo: str) -> str:
    try:
        url = f"https://picsum.photos/seed/{random.randint(1, 10000)}/400/600"
        response = requests.get(url)
        if response.status_code == 200:
            ruta_archivo = os.path.join(STATIC_FOLDER, nombre_archivo)
            with open(ruta_archivo, "wb") as f:
                f.write(response.content)
            return f"/static/{nombre_archivo}"
    except Exception as e:
        print("Error descargando imagen:", e)
    return "/static/default.jpg"

def crear_libros_falsos():
    db: Session = SessionLocal()

    try:
        estudiantes = db.query(Estudiante).all()
        categorias = db.query(Categoria).all()
        categorias_dict = {cat.nombre: cat.idCategoria for cat in categorias}
        libros_creados = 0

        for estudiante in estudiantes:
            for _ in range(10):
                categoria_nombre = random.choice(categorias_nombres)
                categoria_id = categorias_dict[categoria_nombre]

                nombre_imagen = f"libro_{estudiante.idEstudiante}_{libros_creados}.jpg"
                ruta_foto = descargar_imagen_y_guardar(nombre_imagen)

                libro = Libro(
                    titulo=fake.sentence(nb_words=4).rstrip('.'),
                    autor=fake.name(),
                    descripcion=fake.paragraph(nb_sentences=3),
                    fechaRegistro=datetime.utcnow(),
                    estado=EstadoLibroEnum.disponible,
                    foto=ruta_foto,
                    idEstudiante=estudiante.idEstudiante,
                    idCategoria=categoria_id,
                    visibleCatalogo=True
                )
                db.add(libro)
                libros_creados += 1

        db.commit()
        print(f"{libros_creados} libros creados con éxito.")
    except Exception as e:
        db.rollback()
        print("Error al crear libros:", e)
    finally:
        db.close()

if __name__ == "__main__":
    crear_libros_falsos()
