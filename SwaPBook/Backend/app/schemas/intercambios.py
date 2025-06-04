from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional
from app.schemas.libros import LibroResponse
from app.schemas.estudiantes import EstudiantePerfilSchema


class EstadoIntercambioEnum(str, Enum):
    en_proceso = "En proceso"
    finalizado = "Finalizado"
    cancelado = "Cancelado"

class IntercambioResponse(BaseModel):
    idIntercambio: int
    idSolicitud: int
    idEstudiante: int
    idEstudianteReceptor: int
    idLibroSolicitado: int
    idLibroOfrecido: int
    fechaEncuentro: datetime
    fechaCambioEstado: Optional[datetime] = None
    horaEncuentro: datetime
    lugarEncuentro: Optional[str] = None
    estado: EstadoIntercambioEnum

    libro_solicitado: Optional[LibroResponse]
    libro_ofrecido: Optional[LibroResponse]
    estudiante: Optional[EstudiantePerfilSchema]
    estudiante_receptor: Optional[EstudiantePerfilSchema]

    class Config:
        orm_mode = True

class IntercambioEstadoUpdate(BaseModel):
    nuevo_estado: EstadoIntercambioEnum