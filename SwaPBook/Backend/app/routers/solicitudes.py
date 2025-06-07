from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.solicitudes import Solicitud
from app.models.libros import Libro
from app.schemas.solicitudes import SolicitudCreate, SolicitudResponse, EstadoSolicitudEnum
from app.models.intercambios import Intercambio  # Import Intercambio
from app.schemas.libros import EstadoLibroEnum  # Import EstadoLibroEnum
from app.schemas.intercambios import EstadoIntercambioEnum, IntercambioResponse  # Import EstadoIntercambioEnum
from app.utils.auth import get_current_user
from sqlalchemy.orm import joinedload


router = APIRouter(prefix="/solicitudes", tags=["Solicitudes"])

@router.post("/", response_model=SolicitudResponse, status_code=201)
def crear_solicitud(
    solicitud: SolicitudCreate,
    db: Session = Depends(get_db),
    usuarioSolicitante = Depends(get_current_user)
):
    libro_solicitado = db.get(Libro, solicitud.libroSolicitado)
    libro_ofrecido = db.get(Libro, solicitud.libroOfrecido)

    if not libro_solicitado or not libro_ofrecido:
        raise HTTPException(status_code=404, detail="Libro no encontrado")

    if libro_solicitado.idEstudiante == usuarioSolicitante.idEstudiante:
        raise HTTPException(status_code=400, detail="No puedes solicitar tu propio libro")

    nueva_solicitud = Solicitud(
        estudianteSolicitante=usuarioSolicitante.idEstudiante,
        estudiantePropietario=libro_solicitado.idEstudiante,
        libroOfrecido=solicitud.libroOfrecido,
        libroSolicitado=solicitud.libroSolicitado,
        lugarEncuentro=solicitud.lugarEncuentro,
        fechaEncuentro=solicitud.fechaEncuentro,
        horaEncuentro=solicitud.horaEncuentro,
    )

    db.add(nueva_solicitud)
    db.commit()
    db.refresh(nueva_solicitud)
    return nueva_solicitud

@router.put("/aceptar/{id_solicitud}", response_model=IntercambioResponse)
def aceptar_solicitud(id_solicitud: int, db: Session = Depends(get_db)):
    solicitud = db.query(Solicitud).filter(Solicitud.idSolicitud == id_solicitud).first()
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    if solicitud.estado != EstadoSolicitudEnum.pendiente:
        raise HTTPException(status_code=400, detail="Solo se pueden aceptar solicitudes en estado pendiente")

    # Cambiar estado de la solicitud a aceptada
    solicitud.estado = EstadoSolicitudEnum.aceptada

    # Verificar existencia de los libros
    libro_solicitado = db.query(Libro).filter(Libro.idLibro == solicitud.libroSolicitado).first()
    libro_ofrecido = db.query(Libro).filter(Libro.idLibro == solicitud.libroOfrecido).first()

    if not libro_solicitado or not libro_ofrecido:
        raise HTTPException(status_code=404, detail="Uno o ambos libros no existen")

    # Cambiar estado de los libros
    libro_solicitado.estado = EstadoLibroEnum.intercambio
    libro_ofrecido.estado = EstadoLibroEnum.intercambio

    # Crear el intercambio
    intercambio = Intercambio(
        idSolicitud=solicitud.idSolicitud,
        idEstudiante=solicitud.estudianteSolicitante,
        idEstudianteReceptor=solicitud.estudiantePropietario,
        idLibroSolicitado=solicitud.libroSolicitado,
        idLibroOfrecido=solicitud.libroOfrecido,
        fechaEncuentro=solicitud.fechaEncuentro,
        horaEncuentro=solicitud.horaEncuentro,
        lugarEncuentro=solicitud.lugarEncuentro,
        estado=EstadoIntercambioEnum.en_proceso
    )

    db.add(intercambio)
    db.commit()
    db.refresh(intercambio)

    return intercambio

@router.put("/rechazar/{id_solicitud}")
def rechazar_solicitud(id_solicitud: int, db: Session = Depends(get_db)):
    solicitud = db.query(Solicitud).filter(Solicitud.idSolicitud == id_solicitud).first()
    
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    if solicitud.estado != EstadoSolicitudEnum.pendiente:
        raise HTTPException(status_code=400, detail="Solo se pueden rechazar solicitudes en estado pendiente")

    # Cambiar estado de la solicitud a rechazada
    solicitud.estado = EstadoSolicitudEnum.rechazada

    db.commit()

    return {"detail": "Solicitud rechazada"}


@router.get("/pendientes/{id_estudiante}", response_model=list[SolicitudResponse])
def obtener_solicitudes_pendientes(id_estudiante: int, db: Session = Depends(get_db)):
    solicitudes = db.query(Solicitud).filter(
        Solicitud.estudiantePropietario == id_estudiante,
        Solicitud.estado == EstadoSolicitudEnum.pendiente
    ).options(
        joinedload(Solicitud.solicitante),
        joinedload(Solicitud.libro_solicitado),
        joinedload(Solicitud.libro_ofrecido)
    ).all()
    
    return solicitudes
