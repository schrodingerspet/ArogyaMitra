from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date


# ═══════════════════════ Auth / User ═══════════════════════

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    fitness_level: Optional[str] = None
    goals: Optional[str] = None
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None
    activity_level: Optional[str] = None
    language: Optional[str] = None
    caregiver_email: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    fitness_level: Optional[str] = None
    goals: Optional[str] = None
    activity_level: Optional[str] = None
    language: Optional[str] = None
    caregiver_email: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# ═══════════════════════ Exercise ═══════════════════════

class ExerciseCreate(BaseModel):
    day_number: int
    name: str
    category: Optional[str] = None
    sets: Optional[int] = None
    reps: Optional[int] = None
    duration_seconds: Optional[int] = None
    rest_seconds: Optional[int] = None
    youtube_url: Optional[str] = None
    instructions: Optional[str] = None
    order: int = 0


class ExerciseResponse(BaseModel):
    id: int
    workout_plan_id: int
    day_number: int
    name: str
    category: Optional[str] = None
    sets: Optional[int] = None
    reps: Optional[int] = None
    duration_seconds: Optional[int] = None
    rest_seconds: Optional[int] = None
    youtube_url: Optional[str] = None
    instructions: Optional[str] = None
    order: int

    class Config:
        from_attributes = True


# ═══════════════════════ Workout Plan ═══════════════════════

class WorkoutCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    fitness_goal: Optional[str] = None
    workout_location: Optional[str] = None
    duration_days: int = 7
    daily_minutes: int = 30
    difficulty_level: Optional[str] = None


class WorkoutResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    fitness_goal: Optional[str] = None
    workout_location: Optional[str] = None
    duration_days: int
    daily_minutes: int
    difficulty_level: Optional[str] = None
    created_at: Optional[datetime] = None
    exercises: List[ExerciseResponse] = []

    class Config:
        from_attributes = True


class WorkoutListResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    fitness_goal: Optional[str] = None
    duration_days: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ═══════════════════════ Meal ═══════════════════════

class MealCreate(BaseModel):
    day_number: int
    meal_type: str
    name: str
    calories: Optional[int] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    fiber_g: Optional[float] = None
    recipe: Optional[str] = None
    ingredients: Optional[str] = None


class MealResponse(BaseModel):
    id: int
    nutrition_plan_id: int
    day_number: int
    meal_type: str
    name: str
    calories: Optional[int] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    fiber_g: Optional[float] = None
    recipe: Optional[str] = None
    ingredients: Optional[str] = None

    class Config:
        from_attributes = True


# ═══════════════════════ Nutrition Plan ═══════════════════════

class NutritionPlanCreate(BaseModel):
    title: str
    calorie_target: Optional[int] = None
    diet_type: Optional[str] = None
    allergies: Optional[str] = None
    cuisine_preference: Optional[str] = None
    duration_days: int = 7


class NutritionPlanResponse(BaseModel):
    id: int
    title: str
    calorie_target: Optional[int] = None
    diet_type: Optional[str] = None
    allergies: Optional[str] = None
    cuisine_preference: Optional[str] = None
    duration_days: int
    created_at: Optional[datetime] = None
    meals: List[MealResponse] = []

    class Config:
        from_attributes = True


class NutritionPlanListResponse(BaseModel):
    id: int
    title: str
    calorie_target: Optional[int] = None
    diet_type: Optional[str] = None
    duration_days: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ═══════════════════════ Health Assessment ═══════════════════════

class HealthAssessmentCreate(BaseModel):
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    fitness_level: Optional[str] = None
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None
    goals: Optional[str] = None
    activity_level: Optional[str] = None
    sleep_hours: Optional[float] = None
    water_intake_liters: Optional[float] = None
    stress_level: Optional[str] = None
    family_history: Optional[str] = None
    smoking_status: Optional[str] = None
    notes: Optional[str] = None


class HealthAssessmentResponse(BaseModel):
    id: int
    owner_id: int
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    bmi: Optional[float] = None
    fitness_level: Optional[str] = None
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None
    goals: Optional[str] = None
    activity_level: Optional[str] = None
    sleep_hours: Optional[float] = None
    water_intake_liters: Optional[float] = None
    stress_level: Optional[str] = None
    family_history: Optional[str] = None
    smoking_status: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ═══════════════════════ Progress Record ═══════════════════════

class ProgressRecordCreate(BaseModel):
    date: date
    weight_kg: Optional[float] = None
    calories_burned: Optional[int] = None
    calories_consumed: Optional[int] = None
    workouts_completed: int = 0
    steps: Optional[int] = None
    water_intake_liters: Optional[float] = None
    sleep_hours: Optional[float] = None
    heart_rate_bpm: Optional[int] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    blood_sugar_mg_dl: Optional[int] = None
    mood: Optional[str] = None
    notes: Optional[str] = None


class ProgressRecordResponse(BaseModel):
    id: int
    owner_id: int
    date: date
    weight_kg: Optional[float] = None
    calories_burned: Optional[int] = None
    calories_consumed: Optional[int] = None
    workouts_completed: int
    steps: Optional[int] = None
    water_intake_liters: Optional[float] = None
    sleep_hours: Optional[float] = None
    heart_rate_bpm: Optional[int] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    blood_sugar_mg_dl: Optional[int] = None
    mood: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ═══════════════════════ Chat ═══════════════════════

class ChatMessageCreate(BaseModel):
    content: str


class ChatMessageResponse(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ChatSessionCreate(BaseModel):
    title: Optional[str] = None


class ChatSessionResponse(BaseModel):
    id: int
    title: Optional[str] = None
    created_at: Optional[datetime] = None
    messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True


class ChatSessionListResponse(BaseModel):
    id: int
    title: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ═══════════════════════ Services ═══════════════════════

class HospitalResponse(BaseModel):
    id: int
    name: str
    distance_km: float
    rating: float
    facility_type: str
    contact_number: Optional[str] = None

    class Config:
        from_attributes = True


class LabTestBookingCreate(BaseModel):
    test_name: str
    lab_name: str
    booking_date: date


class LabTestBookingResponse(BaseModel):
    id: int
    owner_id: int
    test_name: str
    lab_name: str
    booking_date: date
    status: str

    class Config:
        from_attributes = True


# ═══════════════════════ Doctors & Feedback ═══════════════════════

class ConsultationFeedbackCreate(BaseModel):
    rating: float
    comment: Optional[str] = None


class ConsultationFeedbackResponse(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    rating: float
    comment: Optional[str] = None
    created_at: Optional[datetime] = None
    
    # We can include a bit of patient info if we want, or just let frontend fetch
    
    class Config:
        from_attributes = True


class DoctorResponse(BaseModel):
    id: int
    name: str
    specialty: str
    is_verified: bool
    
    # Optional fields for calculated stats
    average_rating: Optional[float] = None
    review_count: Optional[int] = None
    feedbacks: List[ConsultationFeedbackResponse] = []

    class Config:
        from_attributes = True


# ═══════════════════════ Analytics ═══════════════════════

class MetricTrend(BaseModel):
    date: date
    value: float

class AnalyticsMetricsResponse(BaseModel):
    heart_rate: List[MetricTrend] = []
    blood_pressure_systolic: List[MetricTrend] = []
    blood_sugar: List[MetricTrend] = []
    bmi: List[MetricTrend] = []
    
class AnalyticsInsightResponse(BaseModel):
    summary: str
    positive_trends: List[str] = []
    improvement_areas: List[str] = []

class ReportComparisonItem(BaseModel):
    label: str
    old_val: float
    new_val: float
    unit: str
    better_is: str # "higher" | "lower"

class ReportComparisonResponse(BaseModel):
    base_date: date
    recent_date: date
    metrics: List[ReportComparisonItem] = []


# ═══════════════════════ Appointments Hub ═══════════════════════

class TimeSlotResponse(BaseModel):
    time: str
    status: str # available, booked, break

class RecommendationResponse(BaseModel):
    id: int
    doctor: str
    specialty: str
    reason: str
    dueDate: str
    urgency: str

    class Config:
        from_attributes = True

class ReminderResponse(BaseModel):
    id: int
    type: str
    details: str
    time: str
    status: str

    class Config:
        from_attributes = True

class WaitingListEntryResponse(BaseModel):
    id: int
    name: str
    doctor: str
    waitTime: str
    priority: str

    class Config:
        from_attributes = True


# ═══════════════════════ Records Hub ═══════════════════════

class MedicalDocumentResponse(BaseModel):
    id: int
    name: str
    date: str
    type: str
    size: str

    class Config:
        from_attributes = True

class TimelineEventResponse(BaseModel):
    id: int
    date: str
    title: str
    type: str
    desc: str
    icon: str
    color: str

    class Config:
        from_attributes = True


# ═══════════════════════ Tracking Hub ═══════════════════════

class MedicationResponse(BaseModel):
    id: int
    name: str
    dose: str
    schedule: str
    status: str
    icon: str

    class Config:
        from_attributes = True

class MedicationRenewalResponse(BaseModel):
    id: int
    name: str
    refills: int
    nextRefill: str

    class Config:
        from_attributes = True

class MedicationsDataResponse(BaseModel):
    medications: List[MedicationResponse]
    renewals: List[MedicationRenewalResponse]

class NotificationResponse(BaseModel):
    id: int
    type: str
    msg: str
    time: str
    read: bool

    class Config:
        from_attributes = True

class SymptomLogResponse(BaseModel):
    id: int
    date: str
    time: str
    symptom: str
    severity: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class VaccinationResponse(BaseModel):
    id: int
    name: str
    date: str
    status: str
    for_patient: str

    class Config:
        from_attributes = True