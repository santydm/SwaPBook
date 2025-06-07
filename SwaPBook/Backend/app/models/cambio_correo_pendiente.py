# models/cambio_correo_pendiente.py
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime, timedelta
from app.db.database import Base

class CambioCorreoPendiente(Base):
    __tablename__ = "cambios_correo_pendiente"

    idCambio = Column(String, primary_key=True, default=lambda: str(uuid4()))
    idEstudiante = Column(Integer, ForeignKey("estudiantes.idEstudiante"), nullable=False)
    nuevoCorreo = Column(String(50), nullable=False)
    fechaSolicitud = Column(DateTime, default=datetime.utcnow)
    expiraEn = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(hours=24))
    usado = Column(Boolean, default=False)

    estudiante = relationship("Estudiante", backref="cambios_correo")
