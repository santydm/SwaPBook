from pydantic import BaseModel, EmailStr
from datetime import datetime

class EstudianteCreate(BaseModel):
    nombre: str
    correoInstitucional: EmailStr
    contrasenia: str
    
class EstudianteLogin(BaseModel):
    correo: EmailStr
    contrasenia: str

class EstudianteResponse(BaseModel):
    idEstudiante: int
    nombre: str
    correoInstitucional: str
    contrasenia: str
    fechaRegistro: datetime
    activo: bool

    class Config:
        orm_mode = True
    