from pydantic import BaseModel
from enum import Enum
from typing import Optional
from datetime import datetime
from .estudiantes import EstudiantePerfilSchema

class EstadoLibroEnum(str, Enum):
    disponible = "Disponible"
    enIntercambio = "En Intercambio"
    intercambiado = "Intercambiado"

# Agrega este esquema para la categoría
class CategoriaResponse(BaseModel):
    idCategoria: int
    nombre: str

    class Config:
        orm_mode = True

class LibroResponse(BaseModel):
    idLibro: int
    titulo: str
    autor: str
    descripcion: str
    fechaRegistro: datetime
    idCategoria: int
    foto: Optional[str]
    estado: EstadoLibroEnum
    categoria: Optional[CategoriaResponse] = None
    estudiante: EstudiantePerfilSchema 
    visibleCatalogo: bool = True

    # Relación anidada para mostrar el nombre de la categoría
    categoria: Optional[CategoriaResponse] = None

    class Config:
        orm_mode = True
