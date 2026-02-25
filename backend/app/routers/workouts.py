from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from ..database import get_db
from ..models import WorkoutPlan, Exercise, User
from ..schemas import (
    WorkoutCreate, WorkoutResponse, WorkoutListResponse,
    ExerciseCreate, ExerciseResponse,
)
from ..auth.dependencies import get_current_user
from ..services.workout_service import WorkoutService
from ..services.groq_service import GroqService

router = APIRouter(prefix="/workouts", tags=["Workouts"])


class GenerateWorkoutRequest(BaseModel):
    fitness_goal: str = "weight_loss"
    workout_location: str = "home"
    duration_days: int = 7
    daily_minutes: int = 30
    difficulty_level: str = "intermediate"
    use_ai: bool = False


@router.post("/generate")
def generate_workout(
    req: GenerateWorkoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate a personalised workout plan and save it to the database."""
    # Try AI generation first if requested
    if req.use_ai:
        profile = {
            "age": current_user.age, "gender": current_user.gender,
            "weight_kg": current_user.weight_kg or 70,
            "height_cm": current_user.height_cm or 170,
            "fitness_level": req.difficulty_level,
            "goals": req.fitness_goal,
            "workout_location": req.workout_location,
            "daily_minutes": req.daily_minutes,
            "medical_conditions": current_user.medical_conditions or "none",
        }
        ai_result = GroqService.generate_workout_plan_ai(profile)
        if ai_result:
            return {"source": "ai", "plan": ai_result}

    # Template-based generation
    plan_data = WorkoutService.generate_plan(
        fitness_goal=req.fitness_goal,
        workout_location=req.workout_location,
        duration_days=req.duration_days,
        daily_minutes=req.daily_minutes,
        difficulty_level=req.difficulty_level,
        weight_kg=current_user.weight_kg or 70,
    )

    # Save to database
    new_plan = WorkoutPlan(
        owner_id=current_user.id,
        title=f"{req.fitness_goal.replace('_', ' ').title()} — {req.duration_days}-Day Plan",
        description=f"Auto-generated {req.workout_location} workout plan",
        fitness_goal=req.fitness_goal,
        workout_location=req.workout_location,
        duration_days=req.duration_days,
        daily_minutes=req.daily_minutes,
        difficulty_level=req.difficulty_level,
    )
    db.add(new_plan)
    db.flush()

    for day in plan_data["days"]:
        for ex in day["exercises"]:
            db.add(Exercise(
                workout_plan_id=new_plan.id,
                day_number=day["day_number"],
                name=ex["name"],
                category=ex.get("category"),
                sets=ex.get("sets"),
                reps=ex.get("reps"),
                duration_seconds=ex.get("duration_seconds"),
                rest_seconds=ex.get("rest_seconds"),
                instructions=ex.get("instructions"),
                order=ex.get("order", 0),
            ))
    db.commit()
    db.refresh(new_plan)

    return {"source": "template", "plan_id": new_plan.id, "summary": plan_data}


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