from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routers import estudiantes
from app.routers import libros
from app.routers import categorias
from app.routers import auth
from app.routers import solicitudes
from app.routers import intercambios
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.admin.router import router as admin_router
from fastapi.staticfiles import StaticFiles  # Para los static files
import os  #  os para crear directorios tambien para las fotos

app = FastAPI()

# directorio para las fotos de los libros
os.makedirs("app/static/images/libros", exist_ok=True)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# directorio para las fotos de los estudiantes
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",  
    "http://localhost:8000", 
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
app.include_router(solicitudes.router)
app.include_router(intercambios.router)
app.include_router(admin_router)

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

from fastapi.openapi.utils import get_openapi
from fastapi.security import HTTPBearer

security = HTTPBearer()

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="SwaPBook API",
        version="1.0.0",
        description="API para SwaPBook",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Ruta raíz
@app.get("/")
def root():
    return {"mensaje": "Bienvenido a SwaPBook"}
