from app.db.database import SessionLocal
from app.models.categorias import Categoria

db = SessionLocal()

categorias = [
    "Ficción", 
    "No ficción",
    "Ciencia ficción",
    "Fantasía",
    "Terror",
    "Romance",
    "Misterio",
    "Thriller",
    "Suspenso",
    "Aventura",
    "Histórica",
    "Biografía",
    "Autobiografía",
    "Memorias",
    "Poesía",
    "Teatro",
    "Ensayo",
    "Filosofía",
    "Psicología",
    "Autoayuda",
    "Negocios",
    "Finanzas",
    "Economía",
    "Política",
    "Sociología",
    "Arte",
    "Arquitectura",
    "Diseño",
    "Fotografía",
    "Cine",
    "Música",
    "Cocina",
    "Gastronomía",
    "Salud",
    "Nutrición",
    "Deportes",
    "Viajes",
    "Geografía",
    "Historia",
    "Ciencia",
    "Matemáticas",
    "Tecnología",
    "Informática",
    "Medicina",
    "Ingeniería",
    "Literatura infantil",
    "Juvenil",
    "Educación",
    "Idiomas",
    "Religión",
    "Espiritualidad",
    "Humor",
    "Cómics",
    "Manga",
    "Novela gráfica",
    "Erótica",
    "Policíaca",
    "Western",
    "Ucronía",
    "Distopía"
]

for nombre in categorias:
    if not db.query(Categoria).filter_by(nombre=nombre).first():
        db.add(Categoria(nombre=nombre))

db.commit()
db.close()
