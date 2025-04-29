from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    correoInstitucional: EmailStr
    contrasenia: str

# Para iniciar el proceso de recuperación de contraseña
class PasswordResetRequest(BaseModel):
    correoInstitucional: str

# Para confirmar el cambio de contraseña
class PasswordResetConfirm(BaseModel):
    token: str  # Token que se envió por correo para validar la acción.
    nueva_contrasenia: str = Field(..., min_length=8, max_length=20, description="La contraseña debe tener al menos 8 caracteres.")
    confirmar_contrasenia: str = Field(..., min_length=8, max_length=20, description="Confirmar la nueva contraseña.")
    
    class Config:
        # Si necesitas asegurar que el valor de 'nueva_contrasenia' y 'confirmar_contrasenia' coincidan, puedes hacer una validación en el backend
        @staticmethod
        def validate_passwords(cls, values):
            if values['nueva_contrasenia'] != values['confirmar_contrasenia']:
                raise ValueError("Las contraseñas no coinciden.")
            return values
        
#cambio de contraseña
class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=8, max_length=20, description="Contraseña actual del usuario.")
    new_password: str = Field(..., min_length=8, max_length=20, description="Nueva contraseña.")
    confirm_new_password: str = Field(..., min_length=8, max_length=20, description="Confirmar nueva contraseña.")
    
    class Config:
        # Validación para asegurarse de que las contraseñas coincidan
        @staticmethod
        def validate_passwords(cls, values):
            if values['new_password'] != values['confirm_new_password']:
                raise ValueError("Las nuevas contraseñas no coinciden.")
            return values