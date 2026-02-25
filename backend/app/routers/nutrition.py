from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import NutritionPlan, Meal, User
from ..schemas import (
    NutritionPlanCreate, NutritionPlanResponse, NutritionPlanListResponse,
    MealCreate, MealResponse,
)
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/nutrition", tags=["Nutrition"])


@router.post("/", response_model=NutritionPlanResponse)
def create_nutrition_plan(
    plan: NutritionPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_plan = NutritionPlan(owner_id=current_user.id, **plan.model_dump())
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan


@router.get("/", response_model=List[NutritionPlanListResponse])
def get_nutrition_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(NutritionPlan).filter(NutritionPlan.owner_id == current_user.id).all()


@router.get("/{plan_id}", response_model=NutritionPlanResponse)
def get_nutrition_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == plan_id, NutritionPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Nutrition plan not found")
    return plan


@router.delete("/{plan_id}")
def delete_nutrition_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == plan_id, NutritionPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Nutrition plan not found")
    db.delete(plan)
    db.commit()
    return {"message": "Nutrition plan deleted"}


# ── Meals within a nutrition plan ──

@router.post("/{plan_id}/meals", response_model=MealResponse)
def add_meal(
    plan_id: int,
    meal: MealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == plan_id, NutritionPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Nutrition plan not found")
    new_meal = Meal(nutrition_plan_id=plan_id, **meal.model_dump())
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)
    return new_meal


@router.get("/{plan_id}/meals", response_model=List[MealResponse])
def get_meals(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == plan_id, NutritionPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Nutrition plan not found")
    return db.query(Meal).filter(Meal.nutrition_plan_id == plan_id).order_by(Meal.day_number, Meal.meal_type).all()


@router.delete("/{plan_id}/meals/{meal_id}")
def delete_meal(
    plan_id: int,
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == plan_id, NutritionPlan.owner_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(404, "Nutrition plan not found")
    meal = db.query(Meal).filter(Meal.id == meal_id, Meal.nutrition_plan_id == plan_id).first()
    if not meal:
        raise HTTPException(404, "Meal not found")
    db.delete(meal)
    db.commit()
    return {"message": "Meal deleted"}