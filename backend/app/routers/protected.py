from fastapi import APIRouter, Depends
from ..auth.dependencies import get_current_user
from ..models import User

router = APIRouter(prefix="/protected", tags=["Protected"])


@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return {
        "message": "Access granted",
        "user": current_user.email
    }