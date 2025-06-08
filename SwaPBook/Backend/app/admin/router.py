from fastapi import APIRouter, Depends, Path
from .dependencies import admin_required
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import NoResultFound
from app.models.estudiantes import RolEnum
from app.db.database import get_db
from app.models.estudiantes import Estudiante
from app.models.libros import Libro
from app.models.categorias import Categoria


router = APIRouter(
    prefix="/admin",
    tags = ["admin"],
    dependencies=[Depends(admin_required)]
)

@router.put("/estudiantes/{id_estudiante}/rol")
def cambiar_rol_estudiante(
    id_estudiante: int = Path(..., title="ID del estudiante"),
    nuevo_rol: RolEnum = "estudiante",
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_required)
):
    estudiante = db.query(Estudiante).filter(Estudiante.idEstudiante == id_estudiante).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    estudiante.rol = nuevo_rol
    db.commit()
    db.refresh(estudiante)

    return {"message": "mensaje:" f"Rol actualizado a '{nuevo_rol.value}' para el estudiante con ID {id_estudiante}"}



@router.get("/estudiantes")
def get_all_estudiantes(db: Session = Depends(get_db)):
    return db.query(Estudiante).all()


@router.get("/estadisticas/total-libros")
def total_libros(db: Session = Depends(get_db)):
    total = db.query(func.count(Libro.idLibro)).scalar()
    return {"total_libros": total}

@router.get("/estadisticas/libros-por-categoria")
def libros_por_categoria(db: Session = Depends(get_db)):
    try:
        resultados = (
            db.query(Categoria.nombre, func.count(Libro.idLibro))
            .join(Libro, Categoria.idCategoria == Libro.idCategoria)
            .group_by(Categoria.nombre)
            .all()
        )
        
        return [
            {"categoria": str(nombre), "cantidad": int(cantidad)}
            for nombre, cantidad in resultados
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno: {str(e)}"
        )
