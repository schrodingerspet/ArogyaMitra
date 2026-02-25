from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


# ──────────────────────────── User ────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    fitness_level = Column(String, nullable=True)
    goals = Column(String, nullable=True)
    medical_conditions = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    activity_level = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    workout_plans = relationship("WorkoutPlan", back_populates="owner", cascade="all, delete-orphan")
    nutrition_plans = relationship("NutritionPlan", back_populates="owner", cascade="all, delete-orphan")
    health_assessments = relationship("HealthAssessment", back_populates="owner", cascade="all, delete-orphan")
    progress_records = relationship("ProgressRecord", back_populates="owner", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="owner", cascade="all, delete-orphan")


# ──────────────────────────── Workout Plan ────────────────────────────
class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    fitness_goal = Column(String, nullable=True)
    workout_location = Column(String, nullable=True)
    duration_days = Column(Integer, default=7)
    daily_minutes = Column(Integer, default=30)
    difficulty_level = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="workout_plans")
    exercises = relationship("Exercise", back_populates="workout_plan", cascade="all, delete-orphan")


# ──────────────────────────── Exercise ────────────────────────────
class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    workout_plan_id = Column(Integer, ForeignKey("workout_plans.id"), nullable=False)
    day_number = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    sets = Column(Integer, nullable=True)
    reps = Column(Integer, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    rest_seconds = Column(Integer, nullable=True)
    youtube_url = Column(String, nullable=True)
    instructions = Column(Text, nullable=True)
    order = Column(Integer, default=0)

    workout_plan = relationship("WorkoutPlan", back_populates="exercises")


# ──────────────────────────── Nutrition Plan ────────────────────────────
class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    calorie_target = Column(Integer, nullable=True)
    diet_type = Column(String, nullable=True)
    allergies = Column(Text, nullable=True)
    cuisine_preference = Column(String, nullable=True)
    duration_days = Column(Integer, default=7)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="nutrition_plans")
    meals = relationship("Meal", back_populates="nutrition_plan", cascade="all, delete-orphan")


# ──────────────────────────── Meal ────────────────────────────
class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    nutrition_plan_id = Column(Integer, ForeignKey("nutrition_plans.id"), nullable=False)
    day_number = Column(Integer, nullable=False)
    meal_type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    calories = Column(Integer, nullable=True)
    protein_g = Column(Float, nullable=True)
    carbs_g = Column(Float, nullable=True)
    fat_g = Column(Float, nullable=True)
    fiber_g = Column(Float, nullable=True)
    recipe = Column(Text, nullable=True)
    ingredients = Column(Text, nullable=True)

    nutrition_plan = relationship("NutritionPlan", back_populates="meals")


# ──────────────────────────── Health Assessment ────────────────────────────
class HealthAssessment(Base):
    __tablename__ = "health_assessments"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    height_cm = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    bmi = Column(Float, nullable=True)
    fitness_level = Column(String, nullable=True)
    medical_conditions = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    goals = Column(String, nullable=True)
    activity_level = Column(String, nullable=True)
    sleep_hours = Column(Float, nullable=True)
    water_intake_liters = Column(Float, nullable=True)
    stress_level = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="health_assessments")


# ──────────────────────────── Progress Record ────────────────────────────
class ProgressRecord(Base):
    __tablename__ = "progress_records"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    weight_kg = Column(Float, nullable=True)
    calories_burned = Column(Integer, nullable=True)
    calories_consumed = Column(Integer, nullable=True)
    workouts_completed = Column(Integer, default=0)
    steps = Column(Integer, nullable=True)
    water_intake_liters = Column(Float, nullable=True)
    sleep_hours = Column(Float, nullable=True)
    mood = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="progress_records")


# ──────────────────────────── Chat Session ────────────────────────────
class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


# ──────────────────────────── Chat Message ────────────────────────────
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")
