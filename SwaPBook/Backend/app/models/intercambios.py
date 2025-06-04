from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum, String
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.libros import EstadoLibroEnum
from app.models.solicitudes import Solicitud
from app.models.estudiantes import Estudiante
from enum import Enum as PyEnum

class EstadoIntercambioEnum(str, PyEnum):
    en_proceso = "En proceso"
    finalizado = "Finalizado"
    cancelado = "Cancelado"

class Intercambio(Base):
    __tablename__ = "intercambios"

    idIntercambio = Column(Integer, primary_key=True, index=True)
    idSolicitud = Column(Integer, ForeignKey("solicitudes.idSolicitud"))
    idEstudiante = Column(Integer, ForeignKey("estudiantes.idEstudiante"))
    idEstudianteReceptor = Column(Integer, ForeignKey("estudiantes.idEstudiante"))
    idLibroOfrecido = Column(Integer, ForeignKey("libros.idLibro", ondelete="CASCADE"))
    idLibroSolicitado = Column(Integer, ForeignKey("libros.idLibro", ondelete="CASCADE"))
    fechaEncuentro = Column(DateTime)
    fechaCambioEstado = Column(DateTime, nullable=True)
    horaEncuentro = Column(DateTime)
    lugarEncuentro = Column(String(100), nullable=True)
    estado = Column(Enum(EstadoIntercambioEnum), default=EstadoIntercambioEnum.en_proceso)

    # Relaciones
    #solicitud = relationship("Solicitud", back_populates="intercambio")
    estudiante = relationship("Estudiante", foreign_keys=[idEstudiante])
    estudiante_receptor = relationship("Estudiante", foreign_keys=[idEstudianteReceptor])
    libro_solicitado = relationship("Libro", foreign_keys=[idLibroSolicitado])
    libro_ofrecido = relationship("Libro", foreign_keys=[idLibroOfrecido])

    

