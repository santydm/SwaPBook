from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routers import estudiantes
from app.routers import libros
from app.routers import categorias
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Routers
app.include_router(estudiantes.router)
app.include_router(libros.router)
app.include_router(categorias.router)
app.include_router(auth.router)
# Crear las tablas en la base de datos si no existen (ideal para desarrollo)

# Crear las tablas

Base.metadata.create_all(bind=engine)

# Ruta raíz
@app.get("/")
def root():
    return {"mensaje": "Bienvenido a SwaPBook"}
