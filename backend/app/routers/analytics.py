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


@router.get("/health-metrics")
def get_health_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AnalyticsService.get_health_metrics(current_user.id, db)


@router.get("/insights")
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AnalyticsService.get_insights(current_user.id, db)


@router.get("/reports")
def get_reports(
    base_date: str,
    recent_date: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from datetime import datetime
    b_date = datetime.strptime(base_date, "%Y-%m-%d").date()
    r_date = datetime.strptime(recent_date, "%Y-%m-%d").date()
    return AnalyticsService.get_report_comparison(current_user.id, b_date, r_date, db)
