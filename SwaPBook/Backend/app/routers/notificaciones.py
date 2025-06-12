from fastapi import WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.estudiantes import Estudiante
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from enum import Enum
from datetime import datetime
import os
from fastapi import APIRouter


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(prefix="/notificaciones", tags=["notificaciones"])

class NotificationType(str, Enum):
    NUEVO_INTERCAMBIO = "nuevo_intercambio"
    ESTADO_CAMBIO = "estado_cambio"
    MENSAJE = "mensaje"
    SISTEMA = "sistema"

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

async def get_current_user_ws(
    websocket: WebSocket,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValueError):
        raise credentials_exception
    
    user = db.query(Estudiante).get(user_id)
    if user is None:
        raise credentials_exception
    return user

async def send_notification(notification_type: NotificationType, data: dict):
    message = {
        "type": notification_type.value,
        "data": data,
        "timestamp": datetime.now().isoformat()
    }
    await manager.broadcast(message)

async def websocket_endpoint(
    websocket: WebSocket,
    user: Estudiante = Depends(get_current_user_ws),
    db: Session = Depends(get_db)
):
    await manager.connect(websocket)
    try:
        # Notificar conexión exitosa
        await manager.send_personal_message({
            "type": NotificationType.SISTEMA,
            "data": {
                "message": f"Conectado como {user.nombre}",
                "user_id": user.idEstudiante
            }
        }, websocket)
        
        while True:
            # Mantener conexión abierta
            await websocket.receive_text()
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({
            "type": NotificationType.SISTEMA,
            "data": {
                "message": f"Usuario {user.nombre} desconectado",
                "user_id": user.idEstudiante
            }
        })

@router.websocket("/ws")
async def websocket_handler(
    websocket: WebSocket,
    user: Estudiante = Depends(get_current_user_ws),
    db: Session = Depends(get_db)
):
    await websocket_endpoint(websocket, user, db)
