from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum

class EstadoLibroEnum(str, enum.Enum):
    disponible = "Disponible"
    intercambio = "Intercambio"

class Libro(Base):
    __tablename__ = "libros"

    idLibro = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    estado = Column(Enum(EstadoLibroEnum), default=EstadoLibroEnum.disponible, nullable=False)
    
    idEstudiante = Column(Integer, ForeignKey("estudiantes.idEstudiante", ondelete="CASCADE"), nullable=False)
    estudiante = relationship("Estudiante", back_populates="libros")

    idCategoria = Column(Integer, ForeignKey("categorias.idCategoria"), nullable=False)
    categoria = relationship("Categoria", back_populates="libros")