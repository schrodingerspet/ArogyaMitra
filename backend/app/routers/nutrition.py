from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import json
import re

from ..database import get_db
from ..models import NutritionPlan, Meal, User
from ..schemas import (
    NutritionPlanCreate, NutritionPlanResponse, NutritionPlanListResponse,
    MealCreate, MealResponse,
)
from ..auth.dependencies import get_current_user
from ..services.nutrition_service import NutritionService
from ..services.health_service import HealthService
from ..services.groq_service import GroqService

router = APIRouter(prefix="/nutrition", tags=["Nutrition"])


class GenerateNutritionRequest(BaseModel):
    calorie_target: Optional[int] = None
    diet_type: str = "vegetarian"
    allergies: Optional[str] = None
    cuisine_preference: str = "indian"
    duration_days: int = 7
    use_ai: bool = False


@router.post("/generate")
def generate_nutrition_plan(
    req: GenerateNutritionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate a personalised nutrition/meal plan and save it to the database."""
    # Auto-calculate calorie target from user profile if not provided
    calorie_target = req.calorie_target
    if not calorie_target and current_user.weight_kg and current_user.height_cm and current_user.age:
        bmr = HealthService.calculate_bmr(
            current_user.weight_kg, current_user.height_cm,
            current_user.age, current_user.gender,
        )
        tdee = HealthService.calculate_tdee(bmr, current_user.activity_level)
        calorie_target = HealthService.calorie_target_for_goal(tdee, current_user.goals)
    calorie_target = calorie_target or 2000

    if req.use_ai:
        profile = {
            "calorie_target": calorie_target,
            "diet_type": req.diet_type,
            "allergies": req.allergies or current_user.allergies or "none",
            "cuisine_preference": req.cuisine_preference,
            "goals": current_user.goals or "maintenance",
        }
        ai_result = GroqService.generate_nutrition_plan_ai(profile)
        if ai_result:
            try:
                cleaned = re.sub(r"```(?:json)?\s*", "", ai_result).strip().rstrip("`")
                plan_data = json.loads(cleaned)
            except (json.JSONDecodeError, ValueError):
                plan_data = None

            if plan_data and "days" in plan_data:
                new_plan = NutritionPlan(
                    owner_id=current_user.id,
                    title=f"{req.diet_type.title()} AI Meal Plan — {calorie_target} kcal",
                    calorie_target=calorie_target,
                    diet_type=req.diet_type,
                    allergies=req.allergies,
                    cuisine_preference=req.cuisine_preference,
                    duration_days=req.duration_days,
                )
                db.add(new_plan)
                db.flush()

                for day in plan_data["days"]:
                    day_num = day.get("day_number", 1)
                    for meal in day.get("meals", []):
                        ingredients = meal.get("ingredients")
                        if isinstance(ingredients, list):
                            ingredients = ", ".join(str(i) for i in ingredients)
                        recipe = meal.get("recipe")
                        if isinstance(recipe, list):
                            recipe = "; ".join(str(r) for r in recipe)
                        db.add(Meal(
                            nutrition_plan_id=new_plan.id,
                            day_number=day_num,
                            meal_type=meal.get("meal_type", "snack"),
                            name=meal.get("name", "Meal"),
                            calories=int(meal["calories"]) if meal.get("calories") else None,
                            protein_g=float(meal["protein_g"]) if meal.get("protein_g") else None,
                            carbs_g=float(meal["carbs_g"]) if meal.get("carbs_g") else None,
                            fat_g=float(meal["fat_g"]) if meal.get("fat_g") else None,
                            fiber_g=float(meal["fiber_g"]) if meal.get("fiber_g") else None,
                            recipe=recipe,
                            ingredients=ingredients,
                        ))
                db.commit()
                db.refresh(new_plan)
                return {"source": "ai", "plan_id": new_plan.id, "summary": plan_data}

    plan_data = NutritionService.generate_meal_plan(
        calorie_target=calorie_target,
        diet_type=req.diet_type,
        allergies=req.allergies or current_user.allergies,
        cuisine_preference=req.cuisine_preference,
        duration_days=req.duration_days,
        goal=current_user.goals or "maintenance",
    )

    new_plan = NutritionPlan(
        owner_id=current_user.id,
        title=f"{req.diet_type.title()} Meal Plan — {calorie_target} kcal",
        calorie_target=calorie_target,
        diet_type=req.diet_type,
        allergies=req.allergies,
        cuisine_preference=req.cuisine_preference,
        duration_days=req.duration_days,
    )
    db.add(new_plan)
    db.flush()

    for day in plan_data["days"]:
        for meal in day["meals"]:
            db.add(Meal(
                nutrition_plan_id=new_plan.id,
                day_number=meal["day_number"],
                meal_type=meal["meal_type"],
                name=meal["name"],
                calories=meal.get("calories"),
                protein_g=meal.get("protein_g"),
                carbs_g=meal.get("carbs_g"),
                fat_g=meal.get("fat_g"),
                fiber_g=meal.get("fiber_g"),
                recipe=meal.get("recipe"),
                ingredients=meal.get("ingredients"),
            ))
    db.commit()
    db.refresh(new_plan)

    return {"source": "template", "plan_id": new_plan.id, "summary": plan_data}


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