from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
import shutil
import os
from uuid import uuid4
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.estudiantes import Estudiante
from app.models.categorias import Categoria
from app.models.libros import Libro, EstadoLibroEnum
from app.schemas.libros import LibroResponse  # Ajusta según tu esquema Pydantic
from app.utils.auth import get_current_user


UPLOAD_DIR = "app/static/images/libros"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/libros", tags=["Libros"])

@router.post("/", response_model=LibroResponse, status_code=201)
async def crear_libro(
    titulo: str = Form(...),
    autor: str = Form(...),
    descripcion: str = Form(...),
    estudiante: Estudiante = Depends(get_current_user),
    idCategoria: int = Form(...),
    foto: UploadFile = File(...),
    db: Session = Depends(get_db)
):


    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    categoria = db.get(Categoria, idCategoria)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    if not foto.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        raise HTTPException(status_code=400, detail="Formato de imagen no permitido (solo .jpg/.png)")

    # Guardar la imagen
    extension = foto.filename.split('.')[-1]
    filename = f"{uuid4()}.{extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(foto.file, buffer)

    # Verificar libro duplicado
    libro_existente = db.query(Libro).filter(
        Libro.titulo == titulo,
        Libro.descripcion == descripcion,
        Libro.idCategoria == idCategoria
    ).first()

    if libro_existente:
        raise HTTPException(status_code=400, detail="Ya existe un libro con los mismos datos.")

    nuevo_libro = Libro(
        titulo=titulo,
        autor=autor,
        descripcion=descripcion,
        estado="Disponible",
        idCategoria=categoria.idCategoria,
        idEstudiante=estudiante.idEstudiante,
        foto=f"/static/images/libros/{filename}",
        visibleCatalogo=True
    )

    db.add(nuevo_libro)
    db.commit()
    db.refresh(nuevo_libro)

    return nuevo_libro

#Devuelve libros visibles para todos, excepto los del mismo estudiante.
@router.get("/catalogo/{id_estudiante}", response_model=list[LibroResponse])
def obtener_catalogo(id_estudiante: int, db: Session = Depends(get_db)):
    libros = db.query(Libro).filter(
        Libro.idEstudiante != id_estudiante,
        Libro.visibleCatalogo == True
    ).all()
    return libros


@router.get("/mis-libros/{id_estudiante}", response_model=list[LibroResponse])
def obtener_mis_libros(id_estudiante: int, db: Session = Depends(get_db)):
    libros = db.query(Libro).filter(Libro.idEstudiante == id_estudiante).all()
    return libros


