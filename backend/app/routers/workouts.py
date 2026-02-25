from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import WorkoutPlan, Exercise, User
from ..schemas import (
    WorkoutCreate, WorkoutResponse, WorkoutListResponse,
    ExerciseCreate, ExerciseResponse,
)
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/workouts", tags=["Workouts"])


@router.post("/", response_model=WorkoutResponse)
def create_workout(
    workout: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_workout = WorkoutPlan(owner_id=current_user.id, **workout.model_dump())
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)
    return new_workout


@router.get("/", response_model=List[WorkoutListResponse])
def get_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(WorkoutPlan).filter(WorkoutPlan.owner_id == current_user.id).all()


@router.get("/{workout_id}", response_model=WorkoutResponse)
def get_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_id, WorkoutPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Workout plan not found")
    return plan


@router.delete("/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_id, WorkoutPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Workout plan not found")
    db.delete(plan)
    db.commit()
    return {"message": "Workout plan deleted"}


# ── Exercises within a workout plan ──

@router.post("/{workout_id}/exercises", response_model=ExerciseResponse)
def add_exercise(
    workout_id: int,
    exercise: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_id, WorkoutPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Workout plan not found")
    new_ex = Exercise(workout_plan_id=workout_id, **exercise.model_dump())
    db.add(new_ex)
    db.commit()
    db.refresh(new_ex)
    return new_ex


@router.get("/{workout_id}/exercises", response_model=List[ExerciseResponse])
def get_exercises(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_id, WorkoutPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Workout plan not found")
    return db.query(Exercise).filter(Exercise.workout_plan_id == workout_id).order_by(Exercise.day_number, Exercise.order).all()


@router.delete("/{workout_id}/exercises/{exercise_id}")
def delete_exercise(
    workout_id: int,
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_id, WorkoutPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Workout plan not found")
    ex = db.query(Exercise).filter(Exercise.id == exercise_id, Exercise.workout_plan_id == workout_id).first()
    if not ex:
        raise HTTPException(404, "Exercise not found")
    db.delete(ex)
    db.commit()
    return {"message": "Exercise deleted"}