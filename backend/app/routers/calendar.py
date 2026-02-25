from fastapi import APIRouter

router = APIRouter(prefix="/calendar", tags=["Calendar"])

@router.get("/")
def calendar_home():
    return {"message": "Calendar module ready"}