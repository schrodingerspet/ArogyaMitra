"""Health metrics calculations — BMI, BMR, TDEE, and health insights."""

import math


class HealthService:

    # ── BMI ──────────────────────────────────────────────
    @staticmethod
    def calculate_bmi(weight_kg: float, height_cm: float) -> float:
        if height_cm <= 0:
            return 0.0
        return round(weight_kg / ((height_cm / 100) ** 2), 2)

    @staticmethod
    def classify_bmi(bmi: float) -> str:
        if bmi < 18.5:
            return "Underweight"
        elif bmi < 25:
            return "Normal weight"
        elif bmi < 30:
            return "Overweight"
        return "Obese"

    # ── BMR (Mifflin-St Jeor) ────────────────────────────
    @staticmethod
    def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
        if gender and gender.lower() in ("male", "m"):
            return round(10 * weight_kg + 6.25 * height_cm - 5 * age + 5, 2)
        return round(10 * weight_kg + 6.25 * height_cm - 5 * age - 161, 2)

    # ── TDEE ─────────────────────────────────────────────
    ACTIVITY_MULTIPLIERS = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
    }

    @classmethod
    def calculate_tdee(cls, bmr: float, activity_level: str) -> float:
        multiplier = cls.ACTIVITY_MULTIPLIERS.get(
            (activity_level or "moderate").lower(), 1.55
        )
        return round(bmr * multiplier, 2)

    # ── Calorie target based on goal ─────────────────────
    @staticmethod
    def calorie_target_for_goal(tdee: float, goal: str) -> int:
        adjustments = {
            "weight_loss": -500,
            "muscle_gain": 300,
            "maintenance": 0,
            "flexibility": -100,
            "endurance": 200,
        }
        offset = adjustments.get((goal or "maintenance").lower(), 0)
        return max(1200, round(tdee + offset))

    # ── Health insights from an assessment ────────────────
    @classmethod
    def get_health_insights(cls, assessment) -> dict:
        bmi = cls.calculate_bmi(assessment.weight_kg, assessment.height_cm)
        bmr = cls.calculate_bmr(
            assessment.weight_kg, assessment.height_cm,
            assessment.age, assessment.gender,
        )
        tdee = cls.calculate_tdee(bmr, assessment.activity_level)
        calorie_target = cls.calorie_target_for_goal(tdee, assessment.goals)

        return {
            "bmi": bmi,
            "bmi_category": cls.classify_bmi(bmi),
            "bmr": bmr,
            "tdee": tdee,
            "recommended_calories": calorie_target,
            "goal": assessment.goals or "maintenance",
            "hydration_liters": round(assessment.weight_kg * 0.033, 1),
            "sleep_recommendation": "7-9 hours",
        }
