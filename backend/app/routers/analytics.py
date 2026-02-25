from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..services.analytics_service import AnalyticsService
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AnalyticsService.get_summary(current_user.id, db)


@router.get("/weekly")
def get_weekly(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AnalyticsService.get_weekly_summary(current_user.id, db)


@router.get("/weight-trend")
def get_weight_trend(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AnalyticsService.get_weight_trend(current_user.id, db)


@router.get("/streak")
def get_streak(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AnalyticsService.get_workout_streak(current_user.id, db)
