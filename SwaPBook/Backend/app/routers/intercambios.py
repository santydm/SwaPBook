from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.intercambios import Intercambio, EstadoIntercambioEnum
from app.models.solicitudes import Solicitud, EstadoSolicitudEnum
from app.models.libros import Libro, EstadoLibroEnum
from app.schemas.intercambios import IntercambioResponse, IntercambioEstadoUpdate

router = APIRouter(prefix="/intercambios", tags=["Intercambios"])

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


@router.put("/intercambios/{id_intercambio}/actualizar_estado", response_model=IntercambioResponse)
def actualizar_estado_intercambio(
    id_intercambio: int,
    estado_update: IntercambioEstadoUpdate,
    db: Session = Depends(get_db)
):
    # Buscar el intercambio
    intercambio = db.query(Intercambio).filter(Intercambio.idIntercambio == id_intercambio).first()
    if not intercambio:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado")

    # Verificar que el estado sea "en proceso"
    if intercambio.estado != EstadoIntercambioEnum.en_proceso:
        raise HTTPException(status_code=400, detail="Solo se puede modificar un intercambio en proceso")

    # Modificar estado
    if estado_update.nuevo_estado == EstadoIntercambioEnum.finalizado:
        # Eliminar ambos libros si se finaliza el intercambio
        libro1 = db.query(Libro).filter(Libro.idLibro == intercambio.idLibroSolicitado).first()
        libro2 = db.query(Libro).filter(Libro.idLibro == intercambio.idLibroOfrecido).first()
        if libro1:
            db.delete(libro1)
        if libro2:
            db.delete(libro2)
        intercambio.estado = EstadoIntercambioEnum.finalizado

    elif estado_update.nuevo_estado == EstadoIntercambioEnum.cancelado:
        # Cambiar ambos libros a "Disponible" si se cancela el intercambio
        libro1 = db.query(Libro).filter(Libro.idLibro == intercambio.idLibroSolicitado).first()
        libro2 = db.query(Libro).filter(Libro.idLibro == intercambio.idLibroOfrecido).first()
        if libro1:
            libro1.estado = EstadoLibroEnum.disponible
        if libro2:
            libro2.estado = EstadoLibroEnum.disponible
        intercambio.estado = EstadoIntercambioEnum.cancelado

    else:
        raise HTTPException(status_code=400, detail="Estado no válido o sin cambio")

    # Guardar los cambios en la base de datos
    db.commit()
    db.refresh(intercambio)  # Refrescar la instancia del intercambio para obtener los últimos cambios

    # Retornar el intercambio actualizado usando el modelo de respuesta
    return intercambio
