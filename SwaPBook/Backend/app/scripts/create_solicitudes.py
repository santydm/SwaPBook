import os
import sys
import random
from datetime import datetime, timezone, time

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
from faker import Faker

# Importar modelos
from app.models.solicitudes import Solicitud, EstadoSolicitudEnum
from app.models.estudiantes import Estudiante
from app.models.libros import Libro

# Cargar variables de entorno (.env)
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(backend_dir, '.env')
print("Buscando archivo .env en:", env_path)
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
print("Valor de DATABASE_URL:", DATABASE_URL)

# Conexión a la base de datos
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()

fake = Faker()

try:
    estudiantes = session.query(Estudiante).all()
    libros = session.query(Libro).all()

    if len(estudiantes) < 2 or len(libros) < 2:
        print("Se necesitan al menos 2 estudiantes y 2 libros para generar solicitudes.")
        sys.exit()

    for _ in range(15):
        solicitante, propietario = random.sample(estudiantes, 2)
        libro_solicitado = random.choice(libros)
        libro_ofrecido = random.choice(libros)

        # Fecha del encuentro (sin hora) entre hoy y +30 días
        fecha_encuentro = fake.date_between(start_date="today", end_date="+30d")

        # Hora entre 06:00 y 23:00, en bloques de 15 minutos
        hora_random = random.randint(6, 22)  # hasta 22 porque podrías tener 22:45
        minuto_random = random.choice([0, 15, 30, 45])
        hora_encuentro = datetime.combine(
            fecha_encuentro,
            time(hora_random, minuto_random),
            tzinfo=timezone.utc
        )

        nueva_solicitud = Solicitud(
            estudianteSolicitante=solicitante.idEstudiante,
            estudiantePropietario=propietario.idEstudiante,
            libroSolicitado=libro_solicitado.idLibro,
            libroOfrecido=libro_ofrecido.idLibro,
            fechaSolicitud=datetime.now(timezone.utc),
            fechaEncuentro=hora_encuentro.date(),
            horaEncuentro=hora_encuentro,
            lugarEncuentro="El Matorral",
            estado=EstadoSolicitudEnum.pendiente,
        )

        session.add(nueva_solicitud)

    session.commit()
    print("✅ Se crearon 15 solicitudes con horas entre 06:00 y 23:00, y lugar fijo 'El Matorral'.")
except Exception as e:
    session.rollback()
    print("❌ Error al crear solicitudes:", e)
finally:
    session.close()