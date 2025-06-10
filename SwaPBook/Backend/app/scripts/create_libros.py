from faker import Faker
import random
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.libros import Libro, EstadoLibroEnum
from app.models.estudiantes import Estudiante
from app.models.categorias import Categoria
from datetime import datetime

fake = Faker()

# Lista de nombres de las 60 categorías
categorias_nombres = [
    "Ficción", "No ficción", "Ciencia ficción", "Fantasía", "Terror",
    "Romance", "Misterio", "Thriller", "Suspenso", "Aventura", "Histórica",
    "Biografía", "Autobiografía", "Memorias", "Poesía", "Teatro", "Ensayo",
    "Filosofía", "Psicología", "Autoayuda", "Negocios", "Finanzas", "Economía",
    "Política", "Sociología", "Arte", "Arquitectura", "Diseño", "Fotografía",
    "Cine", "Música", "Cocina", "Gastronomía", "Salud", "Nutrición", "Deportes",
    "Viajes", "Geografía", "Historia", "Ciencia", "Matemáticas", "Tecnología",
    "Informática", "Medicina", "Ingeniería", "Literatura infantil", "Juvenil",
    "Educación", "Idiomas", "Religión", "Espiritualidad", "Humor", "Cómics",
    "Manga", "Novela gráfica", "Erótica", "Policíaca", "Western", "Ucronía", "Distopía"
]

def generar_libros():
    db: Session = SessionLocal()

    try:
        # Obtener todos los estudiantes
        estudiantes = db.query(Estudiante).all()

        # Crear categorías si no existen
        categorias_existentes = db.query(Categoria).all()
        if not categorias_existentes:
            for nombre in categorias_nombres:
                db.add(Categoria(nombreCategoria=nombre))
            db.commit()

        # Volver a consultar las categorías (asegurar IDs)
        categorias = db.query(Categoria).all()

        libros_a_crear = []
        for estudiante in estudiantes:
            for _ in range(15):
                categoria = random.choice(categorias)
                libro = Libro(
                    titulo=fake.sentence(nb_words=4),
                    autor=fake.name(),
                    descripcion=fake.paragraph(nb_sentences=3),
                    fechaRegistro=datetime.utcnow(),
                    estado=EstadoLibroEnum.disponible,
                    foto=fake.image_url(width=200, height=300),
                    idEstudiante=estudiante.idEstudiante,
                    idCategoria=categoria.idCategoria,
                    visibleCatalogo=True
                )
                libros_a_crear.append(libro)

        # Guardar en la base de datos
        db.add_all(libros_a_crear)
        db.commit()
        print(f"✅ Se crearon {len(libros_a_crear)} libros exitosamente.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error al generar libros: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    generar_libros()
