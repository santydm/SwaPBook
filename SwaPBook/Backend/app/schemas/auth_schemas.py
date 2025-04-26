from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    correoInstitucional: EmailStr
    contrasenia: str
