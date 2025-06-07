from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.intercambios import Intercambio, EstadoIntercambioEnum
from app.models.solicitudes import Solicitud, EstadoSolicitudEnum
from app.models.libros import Libro, EstadoLibroEnum
from app.schemas.intercambios import IntercambioResponse, IntercambioEstadoUpdate
from sqlalchemy.orm import joinedload
from fastapi import Query
from datetime import datetime


router = APIRouter(prefix="/intercambios", tags=["Intercambios"])


#create_intercambio
@router.post("/crear/{id_solicitud}", response_model=IntercambioResponse)
def crear_intercambio(id_solicitud: int, db: Session = Depends(get_db)):
    # Buscar la solicitud por su ID
    solicitud = db.query(Solicitud).filter(Solicitud.idSolicitud == id_solicitud).first()

    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    # Verificar que la solicitud esté en estado 'aceptada'
    if solicitud.estado != EstadoSolicitudEnum.aceptada:
        raise HTTPException(status_code=400, detail="La solicitud no está aceptada")

    # Crear un intercambio nuevo
    intercambio = Intercambio(
        idSolicitud=solicitud.idSolicitud,
        idEstudiante=solicitud.estudianteSolicitante,
        idEstudianteReceptor=solicitud.estudiantePropietario,
        idLibroSolicitado=solicitud.libroSolicitado,
        idLibroOfrecido=solicitud.libroOfrecido,
        fechaEncuentro=solicitud.fechaEncuentro,
        horaEncuentro=solicitud.horaEncuentro,
        estado=EstadoIntercambioEnum.en_proceso,  # Estado inicial
    )

    # Cambiar el estado de los libros a 'intercambio'
    libro_solicitado = db.query(Libro).filter(Libro.idLibro == solicitud.libroSolicitado).first()
    libro_ofrecido = db.query(Libro).filter(Libro.idLibro == solicitud.libroOfrecido).first()

    if not libro_solicitado or not libro_ofrecido:
        raise HTTPException(status_code=404, detail="Uno o ambos libros no existen")

    libro_solicitado.estado = EstadoLibroEnum.intercambio
    libro_ofrecido.estado = EstadoLibroEnum.intercambio

    # Cambiar el estado de la solicitud a 'aceptada'
    solicitud.estado = EstadoSolicitudEnum.aceptada

    # Guardar los cambios en la base de datos
    db.add(intercambio)
    db.commit()
    db.refresh(intercambio)

    # Responder con el intercambio recién creado
    return intercambio

#actualizar_estado_intercambio
@router.patch("/actualizar-estado/{id_intercambio}", response_model=IntercambioResponse)
def actualizar_estado_intercambio(
    id_intercambio: int,
    estado_update: IntercambioEstadoUpdate,
    db: Session = Depends(get_db)
):
    intercambio = db.query(Intercambio).filter(Intercambio.idIntercambio == id_intercambio).first()
    if not intercambio:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado")

    if intercambio.estado != EstadoIntercambioEnum.en_proceso:
        raise HTTPException(status_code=400, detail="Solo se puede modificar un intercambio en proceso")

    nuevo_estado = estado_update.nuevo_estado

    libro1 = db.query(Libro).filter(Libro.idLibro == intercambio.idLibroSolicitado).first()
    libro2 = db.query(Libro).filter(Libro.idLibro == intercambio.idLibroOfrecido).first()

    if not libro1 or not libro2:
        raise HTTPException(status_code=404, detail="Uno o ambos libros no existen")

    # if nuevo_estado == EstadoIntercambioEnum.finalizado:
    #   db.delete(libro1)
    #    db.delete(libro2)

    elif nuevo_estado == EstadoIntercambioEnum.cancelado:
        libro1.estado = EstadoLibroEnum.disponible
        libro2.estado = EstadoLibroEnum.disponible
        
    
    if nuevo_estado in [EstadoIntercambioEnum.finalizado, EstadoIntercambioEnum.cancelado]:
        intercambio.fechaCambioEstado = datetime.utcnow()


    intercambio.estado = nuevo_estado

    db.commit()
    db.refresh(intercambio)

    return intercambio

#obtener_intercambios_estudiante
@router.get("/mis-intercambios/{id_estudiante}", response_model=list[IntercambioResponse])
def obtener_intercambios_estudiante(
    id_estudiante: int,
    estado: str = Query(None, description="Estados separados por comas"),
    db: Session = Depends(get_db)
):
    estados = estado.split(",") if estado else []
    
    query = db.query(Intercambio).filter(
        (Intercambio.idEstudiante == id_estudiante) |
        (Intercambio.idEstudianteReceptor == id_estudiante)
    )
    
    if estados:
        query = query.filter(Intercambio.estado.in_(estados))

    return query.all()