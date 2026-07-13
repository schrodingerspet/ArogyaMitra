from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User
from ..auth.dependencies import get_current_user
from ..services.tracking_service import TrackingService
from ..schemas import (
    MedicationsDataResponse,
    NotificationResponse,
    SymptomLogResponse,
    VaccinationResponse
)

router = APIRouter(prefix="/tracking", tags=["Tracking"])

@router.get("/medications", response_model=MedicationsDataResponse)
def get_medications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return TrackingService.get_medications_data(current_user.id, db)

@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return TrackingService.get_notifications(current_user.id, db)

@router.get("/symptoms", response_model=List[SymptomLogResponse])
def get_symptoms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return TrackingService.get_symptoms(current_user.id, db)

@router.get("/vaccinations", response_model=List[VaccinationResponse])
def get_vaccinations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return TrackingService.get_vaccinations(current_user.id, db)
