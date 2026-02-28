from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
import re

from ..database import get_db
from ..models import ChatSession, ChatMessage, User, WorkoutPlan, Exercise, NutritionPlan, Meal
from ..schemas import (
    ChatSessionCreate, ChatSessionResponse, ChatSessionListResponse,
    ChatMessageCreate, ChatMessageResponse,
)
from ..auth.dependencies import get_current_user
from ..services.groq_service import GroqService

router = APIRouter(prefix="/chat", tags=["Chat / AROMI"])


@router.post("/sessions", response_model=ChatSessionResponse)
def create_session(
    data: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ChatSession(owner_id=current_user.id, title=data.title or "New Chat")
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions", response_model=List[ChatSessionListResponse])
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(ChatSession)
        .filter(ChatSession.owner_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
        .all()
    )


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = db.query(ChatSession).filter(
        ChatSession.id == session_id, ChatSession.owner_id == current_user.id
    ).first()
    if not sess:
        raise HTTPException(404, "Chat session not found")
    return sess


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
def add_message(
    session_id: int,
    data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = db.query(ChatSession).filter(
        ChatSession.id == session_id, ChatSession.owner_id == current_user.id
    ).first()
    if not sess:
        raise HTTPException(404, "Chat session not found")

    user_msg = ChatMessage(session_id=session_id, role="user", content=data.content)
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # Build chat history and user profile for AROMI
    history = [
        {"role": m.role, "content": m.content}
        for m in db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at)
        .all()
    ]
    user_profile = {
        "age": current_user.age, "gender": current_user.gender,
        "weight_kg": current_user.weight_kg, "height_cm": current_user.height_cm,
        "fitness_level": current_user.fitness_level, "goals": current_user.goals,
    }

    ai_response = GroqService.chat_with_aromi(data.content, history, user_profile)

    ai_msg = ChatMessage(session_id=session_id, role="assistant", content=ai_response)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg


@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageResponse])
def get_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = db.query(ChatSession).filter(
        ChatSession.id == session_id, ChatSession.owner_id == current_user.id
    ).first()
    if not sess:
        raise HTTPException(404, "Chat session not found")
    return db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at).all()


@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = db.query(ChatSession).filter(
        ChatSession.id == session_id, ChatSession.owner_id == current_user.id
    ).first()
    if not sess:
        raise HTTPException(404, "Chat session not found")
    db.delete(sess)
    db.commit()
    return {"message": "Chat session deleted"}


def _parse_json(raw: str) -> dict:
    """Extract JSON from a string that may contain markdown fences."""
    cleaned = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("`")
    return json.loads(cleaned)


from pydantic import BaseModel as _BM

class ApplyActionRequest(_BM):
    action_type: str  # "workout", "nutrition", "profile"


@router.post("/sessions/{session_id}/apply-action")
def apply_action(
    session_id: int,
    req: ApplyActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Extract structured data from chat and save as workout plan, nutrition plan, or profile update."""
    sess = db.query(ChatSession).filter(
        ChatSession.id == session_id, ChatSession.owner_id == current_user.id
    ).first()
    if not sess:
        raise HTTPException(404, "Chat session not found")

    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at).all()

    if not messages:
        raise HTTPException(400, "No messages in this session")

    history = [{"role": m.role, "content": m.content} for m in messages]
    user_profile = {
        "age": current_user.age, "gender": current_user.gender,
        "weight_kg": current_user.weight_kg, "height_cm": current_user.height_cm,
        "fitness_level": current_user.fitness_level, "goals": current_user.goals,
    }

    raw = GroqService.extract_plan_from_chat(history, req.action_type, user_profile)
    if not raw:
        raise HTTPException(500, "Could not extract data from conversation")

    try:
        data = _parse_json(raw)
    except (json.JSONDecodeError, ValueError):
        raise HTTPException(500, "AI returned invalid data format")

    # ── Save Workout Plan ──
    if req.action_type == "workout":
        plan = WorkoutPlan(
            owner_id=current_user.id,
            title=data.get("title", "AROMI Workout Plan"),
            description=data.get("description", "Generated from AROMI chat"),
            fitness_goal=data.get("fitness_goal"),
            workout_location=data.get("workout_location", "home"),
            duration_days=data.get("duration_days", 7),
            daily_minutes=data.get("daily_minutes", 30),
            difficulty_level=data.get("difficulty_level", "intermediate"),
        )
        db.add(plan)
        db.flush()

        for day in data.get("days", []):
            day_num = day.get("day_number", 1)
            for idx, ex in enumerate(day.get("exercises", [])):
                db.add(Exercise(
                    workout_plan_id=plan.id,
                    day_number=day_num,
                    name=ex.get("name", "Exercise"),
                    category=ex.get("category"),
                    sets=ex.get("sets"),
                    reps=ex.get("reps"),
                    duration_seconds=ex.get("duration_seconds"),
                    rest_seconds=ex.get("rest_seconds"),
                    instructions=ex.get("instructions"),
                    order=ex.get("order", idx + 1),
                ))
        db.commit()
        db.refresh(plan)

        # Add confirmation message to chat
        confirm = ChatMessage(
            session_id=session_id, role="assistant",
            content=f"✅ Workout plan \"{plan.title}\" has been saved! You can view it in your Workouts section."
        )
        db.add(confirm)
        db.commit()

        return {"action": "workout", "plan_id": plan.id, "title": plan.title}

    # ── Save Nutrition Plan ──
    elif req.action_type == "nutrition":
        plan = NutritionPlan(
            owner_id=current_user.id,
            title=data.get("title", "AROMI Meal Plan"),
            calorie_target=data.get("calorie_target"),
            diet_type=data.get("diet_type"),
            allergies=data.get("allergies"),
            cuisine_preference=data.get("cuisine_preference", "indian"),
            duration_days=data.get("duration_days", 7),
        )
        db.add(plan)
        db.flush()

        for day in data.get("days", []):
            day_num = day.get("day_number", 1)
            for meal in day.get("meals", []):
                db.add(Meal(
                    nutrition_plan_id=plan.id,
                    day_number=day_num,
                    meal_type=meal.get("meal_type", "snack"),
                    name=meal.get("name", "Meal"),
                    calories=meal.get("calories"),
                    protein_g=meal.get("protein_g"),
                    carbs_g=meal.get("carbs_g"),
                    fat_g=meal.get("fat_g"),
                    fiber_g=meal.get("fiber_g"),
                    recipe=meal.get("recipe"),
                    ingredients=meal.get("ingredients"),
                ))
        db.commit()
        db.refresh(plan)

        confirm = ChatMessage(
            session_id=session_id, role="assistant",
            content=f"✅ Nutrition plan \"{plan.title}\" has been saved! You can view it in your Nutrition section."
        )
        db.add(confirm)
        db.commit()

        return {"action": "nutrition", "plan_id": plan.id, "title": plan.title}

    # ── Update Profile ──
    elif req.action_type == "profile":
        updated_fields = []
        field_map = {
            "age": "age", "gender": "gender", "height_cm": "height_cm",
            "weight_kg": "weight_kg", "fitness_level": "fitness_level",
            "goals": "goals", "activity_level": "activity_level",
            "medical_conditions": "medical_conditions", "allergies": "allergies",
        }
        for json_key, model_attr in field_map.items():
            val = data.get(json_key)
            if val is not None:
                setattr(current_user, model_attr, val)
                updated_fields.append(json_key.replace("_", " "))

        if updated_fields:
            db.commit()
            confirm = ChatMessage(
                session_id=session_id, role="assistant",
                content=f"✅ Profile updated: {', '.join(updated_fields)}. Check your Profile page for details."
            )
            db.add(confirm)
            db.commit()

        return {"action": "profile", "updated_fields": updated_fields}

    else:
        raise HTTPException(400, "Invalid action type. Use: workout, nutrition, profile")
