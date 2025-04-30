from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

class EstadoLibroEnum(str, Enum):
    disponible = "Disponible"
    intercambio = "Intercambio"


class LibroResponse(BaseModel):
    idLibro: int
    titulo: str
    autor: str
    descripcion: str
    idCategoria: int
    foto: Optional[str]
    estado: EstadoLibroEnum

    class Config:
        orm_mode = True
