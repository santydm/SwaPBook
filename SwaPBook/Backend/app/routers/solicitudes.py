from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.solicitudes import Solicitud
from app.models.libros import Libro
from app.schemas.solicitudes import SolicitudCreate, SolicitudResponse
from app.utils.auth import get_current_user

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

