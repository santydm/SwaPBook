from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if DATABASE_URL is None:
    raise ValueError("DATABASE_URL no está definida. Verifica tu archivo .env")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()