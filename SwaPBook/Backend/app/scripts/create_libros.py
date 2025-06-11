import random
from datetime import datetime
from faker import Faker
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.libros import Libro, EstadoLibroEnum
from app.models.estudiantes import Estudiante
from app.models.categorias import Categoria

fake = Faker()

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

def crear_libros_falsos():
    db: Session = SessionLocal()

    try:
        # Obtener todos los estudiantes y categorías desde la BD
        estudiantes = db.query(Estudiante).all()
        categorias = db.query(Categoria).all()
        categorias_dict = {cat.nombre: cat.idCategoria for cat in categorias}

        libros_creados = 0

        for estudiante in estudiantes:
            for _ in range(10):  
                categoria_nombre = random.choice(categorias_nombres)
                categoria_id = categorias_dict[categoria_nombre]

                libro = Libro(
                    titulo=fake.sentence(nb_words=4).rstrip('.'),
                    autor=fake.name(),
                    descripcion=fake.paragraph(nb_sentences=3),
                    fechaRegistro=datetime.utcnow(),
                    estado=EstadoLibroEnum.disponible,
                    foto=fake.image_url(),
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
