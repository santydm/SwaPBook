import os
import sys
import random
from datetime import datetime, timezone

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

        # Generar fechas y horas aleatorias entre hoy y 30 días en el futuro
        fecha_encuentro = fake.date_time_between(start_date="now", end_date="+30d", tzinfo=timezone.utc)
        hora_encuentro = fake.date_time_between(start_date="now", end_date="+30d", tzinfo=timezone.utc)

        nueva_solicitud = Solicitud(
            estudianteSolicitante=solicitante.idEstudiante,
            estudiantePropietario=propietario.idEstudiante,
            libroSolicitado=libro_solicitado.idLibro,
            libroOfrecido=libro_ofrecido.idLibro,
            fechaSolicitud=datetime.now(timezone.utc),
            fechaEncuentro=fecha_encuentro,
            horaEncuentro=hora_encuentro,
            lugarEncuentro="El Matorral",
            estado=EstadoSolicitudEnum.pendiente,
        )

        session.add(nueva_solicitud)

    session.commit()
    print("✅ Se crearon 15 solicitudes con estado 'Pendiente', fechas y horas aleatorias, y lugar fijo 'El Matorral'.")
except Exception as e:
    session.rollback()
    print("❌ Error al crear solicitudes:", e)
finally:
    session.close()
