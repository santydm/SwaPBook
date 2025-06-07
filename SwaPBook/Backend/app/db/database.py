from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Paso 1: imprimir ruta donde busca el .env
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
print("Buscando archivo .env en:", dotenv_path)

# Paso 2: verificar que el archivo exista
if not os.path.exists(dotenv_path):
    raise FileNotFoundError(f"No se encontró el archivo .env en: {dotenv_path}")

# Paso 3: cargar el archivo
load_dotenv(dotenv_path)

# Paso 4: verificar que se haya cargado la variable
DATABASE_URL = os.getenv("DATABASE_URL")
print("Valor de DATABASE_URL:", DATABASE_URL)

if DATABASE_URL is None:
    raise ValueError("DATABASE_URL no está definida. Verifica tu archivo .env")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()