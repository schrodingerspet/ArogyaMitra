from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

from ..config import SECRET_KEY, ALGORITHM
from ..database import get_db
from ..models import User
from sqlalchemy.orm import Session


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

def get_target_user(
    patient_id: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    RBAC Logic: If patient_id is not provided, return the current user.
    If provided, check if it's the current user, or if current user is the caregiver.
    """
    if patient_id is None or patient_id == current_user.id:
        return current_user
        
    target = db.query(User).filter(User.id == patient_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    if target.caregiver_email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized to access this patient's data")
        
    return target