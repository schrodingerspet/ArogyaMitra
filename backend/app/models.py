from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Date, Boolean
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
    language = Column(String, nullable=True, default="en")
    caregiver_email = Column(String, nullable=True)
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
    family_history = Column(String, nullable=True)
    smoking_status = Column(String, nullable=True)
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
    heart_rate_bpm = Column(Integer, nullable=True)
    blood_pressure_systolic = Column(Integer, nullable=True)
    blood_pressure_diastolic = Column(Integer, nullable=True)
    blood_sugar_mg_dl = Column(Integer, nullable=True)
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


# ──────────────────────────── Hospital ────────────────────────────
class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    distance_km = Column(Float, nullable=False)
    rating = Column(Float, nullable=False)
    facility_type = Column(String, nullable=False)
    contact_number = Column(String, nullable=True)


# ──────────────────────────── Lab Test Booking ────────────────────────────
class LabTestBooking(Base):
    __tablename__ = "lab_test_bookings"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_name = Column(String, nullable=False)
    lab_name = Column(String, nullable=False)
    booking_date = Column(Date, nullable=False)
    status = Column(String, default="Scheduled")

    owner = relationship("User")


# ──────────────────────────── Doctor ────────────────────────────
class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Optional link to a user account
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    is_verified = Column(Integer, default=0) # 0 for false, 1 for true. SQLite boolean.
    
    feedbacks = relationship("ConsultationFeedback", back_populates="doctor", cascade="all, delete-orphan")


# ──────────────────────────── Consultation Feedback ────────────────────────────
class ConsultationFeedback(Base):
    __tablename__ = "consultation_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    doctor = relationship("Doctor", back_populates="feedbacks")
    patient = relationship("User")


# ──────────────────────────── Appointment ────────────────────────────
class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    date_time = Column(DateTime, nullable=False)
    status = Column(String, default="Scheduled") # Scheduled, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("User")
    doctor = relationship("Doctor")


# ──────────────────────────── Follow-up Recommendation ────────────────────────────
class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    specialty = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    due_date = Column(Date, nullable=False)
    urgency = Column(String, default="Normal") # Normal, High

    user = relationship("User")
    doctor = relationship("Doctor")


# ──────────────────────────── Reminder ────────────────────────────
class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False) # Appointment, Medication, Lab Test
    details = Column(String, nullable=False)
    time_string = Column(String, nullable=False) # e.g. "Tomorrow, 10:00 AM" or actual datetime
    status = Column(String, default="Pending")

    user = relationship("User")


# ──────────────────────────── Waiting List ────────────────────────────
class WaitingListEntry(Base):
    __tablename__ = "waiting_list"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    wait_time_mins = Column(Integer, nullable=False)
    priority = Column(String, default="Normal") # Normal, High

    doctor = relationship("Doctor")


# ═══════════════════════ Records Hub ═══════════════════════

class MedicalDocument(Base):
    __tablename__ = "medical_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    date_str = Column(String, nullable=False) # e.g. "Jul 10, 2026"
    file_type = Column(String, nullable=False) # PDF, IMG
    size_str = Column(String, nullable=False) # e.g. "1.2 MB"
    
    user = relationship("User")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date_str = Column(String, nullable=False) # e.g. "Jul 12, 2026"
    title = Column(String, nullable=False)
    type = Column(String, nullable=False) # Symptom, Visit, Milestone
    description = Column(String, nullable=False)
    icon_name = Column(String, nullable=False) # e.g. "thermometer", "heart", "activity"
    color = Column(String, nullable=False)

    user = relationship("User")


# ═══════════════════════ Tracking Hub ═══════════════════════

class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    dose = Column(String, nullable=False)
    schedule = Column(String, nullable=False)
    status = Column(String, default="Pending") # Pending, Taken
    icon = Column(String, default="💊")

    user = relationship("User")

class MedicationRenewal(Base):
    __tablename__ = "medication_renewals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    refills = Column(Integer, nullable=False)
    next_refill = Column(String, nullable=False) # e.g. "Jul 20, 2026"
    
    user = relationship("User")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False) # Alert, Info, Success
    msg = Column(String, nullable=False)
    time_str = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    
    user = relationship("User")

class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date_str = Column(String, nullable=False)
    time_str = Column(String, nullable=False)
    symptom = Column(String, nullable=False)
    severity = Column(String, nullable=False) # Mild, Moderate, Severe
    notes = Column(Text, nullable=True)

    user = relationship("User")

class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    date_str = Column(String, nullable=False)
    status = Column(String, nullable=False) # Upcoming, Completed
    patient_name = Column(String, nullable=False)

    user = relationship("User")
