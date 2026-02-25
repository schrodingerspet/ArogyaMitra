"""Workout plan generation — template-based exercise programming."""

import random
from typing import Optional

from .health_service import HealthService


# Categorised exercise database by location
EXERCISE_DB = {
    "home": {
        "warmup": [
            {"name": "Jumping Jacks", "sets": 2, "reps": 20, "duration_seconds": 60, "rest_seconds": 15},
            {"name": "High Knees", "sets": 2, "reps": 20, "duration_seconds": 60, "rest_seconds": 15},
            {"name": "Arm Circles", "sets": 2, "reps": 15, "duration_seconds": 45, "rest_seconds": 10},
            {"name": "Leg Swings", "sets": 2, "reps": 12, "duration_seconds": 40, "rest_seconds": 10},
            {"name": "Mountain Climbers", "sets": 2, "reps": 15, "duration_seconds": 60, "rest_seconds": 15},
        ],
        "cardio": [
            {"name": "Burpees", "sets": 3, "reps": 10, "duration_seconds": 90, "rest_seconds": 30},
            {"name": "Jump Squats", "sets": 3, "reps": 15, "duration_seconds": 75, "rest_seconds": 30},
            {"name": "Jumping Lunges", "sets": 3, "reps": 12, "duration_seconds": 75, "rest_seconds": 30},
            {"name": "Skater Jumps", "sets": 3, "reps": 15, "duration_seconds": 75, "rest_seconds": 25},
            {"name": "Tuck Jumps", "sets": 3, "reps": 10, "duration_seconds": 60, "rest_seconds": 30},
        ],
        "strength": [
            {"name": "Push-ups", "sets": 3, "reps": 12, "duration_seconds": 90, "rest_seconds": 30},
            {"name": "Bodyweight Squats", "sets": 3, "reps": 15, "duration_seconds": 90, "rest_seconds": 30},
            {"name": "Lunges", "sets": 3, "reps": 12, "duration_seconds": 90, "rest_seconds": 30},
            {"name": "Plank Hold", "sets": 3, "reps": 1, "duration_seconds": 60, "rest_seconds": 30},
            {"name": "Tricep Dips", "sets": 3, "reps": 12, "duration_seconds": 75, "rest_seconds": 30},
            {"name": "Glute Bridges", "sets": 3, "reps": 15, "duration_seconds": 75, "rest_seconds": 25},
            {"name": "Superman Hold", "sets": 3, "reps": 10, "duration_seconds": 60, "rest_seconds": 25},
            {"name": "Wall Sit", "sets": 3, "reps": 1, "duration_seconds": 45, "rest_seconds": 30},
        ],
        "flexibility": [
            {"name": "Hamstring Stretch", "sets": 2, "reps": 1, "duration_seconds": 30, "rest_seconds": 10},
            {"name": "Quad Stretch", "sets": 2, "reps": 1, "duration_seconds": 30, "rest_seconds": 10},
            {"name": "Cat-Cow Stretch", "sets": 2, "reps": 8, "duration_seconds": 40, "rest_seconds": 10},
            {"name": "Child's Pose", "sets": 1, "reps": 1, "duration_seconds": 30, "rest_seconds": 0},
            {"name": "Hip Flexor Stretch", "sets": 2, "reps": 1, "duration_seconds": 30, "rest_seconds": 10},
        ],
        "cooldown": [
            {"name": "Deep Breathing", "sets": 1, "reps": 10, "duration_seconds": 60, "rest_seconds": 0},
            {"name": "Standing Forward Fold", "sets": 1, "reps": 1, "duration_seconds": 30, "rest_seconds": 0},
            {"name": "Seated Twist", "sets": 1, "reps": 1, "duration_seconds": 30, "rest_seconds": 0},
        ],
    },
    "gym": {
        "warmup": [
            {"name": "Treadmill Walk", "sets": 1, "reps": 1, "duration_seconds": 300, "rest_seconds": 0},
            {"name": "Jump Rope", "sets": 2, "reps": 50, "duration_seconds": 120, "rest_seconds": 20},
            {"name": "Dynamic Stretches", "sets": 1, "reps": 10, "duration_seconds": 120, "rest_seconds": 0},
        ],
        "cardio": [
            {"name": "Treadmill Run", "sets": 1, "reps": 1, "duration_seconds": 600, "rest_seconds": 60},
            {"name": "Cycling", "sets": 1, "reps": 1, "duration_seconds": 600, "rest_seconds": 60},
            {"name": "Rowing Machine", "sets": 1, "reps": 1, "duration_seconds": 480, "rest_seconds": 60},
            {"name": "Elliptical", "sets": 1, "reps": 1, "duration_seconds": 600, "rest_seconds": 60},
            {"name": "Stair Climber", "sets": 1, "reps": 1, "duration_seconds": 480, "rest_seconds": 60},
        ],
        "strength": [
            {"name": "Bench Press", "sets": 4, "reps": 10, "duration_seconds": 120, "rest_seconds": 60},
            {"name": "Deadlift", "sets": 4, "reps": 8, "duration_seconds": 120, "rest_seconds": 90},
            {"name": "Barbell Squats", "sets": 4, "reps": 10, "duration_seconds": 120, "rest_seconds": 60},
            {"name": "Lat Pulldown", "sets": 3, "reps": 12, "duration_seconds": 90, "rest_seconds": 45},
            {"name": "Shoulder Press", "sets": 3, "reps": 10, "duration_seconds": 90, "rest_seconds": 45},
            {"name": "Bicep Curls", "sets": 3, "reps": 12, "duration_seconds": 75, "rest_seconds": 30},
            {"name": "Leg Press", "sets": 4, "reps": 12, "duration_seconds": 120, "rest_seconds": 60},
            {"name": "Cable Fly", "sets": 3, "reps": 12, "duration_seconds": 75, "rest_seconds": 30},
        ],
        "flexibility": [
            {"name": "Foam Rolling", "sets": 1, "reps": 1, "duration_seconds": 120, "rest_seconds": 0},
            {"name": "Hamstring Stretch", "sets": 2, "reps": 1, "duration_seconds": 30, "rest_seconds": 10},
            {"name": "Shoulder Stretch", "sets": 2, "reps": 1, "duration_seconds": 30, "rest_seconds": 10},
        ],
        "cooldown": [
            {"name": "Walking", "sets": 1, "reps": 1, "duration_seconds": 300, "rest_seconds": 0},
            {"name": "Static Stretches", "sets": 1, "reps": 1, "duration_seconds": 180, "rest_seconds": 0},
        ],
    },
    "outdoor": {
        "warmup": [
            {"name": "Brisk Walking", "sets": 1, "reps": 1, "duration_seconds": 300, "rest_seconds": 0},
            {"name": "Light Jogging", "sets": 1, "reps": 1, "duration_seconds": 180, "rest_seconds": 0},
            {"name": "Dynamic Leg Swings", "sets": 2, "reps": 12, "duration_seconds": 60, "rest_seconds": 10},
        ],
        "cardio": [
            {"name": "Running", "sets": 1, "reps": 1, "duration_seconds": 900, "rest_seconds": 60},
            {"name": "Hill Sprints", "sets": 5, "reps": 1, "duration_seconds": 60, "rest_seconds": 60},
            {"name": "Cycling", "sets": 1, "reps": 1, "duration_seconds": 900, "rest_seconds": 0},
        ],
        "strength": [
            {"name": "Pull-ups", "sets": 3, "reps": 8, "duration_seconds": 90, "rest_seconds": 45},
            {"name": "Dips", "sets": 3, "reps": 10, "duration_seconds": 75, "rest_seconds": 30},
            {"name": "Step-ups", "sets": 3, "reps": 12, "duration_seconds": 90, "rest_seconds": 30},
            {"name": "Push-ups", "sets": 3, "reps": 15, "duration_seconds": 90, "rest_seconds": 30},
        ],
        "flexibility": [
            {"name": "Standing Quad Stretch", "sets": 2, "reps": 1, "duration_seconds": 30, "rest_seconds": 10},
            {"name": "Yoga Sun Salutation", "sets": 3, "reps": 1, "duration_seconds": 60, "rest_seconds": 10},
        ],
        "cooldown": [
            {"name": "Walking", "sets": 1, "reps": 1, "duration_seconds": 300, "rest_seconds": 0},
            {"name": "Deep Breathing", "sets": 1, "reps": 10, "duration_seconds": 60, "rest_seconds": 0},
        ],
    },
}

# Goal-driven session structure: (category, exercise_count) per goal
GOAL_TEMPLATES = {
    "weight_loss":  [("warmup", 2), ("cardio", 2), ("strength", 2), ("cooldown", 1)],
    "muscle_gain":  [("warmup", 2), ("strength", 4), ("cardio", 1), ("cooldown", 1)],
    "maintenance":  [("warmup", 2), ("cardio", 1), ("strength", 2), ("flexibility", 1), ("cooldown", 1)],
    "flexibility":  [("warmup", 2), ("flexibility", 3), ("strength", 1), ("cooldown", 1)],
    "endurance":    [("warmup", 2), ("cardio", 3), ("strength", 1), ("cooldown", 1)],
}

# MET values for calorie estimation
MET_VALUES = {
    "warmup": 3.5, "cardio": 7.0, "strength": 5.0,
    "flexibility": 2.5, "cooldown": 2.0,
}

# Day labels for 7-day plans
DAY_FOCUS = [
    "Full Body", "Upper Body", "Cardio & Core",
    "Rest / Light Stretch", "Lower Body", "HIIT & Functional",
    "Active Recovery",
]


class WorkoutService:

    @staticmethod
    def estimate_calories(category: str, duration_minutes: float, weight_kg: float) -> int:
        met = MET_VALUES.get(category, 4.0)
        return round(met * weight_kg * (duration_minutes / 60))

    @classmethod
    def generate_plan(
        cls,
        fitness_goal: str = "maintenance",
        workout_location: str = "home",
        duration_days: int = 7,
        daily_minutes: int = 30,
        difficulty_level: str = "intermediate",
        weight_kg: float = 70.0,
    ) -> dict:
        """Return a structured 7-day workout plan dict (not DB objects)."""
        location = workout_location.lower() if workout_location else "home"
        if location not in EXERCISE_DB:
            location = "home"

        goal = (fitness_goal or "maintenance").lower()
        template = GOAL_TEMPLATES.get(goal, GOAL_TEMPLATES["maintenance"])
        pool = EXERCISE_DB[location]

        difficulty_multiplier = {"beginner": 0.7, "intermediate": 1.0, "advanced": 1.3}.get(
            (difficulty_level or "intermediate").lower(), 1.0
        )

        days = []
        for day_num in range(1, duration_days + 1):
            # Rest day (day 4 or 7)
            if day_num in (4, 7) and duration_days == 7:
                days.append({
                    "day_number": day_num,
                    "focus": DAY_FOCUS[(day_num - 1) % len(DAY_FOCUS)],
                    "exercises": [{
                        "name": "Light Walking / Stretching",
                        "category": "cooldown",
                        "sets": 1, "reps": 1,
                        "duration_seconds": daily_minutes * 60,
                        "rest_seconds": 0,
                        "instructions": "Active recovery — gentle movement only.",
                        "order": 1,
                    }],
                    "estimated_calories": cls.estimate_calories("cooldown", daily_minutes, weight_kg),
                })
                continue

            exercises = []
            order = 1
            for category, count in template:
                available = pool.get(category, [])
                if not available:
                    continue
                picked = random.sample(available, min(count, len(available)))
                for ex in picked:
                    scaled = dict(ex)
                    scaled["sets"] = max(1, round(ex["sets"] * difficulty_multiplier))
                    scaled["reps"] = max(1, round(ex["reps"] * difficulty_multiplier))
                    scaled["category"] = category
                    scaled["order"] = order
                    scaled["instructions"] = f"Perform {scaled['sets']}x{scaled['reps']} with proper form."
                    order += 1
                    exercises.append(scaled)

            total_seconds = sum(
                (e["duration_seconds"] + e["rest_seconds"]) * e["sets"] for e in exercises
            )
            estimated_cal = sum(
                cls.estimate_calories(e["category"], e["duration_seconds"] * e["sets"] / 60, weight_kg)
                for e in exercises
            )

            days.append({
                "day_number": day_num,
                "focus": DAY_FOCUS[(day_num - 1) % len(DAY_FOCUS)],
                "exercises": exercises,
                "estimated_duration_minutes": round(total_seconds / 60, 1),
                "estimated_calories": estimated_cal,
            })

        return {
            "fitness_goal": goal,
            "workout_location": location,
            "duration_days": duration_days,
            "daily_minutes": daily_minutes,
            "difficulty_level": difficulty_level,
            "days": days,
            "total_estimated_calories": sum(d["estimated_calories"] for d in days),
        }

    @staticmethod
    def adjust_for_travel(plan: dict) -> dict:
        """Replace equipment-based exercises with travel-friendly ones."""
        travel_pool = EXERCISE_DB["home"]
        for day in plan.get("days", []):
            adjusted = []
            for ex in day.get("exercises", []):
                cat = ex.get("category", "strength")
                options = travel_pool.get(cat, travel_pool.get("strength", []))
                if options:
                    replacement = random.choice(options)
                    ex.update({
                        "name": replacement["name"],
                        "sets": replacement["sets"],
                        "reps": replacement["reps"],
                        "instructions": f"Travel-friendly: {replacement['name']}",
                    })
                adjusted.append(ex)
            day["exercises"] = adjusted
        return plan
