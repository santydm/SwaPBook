from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class EstadoLibroEnum(str, Enum):
    disponible = "Disponible"
    intercambio = "Intercambio"

class LibroCreate(BaseModel):
    titulo: str
    descripcion: str
    estado: EstadoLibroEnum = EstadoLibroEnum.disponible
    idEstudiante: int  # Campo requerido (FK)
    idCategoria: int   # <-- Agrega esto


class LibroResponse(BaseModel):
    idLibro: int
    titulo: str
    descripcion: str
    estado: EstadoLibroEnum

    class Config:
        orm_mode = True
