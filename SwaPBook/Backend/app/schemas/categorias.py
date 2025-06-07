from pydantic import BaseModel

class CategoriaResponse(BaseModel):
    idCategoria: int
    nombre: str

    class Config:
        orm_mode = True