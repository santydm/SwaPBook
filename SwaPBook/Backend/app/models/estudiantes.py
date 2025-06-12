from sqlalchemy import Column, Integer, String, DateTime, CHAR, Boolean, Enum as SQLAlchemyEnum
import enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class RolEnum(enum.Enum):
    estudiante = "estudiante"
    administrador = "administrador"

class Estudiante(Base):
    __tablename__ = "estudiantes"

    idEstudiante = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    rol = Column(SQLAlchemyEnum(RolEnum), nullable=False, default=RolEnum.estudiante)
    fechaRegistro = Column(DateTime, default=datetime.utcnow)
    fotoPerfil = Column(String(255), nullable=True)
    numeroCelular = Column(String(100), nullable=True)
    correoInstitucional = Column(String(255), unique=True, index=True, nullable=False)
    contrasenia = Column(String(255), nullable=False)
    activo = Column(Boolean, default=False) #campo para activar la cuenta
    
        # Relación uno a muchos con libros
    libros = relationship("Libro", back_populates="estudiante", cascade="all, delete")
    





