from fastapi import APIRouter

router = APIRouter(prefix="/nutrition", tags=["Nutrition"])

@router.get("/")
def nutrition_home():
    return {"message": "Nutrition module ready"}