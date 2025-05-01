from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

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
    horaEncuentro: datetime
    estado: EstadoIntercambioEnum

    class Config:
        orm_mode = True

class IntercambioEstadoUpdate(BaseModel):
    nuevo_estado: EstadoIntercambioEnum