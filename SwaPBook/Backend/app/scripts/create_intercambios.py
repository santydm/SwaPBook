from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import random

from app.models.intercambios import Intercambio, EstadoIntercambioEnum
from app.models.libros import Libro, EstadoLibroEnum
from app.models.estudiantes import Estudiante
from app.models.solicitudes import Solicitud  # 👈 Asegúrate de importar el modelo correcto
from app.db.database import SessionLocal  # Usa tu propia función para obtener sesión

# Crear una nueva sesión
session: Session = SessionLocal()

# Obtener todos los estudiantes y libros disponibles
estudiantes = session.query(Estudiante).all()
libros_disponibles = session.query(Libro).filter(Libro.estado == EstadoLibroEnum.disponible).all()

# Validar que haya suficientes datos
if len(estudiantes) < 2 or len(libros_disponibles) < 2:
    print("No hay suficientes estudiantes o libros disponibles.")
else:
    num_intercambios = 50
    intercambios_creados = 0
    usados = set()

    while intercambios_creados < num_intercambios:
        libro1 = random.choice(libros_disponibles)
        libro2 = random.choice(libros_disponibles)

        if libro1.idLibro == libro2.idLibro:
            continue
        if libro1.idLibro in usados or libro2.idLibro in usados:
            continue

        estudiante1 = libro1.estudiante
        estudiante2 = libro2.estudiante

        if estudiante1.idEstudiante == estudiante2.idEstudiante:
            continue

        estado = random.choice([EstadoIntercambioEnum.en_proceso, EstadoIntercambioEnum.finalizado])
        fecha_encuentro = datetime.now(timezone.utc) + timedelta(days=random.randint(1, 7))
        hora_encuentro = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0) + timedelta(hours=random.randint(1, 12))
        lugar = f"El Matorral"

        # 👇 Crear solicitud asociada
        nueva_solicitud = Solicitud(
            estudianteSolicitante=estudiante1.idEstudiante,
            libroSolicitado=libro2.idLibro,
            estado="Aceptada",
            fechaSolicitud=datetime.now(timezone.utc)
        )
        session.add(nueva_solicitud)
        session.flush()  # 👈 Importante para obtener el id generado
        id_solicitud = nueva_solicitud.idSolicitud

        intercambio = Intercambio(
            idSolicitud=id_solicitud,
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

        # Cambiar estados de libros según el estado del intercambio
        if estado == EstadoIntercambioEnum.en_proceso:
            libro1.estado = EstadoLibroEnum.enIntercambio
            libro2.estado = EstadoLibroEnum.enIntercambio
        elif estado == EstadoIntercambioEnum.finalizado:
            libro1.estado = EstadoLibroEnum.intercambiado
            libro2.estado = EstadoLibroEnum.intercambiado

        session.add(intercambio)
        usados.update([libro1.idLibro, libro2.idLibro])
        intercambios_creados += 1

    session.commit()
    session.close()
    print(f"{intercambios_creados} intercambios creados exitosamente.")
