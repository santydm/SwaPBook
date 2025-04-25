from fastapi import FastAPI
from app.db.database import Base, engine
from app.routers import estudiantes
from app.routers import libros
from app.routers import categorias
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(estudiantes.router)
app.include_router(libros.router)
app.include_router(categorias.router)
# Crear las tablas en la base de datos si no existen (ideal para desarrollo)
Base.metadata.create_all(bind=engine)

# Incluir los routers si ya están definidos
# app.include_router(estudiantes.router)

# Ruta raíz opcional (puedes eliminarla si quieres que solo exponga APIs específicas)
@app.get("/")
def root():
    return {"mensaje": "Bienvenido a SwaPBook"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)