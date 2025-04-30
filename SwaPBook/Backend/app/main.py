from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routers import estudiantes
from app.routers import libros
from app.routers import categorias
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PrintRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/libros") and request.method == "POST":
            body = await request.body()
            print("📦 Raw body recibido:", body[:500])  # Limita la impresión a los primeros 500 bytes
        response = await call_next(request)
        return response

app.add_middleware(PrintRequestMiddleware)

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
