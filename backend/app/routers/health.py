from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import HealthAssessment, User
from ..schemas import HealthAssessmentCreate, HealthAssessmentResponse
from ..auth.dependencies import get_current_user
from ..services.health_service import HealthService

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/insights")
def get_health_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get calculated health metrics from the latest assessment."""
    assessment = (
        db.query(HealthAssessment)
        .filter(HealthAssessment.owner_id == current_user.id)
        .order_by(HealthAssessment.created_at.desc())
        .first()
    )
    if not assessment:
        raise HTTPException(404, "No health assessment found. Create one first.")
    return HealthService.get_health_insights(assessment)

@router.post("/assessment", response_model=HealthAssessmentResponse)
def create_assessment(
    data: HealthAssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bmi = round(data.weight_kg / ((data.height_cm / 100) ** 2), 2) if data.height_cm else None
    assessment = HealthAssessment(owner_id=current_user.id, bmi=bmi, **data.model_dump())
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


@router.get("/assessments", response_model=List[HealthAssessmentResponse])
def get_assessments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(HealthAssessment)
        .filter(HealthAssessment.owner_id == current_user.id)
        .order_by(HealthAssessment.created_at.desc())
        .all()
    )


@router.get("/assessment/{assessment_id}", response_model=HealthAssessmentResponse)
def get_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(HealthAssessment).filter(
        HealthAssessment.id == assessment_id, HealthAssessment.owner_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(404, "Health assessment not found")
    return record


@router.get("/assessment/latest", response_model=HealthAssessmentResponse)
def get_latest_assessment(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(HealthAssessment)
        .filter(HealthAssessment.owner_id == current_user.id)
        .order_by(HealthAssessment.created_at.desc())
        .first()
    )
    if not record:
        raise HTTPException(404, "No health assessment found")
    return record


@router.delete("/assessment/{assessment_id}")
def delete_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(HealthAssessment).filter(
        HealthAssessment.id == assessment_id, HealthAssessment.owner_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(404, "Health assessment not found")
    db.delete(record)
    db.commit()
    return {"message": "Health assessment deleted"}