from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class Categoria(Base):
    __tablename__ = "categorias"

    idCategoria = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)

    libros = relationship("Libro", back_populates="categoria", cascade="all, delete")
