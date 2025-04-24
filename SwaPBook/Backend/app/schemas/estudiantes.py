from pydantic import BaseModel, EmailStr
from datetime import datetime

class EstudianteCreate(BaseModel):
    nombre: str
    correoInstitucional: EmailStr
    contrasenia: str

class EstudianteResponse(BaseModel):
    idEstudiante: int
    nombre: str
    correoInstitucional: str
    fechaRegistro: datetime

    class Config:
        orm_mode = True
    