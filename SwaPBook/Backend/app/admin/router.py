from fastapi import APIRouter, Depends, Path, HTTPException, Query, Body
from .dependencies import admin_required
from sqlalchemy.orm import Session , joinedload
from sqlalchemy import func, case, literal_column, cast, String, or_
from sqlalchemy.exc import NoResultFound
from typing import Optional, List
from datetime import date
from app.models.estudiantes import RolEnum
from app.db.database import get_db
from app.models.estudiantes import Estudiante
from app.schemas.estudiantes import EstudianteResponse
from app.models.solicitudes import Solicitud
from app.models.libros import Libro
from app.models.categorias import Categoria
from app.models.intercambios import Intercambio, EstadoIntercambioEnum
from enum import Enum


router = APIRouter(
    prefix="/admin",
    tags = ["admin"],
    dependencies=[Depends(admin_required)]
)

class RolEnum(str, Enum):
    estudiante = "estudiante"
    administrador = "administrador"

@router.put("/estudiantes/{id_estudiante}/rol")
def cambiar_rol_estudiante(
    id_estudiante: int = Path(..., title="ID del estudiante"),
    nuevo_rol: RolEnum = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    estudiante = db.query(Estudiante).filter(Estudiante.idEstudiante == id_estudiante).first()
    
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    estudiante.rol = nuevo_rol
    db.commit()
    return {"message": f"Rol actualizado a {nuevo_rol.value}"}

@router.put("/estudiantes/{id_estudiante}/estado")
def cambiar_estado_estudiante(
    id_estudiante: int = Path(..., title="ID del estudiante"),
    activo: bool = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    estudiante = db.query(Estudiante).filter(Estudiante.idEstudiante == id_estudiante).first()
    
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    estudiante.activo = activo
    db.commit()
    return {"message": f"Estado actualizado a {'activo' if activo else 'inactivo'}"}



@router.get("/estudiantes")
def get_all_estudiantes(db: Session = Depends(get_db)):
    return db.query(Estudiante).all()

#filtrar por estudiante

@router.get("/estudiantes/filtrar", response_model=List[EstudianteResponse])
def filtrar_estudiantes(
    search: Optional[str] = Query(None, description="Buscar por nombre, correo, rol o fecha de registro"),
    db: Session = Depends(get_db)
):
    query = db.query(Estudiante)

    if search:
        search_pattern = f"%{search.lower()}%"
        query = query.filter(
            or_(
        func.lower(Estudiante.nombre).like(f"%{search_pattern}%"),
        func.lower(Estudiante.correoInstitucional).like(f"%{search_pattern}%"),
        func.lower(cast(Estudiante.rol, String)).like(f"%{search_pattern}%"),  
        cast(Estudiante.fechaRegistro, String).like(f"%{search_pattern}%")
            )
        )

    return query.all()



@router.get("/libros")
def get_all_libros(db: Session = Depends(get_db)):
    try:
        libros = (
            db.query(Libro)
            .options(
                joinedload(Libro.categoria),
                joinedload(Libro.estudiante)
            )
            .all()
        )
        
        return [
            {
                "idLibro": libro.idLibro,
                "titulo": libro.titulo,
                "autor": libro.autor,
                "descripcion": libro.descripcion,
                "foto": libro.foto,
                "estado": libro.estado,
                "fechaRegistro": libro.fechaRegistro.isoformat() if libro.fechaRegistro else None,
                "visibleCatalogo": libro.visibleCatalogo,
                "categoria": libro.categoria.nombre if libro.categoria else "Sin categoría",
                "estudiante": {
                    "nombre": libro.estudiante.nombre if libro.estudiante else "Anónimo",
                    "foto": libro.estudiante.fotoPerfil if libro.estudiante else None
                }
            }
            for libro in libros
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.get("/libros/filtrar")
def filtrar_libros_admin(
    search: Optional[str] = Query(None, description="Buscar por título, autor, categoría o estudiante"),
    db: Session = Depends(get_db)
):
    try:
        query = (
            db.query(Libro)
            .options(
                joinedload(Libro.categoria),
                joinedload(Libro.estudiante)
            )
        )
        
        if search:
            search_pattern = f"%{search.lower()}%"
            query = query.filter(
                or_(
                    func.lower(Libro.titulo).like(search_pattern),
                    func.lower(Libro.autor).like(search_pattern),
                    func.lower(Libro.descripcion).like(search_pattern),
                    func.lower(Categoria.nombre).like(search_pattern),
                    func.lower(Estudiante.nombre).like(search_pattern)
                )
            ).join(Categoria, isouter=True).join(Estudiante, isouter=True)
        
        libros = query.all()
        
        return [
            {
                "idLibro": libro.idLibro,
                "titulo": libro.titulo,
                "autor": libro.autor,
                "descripcion": libro.descripcion,
                "foto": libro.foto,
                "estado": libro.estado,
                "fechaPublicacion": libro.fechaRegistro.isoformat() if libro.fechaRegistro else None,
                "visibleCatalogo": libro.visibleCatalogo,
                "categoria": libro.categoria.nombre if libro.categoria else "Sin categoría",
                "estudiante": {
                    "nombre": libro.estudiante.nombre if libro.estudiante else "Anónimo",
                    "foto": libro.estudiante.fotoPerfil if libro.estudiante else None
                }
            }
            for libro in libros
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

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

@router.get("/estadisticas/horarios/heatmap")
def obtener_horarios_frecuentes(db: Session = Depends(get_db)):
    dias_semana = {
        0: "Domingo",
        1: "Lunes",
        2: "Martes",
        3: "Miércoles",
        4: "Jueves",
        5: "Viernes",
        6: "Sábado",
    }


    franja_horaria = case(
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('00:00:00', '05:59:59'), '00:00-06:00'),
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('06:00:00', '07:59:59'), '06:00-08:00'),
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('08:00:00', '09:59:59'), '08:00-10:00'),
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('10:00:00', '11:59:59'), '10:00-12:00'),
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('12:00:00', '13:59:59'), '12:00-14:00'),
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('14:00:00', '15:59:59'), '14:00-16:00'),
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('16:00:00', '17:59:59'), '16:00-18:00'),
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('18:00:00', '19:59:59'), '18:00-20:00'),
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('20:00:00', '21:59:59'), '20:00-22:00'),
    (func.to_char(Intercambio.horaEncuentro, 'HH24:MI:SS').between('22:00:00', '23:59:59'), '22:00-00:00'),
).label("franja")
    
    resultados = (
        db.query(
            func.extract("dow", Intercambio.horaEncuentro).label("dia"),
            franja_horaria,
            func.count().label("cantidad")
        )
        .group_by("dia", "franja")
        .order_by("dia", "franja")
        .all()
    )

    heatmap = []
    for r in resultados:
        heatmap.append({
            "dia": dias_semana.get(int(r.dia), "Desconocido"),
            "franja": r.franja,
            "cantidad": r.cantidad
        })
    
    return heatmap


@router.get("/estadisticas/intercambios")
def resumen_intercambios(db: Session = Depends(get_db)):
    total_creados = db.query(func.count(Intercambio.idIntercambio)).scalar()

    total_finalizados = db.query(func.count(Intercambio.idIntercambio)).filter(
        Intercambio.estado == EstadoIntercambioEnum.finalizado
    ).scalar()

    total_cancelados = db.query(func.count(Intercambio.idIntercambio)).filter(
        Intercambio.estado == EstadoIntercambioEnum.cancelado
    ).scalar()

    intercambios = db.query(Intercambio).all()
    intercambios_data = [
        {
            "idIntercambio": i.idIntercambio,
            "idSolicitud": i.idSolicitud,
            "idEstudiante": i.idEstudiante,
            "idEstudianteReceptor": i.idEstudianteReceptor,
            "idLibroOfrecido": i.idLibroOfrecido,
            "idLibroSolicitado": i.idLibroSolicitado,
            "fechaEncuentro": i.fechaEncuentro.isoformat() if i.fechaEncuentro else None,
            "fechaCambioEstado": i.fechaCambioEstado.isoformat() if i.fechaCambioEstado else None,
            "horaEncuentro": i.horaEncuentro.isoformat() if i.horaEncuentro else None,
            "lugarEncuentro": i.lugarEncuentro,
            "estado": i.estado
        }
        for i in intercambios
    ]

    return {
        "total_creados": total_creados,
        "total_finalizados": total_finalizados,
        "total_cancelados": total_cancelados,
        "intercambios": intercambios_data
    }

@router.get("/estadisticas/top-libros")
def top_libros_mas_intercambiados(db: Session = Depends(get_db)):
    resultados = (
        db.query(
            Libro.titulo,
            func.count(Intercambio.idIntercambio).label("cantidad")
        )
        .join(Intercambio, (Intercambio.idLibroSolicitado == Libro.idLibro) | (Intercambio.idLibroOfrecido == Libro.idLibro))
        .group_by(Libro.idLibro, Libro.titulo)
        .order_by(func.count(Intercambio.idIntercambio).desc())
        .limit(10)
        .all()
        )

    return [
        {"titulo": titulo, "cantidad": cantidad}
        for titulo, cantidad in resultados
        ]



@router.get("/estadisticas/oferta-demanda")
def libros_mas_solicitados(db: Session = Depends(get_db)):
    sub_demanda = (
        db.query(
            Solicitud.libroSolicitado.label("idLibro"),
            func.count(Solicitud.idSolicitud).label("demanda")
        )
        .group_by(Solicitud.libroSolicitado)
        .subquery()
    )

    sub_oferta = (
        db.query(
            Libro.idLibro.label("idLibro"),
            func.count(Libro.idLibro).label("oferta")
        )
        .group_by(Libro.idLibro)
        .subquery()
    )

    resultados = (
        db.query(
            Libro.titulo,
            func.coalesce(sub_demanda.c.demanda, 0).label("demanda"),
            func.coalesce(sub_oferta.c.oferta, 0).label("oferta"),
            (func.coalesce(sub_demanda.c.demanda, 0) - func.coalesce(sub_oferta.c.oferta, 0)).label("diferencia")
        )
        .outerjoin(sub_demanda, Libro.idLibro == sub_demanda.c.idLibro)
        .outerjoin(sub_oferta, Libro.idLibro == sub_oferta.c.idLibro)
        .group_by(Libro.titulo, sub_demanda.c.demanda, sub_oferta.c.oferta)
        .order_by(func.coalesce(sub_demanda.c.demanda, 0) - func.coalesce(sub_oferta.c.oferta, 0).desc())
        .all()
    )

    return [
        {
            "titulo": r.titulo,
            "demanda": int(r.demanda),
            "oferta": int(r.oferta),
            "diferencia": int(r.diferencia)
        }
        for r in resultados if r.demanda > r.oferta  # Solo mostrar si hay más demanda que oferta
    ]


