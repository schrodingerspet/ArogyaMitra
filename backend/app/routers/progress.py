from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import ProgressRecord, User
from ..schemas import ProgressRecordCreate, ProgressRecordResponse
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.post("/", response_model=ProgressRecordResponse)
def create_progress(
    data: ProgressRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(ProgressRecord).filter(
        ProgressRecord.owner_id == current_user.id, ProgressRecord.date == data.date
    ).first()
    if existing:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    record = ProgressRecord(owner_id=current_user.id, **data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/", response_model=List[ProgressRecordResponse])
def get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(ProgressRecord)
        .filter(ProgressRecord.owner_id == current_user.id)
        .order_by(ProgressRecord.date.desc())
        .all()
    )


@router.get("/{record_id}", response_model=ProgressRecordResponse)
def get_progress_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(ProgressRecord).filter(
        ProgressRecord.id == record_id, ProgressRecord.owner_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(404, "Progress record not found")
    return record


@router.delete("/{record_id}")
def delete_progress(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(ProgressRecord).filter(
        ProgressRecord.id == record_id, ProgressRecord.owner_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(404, "Progress record not found")
    db.delete(record)
    db.commit()
    return {"message": "Progress record deleted"}
