from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User
from ..auth.dependencies import get_current_user
from ..services.appointment_service import AppointmentService
from ..schemas import (
    TimeSlotResponse, 
    RecommendationResponse, 
    ReminderResponse, 
    WaitingListEntryResponse
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("/slots/{doctor_id}", response_model=List[TimeSlotResponse])
def get_slots(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AppointmentService.get_available_slots(doctor_id, db)

@router.get("/recommendations", response_model=List[RecommendationResponse])
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AppointmentService.get_recommendations(current_user.id, db)

@router.get("/reminders", response_model=List[ReminderResponse])
def get_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AppointmentService.get_reminders(current_user.id, db)

@router.get("/waiting-list", response_model=List[WaitingListEntryResponse])
def get_waiting_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AppointmentService.get_waiting_list(db)
