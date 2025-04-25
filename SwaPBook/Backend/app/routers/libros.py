from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.estudiantes import Estudiante
from app.models.categorias import Categoria
from app.models.libros import Libro
from app.schemas.libros import LibroCreate, LibroResponse  # Ajusta según tu esquema Pydantic

router = APIRouter(prefix="/libros", tags=["Libros"])

@router.post("/", response_model=LibroResponse, status_code=201)
async def crear_libro(libro_data: LibroCreate, db: Session = Depends(get_db)):
    # 1. Verificar si el estudiante existe
    estudiante = db.get(Estudiante, libro_data.idEstudiante)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    # 2. Verificar si la categoría existe (el idCategoria debe llegar en el request)
    categoria = db.get(Categoria, libro_data.idCategoria)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    # 3. Verificar si ya existe un libro con el mismo título, descripción y categoría
    libro_existente = db.query(Libro).filter(
        Libro.titulo == libro_data.titulo,
        Libro.descripcion == libro_data.descripcion,
        Libro.idCategoria == libro_data.idCategoria
    ).first()

    if libro_existente:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un libro con los mismos datos."
        )

    # 4. Crear el libro usando la categoría existente
    nuevo_libro = Libro(
        titulo=libro_data.titulo,
        descripcion=libro_data.descripcion,
        estado=libro_data.estado,
        idCategoria=categoria.idCategoria,
        idEstudiante=libro_data.idEstudiante
    )

    db.add(nuevo_libro)
    db.commit()
    db.refresh(nuevo_libro)

    return nuevo_libro


@router.get("/", response_model=list[LibroResponse], status_code=200)
def obtener_libros(db: Session = Depends(get_db)):
    # Obtenemos todos los libros de la base de datos
    libros = db.query(Libro).all()
    return libros

@router.get("/{id_libro}", response_model=LibroResponse)
def obtener_libro_por_id(id_libro: int, db: Session = Depends(get_db)):
    libro = db.query(Libro).filter(Libro.idLibro == id_libro).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return libro

