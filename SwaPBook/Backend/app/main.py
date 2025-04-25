from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routers import estudiantes

app = FastAPI()

# 🚨 Middleware CORS ANTES de cualquier router
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # El frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(estudiantes.router)

# Ruta raíz
@app.get("/")
def root():
    return {"mensaje": "Bienvenido a SwaPBook"}