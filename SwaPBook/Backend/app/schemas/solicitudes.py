from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum
from app.schemas.estudiantes import EstudiantePerfilSchema
from app.schemas.libros import LibroResponse


class EstadoSolicitudEnum(str, Enum):
    pendiente = "Pendiente"
    aceptada = "Aceptada"
    rechazada = "Rechazada"

class SolicitudCreate(BaseModel):
    libroOfrecido: int
    libroSolicitado: int
    lugarEncuentro: str
    fechaEncuentro: datetime
    horaEncuentro: datetime

class SolicitudResponse(BaseModel):
    idSolicitud: int
    estudianteSolicitante: int
    estudiantePropietario: int
    libroOfrecido: int
    libroSolicitado: int
    fechaSolicitud: datetime
    fechaEncuentro: datetime
    horaEncuentro: datetime
    lugarEncuentro: str
    estado: EstadoSolicitudEnum

    solicitante: Optional[EstudiantePerfilSchema]
    libro_solicitado: Optional[LibroResponse]
    libro_ofrecido: Optional[LibroResponse]


    class Config:
        orm_mode = True