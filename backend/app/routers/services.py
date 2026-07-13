from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ..database import get_db
from .. import models, schemas
from ..auth.dependencies import get_current_user

router = APIRouter(
    prefix="/services",
    tags=["Services"]
)

@router.get("/hospitals", response_model=List[schemas.HospitalResponse])
def get_hospitals(
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Hospital)
    if type and type.lower() != "all":
        query = query.filter(models.Hospital.facility_type.ilike(f"%{type}%"))
    return query.all()


@router.get("/labs", response_model=List[schemas.LabTestBookingResponse])
def get_lab_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.LabTestBooking).filter(models.LabTestBooking.owner_id == current_user.id).all()


@router.post("/labs", response_model=schemas.LabTestBookingResponse, status_code=status.HTTP_201_CREATED)
def book_lab_test(
    booking: schemas.LabTestBookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_booking = models.LabTestBooking(
        owner_id=current_user.id,
        test_name=booking.test_name,
        lab_name=booking.lab_name,
        booking_date=booking.booking_date,
        status="Scheduled"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking
