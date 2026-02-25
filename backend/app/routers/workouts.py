from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import WorkoutPlan, User
from ..schemas import WorkoutCreate, WorkoutResponse
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/workouts", tags=["Workouts"])


# ✅ Create workout
@router.post("/", response_model=WorkoutResponse)
def create_workout(
    workout: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_workout = WorkoutPlan(
        title=workout.title,
        description=workout.description,
        owner_id=current_user.id
    )

    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    return new_workout


# ✅ Get all workouts of logged user
@router.get("/", response_model=list[WorkoutResponse])
def get_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(WorkoutPlan).filter(
        WorkoutPlan.owner_id == current_user.id
    ).all()


# ✅ Get single workout
@router.get("/{workout_id}", response_model=WorkoutResponse)
def get_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_id,
        WorkoutPlan.owner_id == current_user.id
    ).first()