from sqlalchemy import Column, Integer, String, Boolean, Text, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum
from datetime import datetime

class EstadoLibroEnum(str, enum.Enum):
    disponible = "Disponible"
    enIntercambio = "En Intercambio"
    intercambiado = "Intercambiado"

class Libro(Base):
    __tablename__ = "libros"

    idLibro = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    autor = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    fechaRegistro = Column(DateTime, default=datetime.utcnow)
    estado = Column(Enum(EstadoLibroEnum), default=EstadoLibroEnum.disponible, nullable=False)
    foto = Column(String(255), nullable=True)
    idEstudiante = Column(Integer, ForeignKey("estudiantes.idEstudiante", ondelete="CASCADE"), nullable=False)
    idCategoria = Column(Integer, ForeignKey("categorias.idCategoria"), nullable=False)
    visibleCatalogo = Column(Boolean, default=True)

    estudiante = relationship("Estudiante", back_populates="libros")
    categoria = relationship("Categoria", back_populates="libros")