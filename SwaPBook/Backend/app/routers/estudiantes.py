from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.estudiantes import Estudiante
from app.schemas.estudiantes import EstudianteCreate, EstudianteResponse

router = APIRouter(prefix="/estudiantes", tags=["Estudiantes"])

@router.post("/registro", response_model=EstudianteResponse, status_code=201)
def registrar_estudiante(estudiante: EstudianteCreate, db: Session = Depends(get_db)):
    db_estudiante = db.query(Estudiante).filter(Estudiante.correoInstitucional == estudiante.correoInstitucional).first()
    print("Datos recibidos del frontend", estudiante.dict())
    if db_estudiante:
        raise HTTPException(status_code=400, detail="Correo institucional ya registrado")
    nuevo_estudiante = Estudiante(**estudiante.dict())
    db.add(nuevo_estudiante)
    db.commit()
    db.refresh(nuevo_estudiante)
    return nuevo_estudiante