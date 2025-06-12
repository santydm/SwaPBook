from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import random

from app.models.intercambios import Intercambio, EstadoIntercambioEnum
from app.models.libros import Libro, EstadoLibroEnum
from app.models.estudiantes import Estudiante
from app.models.solicitudes import Solicitud, EstadoSolicitudEnum
from app.db.database import SessionLocal

# Crear sesión
session: Session = SessionLocal()

# Obtener solicitudes pendientes
solicitudes_pendientes = session.query(Solicitud).filter(Solicitud.estado == EstadoSolicitudEnum.pendiente).all()

if len(solicitudes_pendientes) < 15:
    print("❌ No hay suficientes solicitudes pendientes. Se requieren al menos 15.")
    session.close()
else:
    # Definir estados deseados
    estados_deseados = (
        [EstadoIntercambioEnum.finalizado] * 15 +
        [EstadoIntercambioEnum.en_proceso] * 5 +
        [EstadoIntercambioEnum.cancelado] * 5
    )
    random.shuffle(estados_deseados)

    intercambios_creados = 0

    for i in range(15):
        solicitud = solicitudes_pendientes[i]

        # Verificar que los libros y estudiantes sean válidos
        if (
            solicitud.estudianteSolicitante == solicitud.estudiantePropietario or
            solicitud.libroSolicitado == solicitud.libroOfrecido
        ):
            continue

        libro1 = session.query(Libro).filter_by(idLibro=solicitud.libroOfrecido).first()
        libro2 = session.query(Libro).filter_by(idLibro=solicitud.libroSolicitado).first()
        estudiante1 = session.query(Estudiante).filter_by(idEstudiante=solicitud.estudianteSolicitante).first()
        estudiante2 = session.query(Estudiante).filter_by(idEstudiante=solicitud.estudiantePropietario).first()

        if not all([libro1, libro2, estudiante1, estudiante2]):
            continue

        estado = estados_deseados[intercambios_creados]
        fecha_encuentro = datetime.now(timezone.utc) + timedelta(days=random.randint(1, 7))
        hora_encuentro = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0) + timedelta(hours=random.randint(1, 12))
        lugar = f"El Matorral"

        # Actualizar solicitud a aceptada
        solicitud.estado = EstadoSolicitudEnum.aceptada
        solicitud.fechaEncuentro = fecha_encuentro
        solicitud.horaEncuentro = hora_encuentro
        solicitud.lugarEncuentro = lugar

        # Crear intercambio
        intercambio = Intercambio(
            idSolicitud=solicitud.idSolicitud,
            idEstudiante=estudiante1.idEstudiante,
            idEstudianteReceptor=estudiante2.idEstudiante,
            idLibroOfrecido=libro1.idLibro,
            idLibroSolicitado=libro2.idLibro,
            fechaEncuentro=fecha_encuentro,
            horaEncuentro=hora_encuentro,
            lugarEncuentro=lugar,
            estado=estado,
            fechaCambioEstado=datetime.now(timezone.utc)
        )

        # Cambiar estado de los libros
        if estado == EstadoIntercambioEnum.en_proceso:
            libro1.estado = EstadoLibroEnum.enIntercambio
            libro2.estado = EstadoLibroEnum.enIntercambio
        elif estado == EstadoIntercambioEnum.finalizado:
            libro1.estado = EstadoLibroEnum.intercambiado
            libro2.estado = EstadoLibroEnum.intercambiado
        elif estado == EstadoIntercambioEnum.cancelado:
            libro1.estado = EstadoLibroEnum.disponible
            libro2.estado = EstadoLibroEnum.disponible

        session.add(intercambio)
        intercambios_creados += 1

    session.commit()
    session.close()
    print(f"✅ Se crearon {intercambios_creados} intercambios usando solicitudes existentes.")
