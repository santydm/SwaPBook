from pydantic import BaseModel, EmailStr
from datetime import datetime

class EstudianteCreate(BaseModel):
    nombre: str
    correInstitucional: EmailStr
    contrasenia: str

class EstudianteResponse(BaseModel):
    idEstudiante: int
    nombre: str
    correoInstitucional: str
    fechaRegistro: datetime

    class config:
        orm_mode = True
    