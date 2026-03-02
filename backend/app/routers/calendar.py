from typing import Optional, Union

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from ..auth.dependencies import get_current_user
from ..models import User
from ..services.calendar_service import CalendarService

router = APIRouter(prefix="/calendar", tags=["Calendar"])


class WorkoutCalendarEventRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = ""
    start_datetime: str
    end_datetime: str
    timezone: str = "UTC"
    access_token: str = Field(..., min_length=20)


class WorkoutCalendarEventResponse(BaseModel):
    status: str
    event_id: Optional[str] = None
    html_link: Optional[str] = None
    summary: Optional[str] = None
    start: Optional[dict] = None
    end: Optional[dict] = None
    message: Optional[str] = None
    details: Optional[Union[dict, str]] = None


@router.get("/")
def calendar_home():
    return {
        "message": "Calendar module ready",
        "configured": CalendarService.is_configured(),
    }


@router.post("/workout-event", response_model=WorkoutCalendarEventResponse)
def create_workout_calendar_event(
    req: WorkoutCalendarEventRequest,
    current_user: User = Depends(get_current_user),
):
    event = CalendarService.create_workout_event(
        title=req.title,
        description=req.description or f"Workout session for {current_user.name}",
        start_datetime=req.start_datetime,
        end_datetime=req.end_datetime,
        access_token=req.access_token,
        timezone=req.timezone,
    )
    if not event:
        raise HTTPException(status_code=502, detail="Calendar service unavailable")
    if event.get("status") == "error":
        message = str(event.get("message", "Calendar sync failed"))
        status_code = 502 if "connection failed" in message.lower() else 400
        raise HTTPException(status_code=status_code, detail=event)
    return event
