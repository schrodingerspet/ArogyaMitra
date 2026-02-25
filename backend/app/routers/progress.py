from fastapi import APIRouter

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("/")
def progress_home():
    return {"message": "Progress module ready"}