from fastapi import FastAPI
from app.db.database import Base, engine
from app.routers import estudiantes
# Importa tus routers aquí cuando los tengas (por ahora solo uno como ejemplo)
# from app.routers import estudiantes

app = FastAPI()
app.include_router(estudiantes.router)
# Crear las tablas en la base de datos si no existen (ideal para desarrollo)
Base.metadata.create_all(bind=engine)

# Incluir los routers si ya están definidos
# app.include_router(estudiantes.router)

# Ruta raíz opcional (puedes eliminarla si quieres que solo exponga APIs específicas)
@app.get("/")
def root():
    return {"mensaje": "Bienvenido a SwaPBook"}