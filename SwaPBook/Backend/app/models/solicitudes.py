from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base
from enum import Enum as PyEnum

class EstadoSolicitudEnum(str, PyEnum):
    pendiente = "Pendiente"
    aceptada = "Aceptada"
    rechazada = "Rechazada"


class Solicitud(Base):
    __tablename__ = "solicitudes"

    idSolicitud = Column(Integer, primary_key=True, index=True)
    estudianteSolicitante = Column(Integer, ForeignKey("estudiantes.idEstudiante"))
    estudiantePropietario = Column(Integer, ForeignKey("estudiantes.idEstudiante"))
    libroOfrecido = Column(Integer, ForeignKey("libros.idLibro"))
    libroSolicitado = Column(Integer, ForeignKey("libros.idLibro"))
    fechaSolicitud = Column(DateTime, default=datetime.utcnow)
    fechaEncuentro = Column(DateTime, nullable=True)
    horaEncuentro = Column(DateTime, nullable=True)
    lugarEncuentro = Column(String(100), nullable=True)
    estado = Column(Enum(EstadoSolicitudEnum), default=EstadoSolicitudEnum.pendiente) 


    solicitante = relationship("Estudiante", foreign_keys=[estudianteSolicitante])
    propietario = relationship("Estudiante", foreign_keys=[estudiantePropietario])
    libro_ofrecido = relationship("Libro", foreign_keys=[libroOfrecido])
    libro_solicitado = relationship("Libro", foreign_keys=[libroSolicitado])

