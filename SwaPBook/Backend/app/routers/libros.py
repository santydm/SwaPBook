from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Query
from sqlalchemy import or_
import shutil
import os
from uuid import uuid4
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
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

@router.get("/catalogo/{id_otro_estudiante}", response_model=List[LibroResponse])
def obtener_catalogo(
    id_otro_estudiante: int,
    search: Optional[str] = Query(None, description="Buscar por título, autor, descripción o categoría"),
    db: Session = Depends(get_db),
    estudiante_actual: Estudiante = Depends(get_current_user)
):
    query = db.query(Libro).options(joinedload(Libro.categoria)).filter(
        Libro.visibleCatalogo == True,
        Libro.idEstudiante == id_otro_estudiante
    )

    if search:
        search_pattern = f"%{search.lower()}%"
        query = query.join(Libro.categoria).filter(
            or_(
                Libro.titulo.ilike(search_pattern),
                Libro.autor.ilike(search_pattern),
                Libro.descripcion.ilike(search_pattern),
                Categoria.nombre.ilike(search_pattern)
            )
        )

    return query.all()

@router.get("/mis-libros/{id_estudiante}", response_model=list[LibroResponse])
def obtener_mis_libros(id_estudiante: int, db: Session = Depends(get_db)):
    libros = db.query(Libro).filter(Libro.idEstudiante == id_estudiante).all()
    return libros


#editar libro

@router.put("/{id_libro}", response_model=LibroResponse)
async def editar_libro(
    id_libro: int,
    titulo: Optional[str] = Form(None),
    autor: Optional[str] = Form(None),
    descripcion: Optional[str] = Form(None),
    idCategoria: Optional[int] = Form(None),
    nueva_foto: Optional[UploadFile] = File(None),
    estudiante: Estudiante = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    libro = db.query(Libro).filter(Libro.idLibro == id_libro).first()

    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")

    if libro.estado != EstadoLibroEnum.disponible:
        raise HTTPException(status_code=400, detail="No se puede editar un libro que no está disponible")

    if libro.idEstudiante != estudiante.idEstudiante:
        raise HTTPException(status_code=403, detail="No tienes permiso para editar este libro")

    if idCategoria:
        categoria = db.query(Categoria).filter(Categoria.idCategoria == idCategoria).first()
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        libro.idCategoria = idCategoria

    if titulo:
        libro.titulo = titulo
    if autor:
        libro.autor = autor
    if descripcion:
        libro.descripcion = descripcion

    if nueva_foto:
        if not nueva_foto.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            raise HTTPException(status_code=400, detail="Formato de imagen no permitido (solo .jpg/.png)")

        extension = nueva_foto.filename.split('.')[-1]
        filename = f"{uuid4()}.{extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(nueva_foto.file, buffer)

        libro.foto = f"/static/images/libros/{filename}"

    db.commit()
    db.refresh(libro)

    return libro


#eliminar libro

@router.delete("/{id_libro}", status_code=204)
def eliminar_libro(
    id_libro: int,
    estudiante: Estudiante = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    libro = db.query(Libro).filter(Libro.idLibro == id_libro).first()

    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")

    if libro.estado != EstadoLibroEnum.disponible:
        raise HTTPException(status_code=400, detail="Solo se pueden eliminar libros en estado Disponible")

    if libro.idEstudiante != estudiante.idEstudiante:
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar este libro")

    db.delete(libro)
    db.commit()

    return  # 204 No Content
