from sqlalchemy import Column, Integer, String, DateTime, CHAR
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Estudiante(Base):
    __tablename__ = "estudiantes"

    idEstudiante = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    rol = Column(CHAR(10), nullable=False, default="Estudiante")
    fechaRegistro = Column(DateTime, default=datetime.utcnow)
    correoInstitucional = Column(String(50), unique=True, index=True, nullable=False)
    contrasenia = Column(String(20), nullable=False)

