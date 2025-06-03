from fastapi import APIRouter, Depends
from .dependencies import admin_required

router = APIRouter(
    prefix="/admin",
    tags = ["admin"],
    dependencies=[Depends(admin_required)]
)

@router.get("/stats")
def get_dashboard_data():
    return {
        "message": "Dashboard del admin autorizado",
    }

    