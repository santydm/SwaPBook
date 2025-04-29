from pydantic import BaseModel, EmailStr, Field
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
    fechaRegistro: datetime  # Aquí aceptamos que venga ya como string formateado
    activo: bool

    class Config:
        from_attributes = True
        
class EstudianteDeleteRequest(BaseModel):
    contrasenia: str

class EstudiantePerfilSchema(BaseModel):
    idEstudiante: int
    nombre: str
    correoInstitucional: str
    fechaRegistro: datetime  # Cambiar datetime -> str para poder formatear
    activo: bool

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        obj_dict = obj.__dict__.copy()
        if obj.fechaRegistro:
            obj_dict['fechaRegistro'] = obj.fechaRegistro.strftime("%Y-%m-%d")
        return super().from_orm(obj)
    
