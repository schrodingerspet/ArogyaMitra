from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User
from ..auth.dependencies import get_current_user
from ..services.records_service import RecordsService
from ..schemas import MedicalDocumentResponse, TimelineEventResponse

router = APIRouter(prefix="/records", tags=["Records"])

@router.get("/documents", response_model=List[MedicalDocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return RecordsService.get_documents(current_user.id, db)


@router.get("/timeline", response_model=List[TimelineEventResponse])
def get_timeline(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return RecordsService.get_timeline_events(current_user.id, db)
