"""Progress analytics — trends, streaks, and summary statistics."""

from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..models import ProgressRecord, WorkoutPlan, NutritionPlan, HealthAssessment


class AnalyticsService:

    @staticmethod
    def get_summary(user_id: int, db: Session) -> dict:
        """Overall fitness summary for the user."""
        total_workouts = db.query(func.sum(ProgressRecord.workouts_completed)).filter(
            ProgressRecord.owner_id == user_id
        ).scalar() or 0

        total_calories_burned = db.query(func.sum(ProgressRecord.calories_burned)).filter(
            ProgressRecord.owner_id == user_id
        ).scalar() or 0

        total_records = db.query(func.count(ProgressRecord.id)).filter(
            ProgressRecord.owner_id == user_id
        ).scalar() or 0

        workout_plans = db.query(func.count(WorkoutPlan.id)).filter(
            WorkoutPlan.owner_id == user_id
        ).scalar() or 0

        nutrition_plans = db.query(func.count(NutritionPlan.id)).filter(
            NutritionPlan.owner_id == user_id
        ).scalar() or 0

        latest_weight = None
        latest_progress = (
            db.query(ProgressRecord)
            .filter(ProgressRecord.owner_id == user_id, ProgressRecord.weight_kg.isnot(None))
            .order_by(ProgressRecord.date.desc())
            .first()
        )
        if latest_progress:
            latest_weight = latest_progress.weight_kg

        return {
            "total_workouts_completed": total_workouts,
            "total_calories_burned": total_calories_burned,
            "total_progress_entries": total_records,
            "workout_plans_created": workout_plans,
            "nutrition_plans_created": nutrition_plans,
            "current_weight_kg": latest_weight,
        }

    @staticmethod
    def get_weekly_summary(user_id: int, db: Session) -> dict:
        """Summary for the last 7 days."""
        week_ago = date.today() - timedelta(days=7)
        records = (
            db.query(ProgressRecord)
            .filter(ProgressRecord.owner_id == user_id, ProgressRecord.date >= week_ago)
            .order_by(ProgressRecord.date)
            .all()
        )
        if not records:
            return {"message": "No progress data for the past week", "days_logged": 0}

        return {
            "days_logged": len(records),
            "total_calories_burned": sum(r.calories_burned or 0 for r in records),
            "total_calories_consumed": sum(r.calories_consumed or 0 for r in records),
            "total_workouts": sum(r.workouts_completed or 0 for r in records),
            "total_steps": sum(r.steps or 0 for r in records),
            "avg_sleep_hours": round(
                sum(r.sleep_hours or 0 for r in records) / len(records), 1
            ) if any(r.sleep_hours for r in records) else None,
            "avg_water_liters": round(
                sum(r.water_intake_liters or 0 for r in records) / len(records), 1
            ) if any(r.water_intake_liters for r in records) else None,
            "mood_distribution": _count_moods(records),
            "daily_breakdown": [
                {
                    "date": str(r.date),
                    "calories_burned": r.calories_burned,
                    "workouts_completed": r.workouts_completed,
                    "weight_kg": r.weight_kg,
                    "mood": r.mood,
                }
                for r in records
            ],
        }

    @staticmethod
    def get_weight_trend(user_id: int, db: Session) -> dict:
        """Weight change over time."""
        records = (
            db.query(ProgressRecord)
            .filter(ProgressRecord.owner_id == user_id, ProgressRecord.weight_kg.isnot(None))
            .order_by(ProgressRecord.date)
            .all()
        )
        if not records:
            return {"message": "No weight data recorded", "data_points": []}

        first = records[0].weight_kg
        last = records[-1].weight_kg

        return {
            "starting_weight": first,
            "current_weight": last,
            "change_kg": round(last - first, 2),
            "data_points": [{"date": str(r.date), "weight_kg": r.weight_kg} for r in records],
        }

    @staticmethod
    def get_workout_streak(user_id: int, db: Session) -> dict:
        """Calculate consecutive workout days."""
        records = (
            db.query(ProgressRecord)
            .filter(ProgressRecord.owner_id == user_id, ProgressRecord.workouts_completed > 0)
            .order_by(ProgressRecord.date.desc())
            .all()
        )
        if not records:
            return {"current_streak": 0, "longest_streak": 0, "total_workout_days": 0}

        dates = sorted(set(r.date for r in records), reverse=True)
        current_streak = 0
        today = date.today()
        for i, d in enumerate(dates):
            expected = today - timedelta(days=i)
            if d == expected:
                current_streak += 1
            else:
                break

        # Longest streak
        sorted_asc = sorted(dates)
        longest = 1
        current = 1
        for i in range(1, len(sorted_asc)):
            if sorted_asc[i] - sorted_asc[i - 1] == timedelta(days=1):
                current += 1
                longest = max(longest, current)
            else:
                current = 1

        return {
            "current_streak": current_streak,
            "longest_streak": longest,
            "total_workout_days": len(dates),
        }


    @staticmethod
    def get_health_metrics(user_id: int, db: Session) -> dict:
        week_ago = date.today() - timedelta(days=7)
        records = (
            db.query(ProgressRecord)
            .filter(ProgressRecord.owner_id == user_id, ProgressRecord.date >= week_ago)
            .order_by(ProgressRecord.date)
            .all()
        )
        
        user = db.query(User).filter(User.id == user_id).first()
        height_m = (user.height_cm / 100) if user and user.height_cm else None

        metrics = {
            "heart_rate": [],
            "blood_pressure_systolic": [],
            "blood_sugar": [],
            "bmi": []
        }
        
        for r in records:
            if r.heart_rate_bpm:
                metrics["heart_rate"].append({"date": r.date, "value": r.heart_rate_bpm})
            if r.blood_pressure_systolic:
                metrics["blood_pressure_systolic"].append({"date": r.date, "value": r.blood_pressure_systolic})
            if r.blood_sugar_mg_dl:
                metrics["blood_sugar"].append({"date": r.date, "value": r.blood_sugar_mg_dl})
            if height_m and r.weight_kg:
                bmi = round(r.weight_kg / (height_m * height_m), 1)
                metrics["bmi"].append({"date": r.date, "value": bmi})
                
        return metrics

    @staticmethod
    def get_insights(user_id: int, db: Session) -> dict:
        week_ago = date.today() - timedelta(days=7)
        records = (
            db.query(ProgressRecord)
            .filter(ProgressRecord.owner_id == user_id, ProgressRecord.date >= week_ago)
            .all()
        )
        
        if not records:
            return {
                "summary": "We don't have enough data yet. Start logging your progress!",
                "positive_trends": [],
                "improvement_areas": []
            }
            
        workouts = sum(r.workouts_completed or 0 for r in records)
        water = sum(r.water_intake_liters or 0 for r in records) / len(records) if records else 0
        
        summary = f"Based on your data this week, you completed {workouts} workouts."
        positive_trends = []
        improvement_areas = []
        
        if workouts >= 3:
            positive_trends.append("Consistent workout schedule maintained.")
            summary += " Great job staying active!"
        else:
            improvement_areas.append("Try to fit in a few more workouts next week.")
            
        if water < 2.0:
            improvement_areas.append(f"Hydration is below target (avg {round(water, 1)}L/day).")
        else:
            positive_trends.append(f"Good hydration (avg {round(water, 1)}L/day).")
            
        return {
            "summary": summary,
            "positive_trends": positive_trends,
            "improvement_areas": improvement_areas
        }

    @staticmethod
    def get_report_comparison(user_id: int, base_date: date, recent_date: date, db: Session) -> dict:
        base_record = db.query(ProgressRecord).filter(ProgressRecord.owner_id == user_id, ProgressRecord.date == base_date).first()
        recent_record = db.query(ProgressRecord).filter(ProgressRecord.owner_id == user_id, ProgressRecord.date == recent_date).first()
        
        metrics = []
        
        if base_record and recent_record:
            if base_record.weight_kg and recent_record.weight_kg:
                metrics.append({
                    "label": "Weight",
                    "old_val": base_record.weight_kg,
                    "new_val": recent_record.weight_kg,
                    "unit": "kg",
                    "better_is": "lower"
                })
            if base_record.blood_sugar_mg_dl and recent_record.blood_sugar_mg_dl:
                metrics.append({
                    "label": "Blood Sugar",
                    "old_val": base_record.blood_sugar_mg_dl,
                    "new_val": recent_record.blood_sugar_mg_dl,
                    "unit": "mg/dL",
                    "better_is": "lower"
                })
            if base_record.heart_rate_bpm and recent_record.heart_rate_bpm:
                metrics.append({
                    "label": "Heart Rate",
                    "old_val": base_record.heart_rate_bpm,
                    "new_val": recent_record.heart_rate_bpm,
                    "unit": "bpm",
                    "better_is": "lower"
                })
                
        return {
            "base_date": base_date,
            "recent_date": recent_date,
            "metrics": metrics
        }


def _count_moods(records) -> dict:
    moods = {}
    for r in records:
        if r.mood:
            moods[r.mood] = moods.get(r.mood, 0) + 1
    return moods
