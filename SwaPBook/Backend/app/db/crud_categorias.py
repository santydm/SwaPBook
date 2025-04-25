from sqlalchemy.orm import Session
from app.models.categorias import Categoria
from app.schemas.categorias import CategoriaCreate

def get_categoria_by_nombre(db: Session, nombre: str):
    return db.query(Categoria).filter(Categoria.nombre.ilike(nombre)).first()

def crear_categoria_si_no_existe(db: Session, categoria_data: CategoriaCreate):
    categoria_existente = get_categoria_by_nombre(db, categoria_data.nombre)
    if categoria_existente:
        return categoria_existente
    nueva_categoria = Categoria(nombre=categoria_data.nombre)
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria
