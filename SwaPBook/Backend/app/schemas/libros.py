from pydantic import BaseModel
from enum import Enum
from typing import Optional

class EstadoLibroEnum(str, Enum):
    disponible = "Disponible"
    intercambio = "Intercambio"

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
    idCategoria: int
    foto: Optional[str]
    estado: EstadoLibroEnum

    # Relación anidada para mostrar el nombre de la categoría
    categoria: Optional[CategoriaResponse] = None

    class Config:
        orm_mode = True
