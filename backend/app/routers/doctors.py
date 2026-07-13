from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import func

from ..database import get_db
from .. import models, schemas
from ..auth.dependencies import get_current_user

router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)

@router.get("", response_model=List[schemas.DoctorResponse])
def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(models.Doctor).all()
    # Calculate stats for each
    results = []
    for doc in doctors:
        stats = db.query(
            func.avg(models.ConsultationFeedback.rating).label('average'),
            func.count(models.ConsultationFeedback.id).label('count')
        ).filter(models.ConsultationFeedback.doctor_id == doc.id).first()
        
        # doc.is_verified is integer in SQLite, convert to bool for schema
        results.append({
            "id": doc.id,
            "name": doc.name,
            "specialty": doc.specialty,
            "is_verified": bool(doc.is_verified),
            "average_rating": round(stats.average, 1) if stats.average else 0.0,
            "review_count": stats.count or 0,
            "feedbacks": []
        })
    return results

@router.get("/{doctor_id}", response_model=schemas.DoctorResponse)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
        
    stats = db.query(
        func.avg(models.ConsultationFeedback.rating).label('average'),
        func.count(models.ConsultationFeedback.id).label('count')
    ).filter(models.ConsultationFeedback.doctor_id == doc.id).first()
    
    feedbacks = db.query(models.ConsultationFeedback).filter(models.ConsultationFeedback.doctor_id == doc.id).order_by(models.ConsultationFeedback.created_at.desc()).all()
    
    return {
        "id": doc.id,
        "name": doc.name,
        "specialty": doc.specialty,
        "is_verified": bool(doc.is_verified),
        "average_rating": round(stats.average, 1) if stats.average else 0.0,
        "review_count": stats.count or 0,
        "feedbacks": feedbacks
    }

@router.post("/{doctor_id}/feedbacks", response_model=schemas.ConsultationFeedbackResponse)
def submit_feedback(
    doctor_id: int,
    feedback: schemas.ConsultationFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    doc = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
        
    new_feedback = models.ConsultationFeedback(
        doctor_id=doc.id,
        patient_id=current_user.id,
        rating=feedback.rating,
        comment=feedback.comment
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback
