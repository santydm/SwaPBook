from fastapi import FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from app.db.database import Base, engine
from app.routers import (
    estudiantes,
    libros,
    categorias,
    auth,
    solicitudes,
    intercambios,
    notificaciones
)
from app.admin.router import router as admin_router
import os

# Crear directorios necesarios
os.makedirs("app/static/images/libros", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

app = FastAPI()

# Configuración de middleware CORS
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

# Middleware personalizado para log de solicitudes
class PrintRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/libros") and request.method == "POST":
            body = await request.body()
            print("📦 Raw body recibido:", body[:500])
        return await call_next(request)

app.add_middleware(PrintRequestMiddleware)

# Configuración de archivos estáticos
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Incluir routers
app.include_router(estudiantes.router)
app.include_router(libros.router)
app.include_router(categorias.router)
app.include_router(auth.router)
app.include_router(solicitudes.router)
app.include_router(intercambios.router)
app.include_router(admin_router)
app.include_router(notificaciones.router, prefix="/ws", tags=["WebSocket"])

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Configuración OpenAPI personalizada
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
