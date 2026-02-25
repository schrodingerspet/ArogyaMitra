from fastapi import APIRouter

router = APIRouter(prefix="/heath", tags=["Health"])

@router.get("/")
def health_home():
    return {"message": "Health module ready"}