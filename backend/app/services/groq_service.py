"""Groq LLaMA AI service — powers AI-driven workout/nutrition generation and AROMI chat."""

import os
import json
from typing import Optional

try:
    from groq import Groq
    _groq_available = True
except ImportError:
    _groq_available = False

MODEL = "llama-3.3-70b-versatile"


def _get_client() -> Optional["Groq"]:
    if not _groq_available:
        return None
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key.startswith("your_"):
        return None
    return Groq(api_key=api_key)


class GroqService:

    @staticmethod
    def generate_text(prompt: str, system_prompt: str = "", max_tokens: int = 2048) -> Optional[str]:
        client = _get_client()
        if not client:
            return None
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        try:
            completion = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.7,
            )
            return completion.choices[0].message.content
        except Exception:
            return None

    @classmethod
    def generate_workout_plan_ai(cls, user_profile: dict) -> Optional[str]:
        system = (
            "You are AROMI, an expert AI fitness coach for the ArogyaMitra platform. "
            "Generate a detailed, personalised 7-day workout plan in valid JSON. "
            "Include day_number, focus, and exercises with name, category, sets, reps, "
            "duration_seconds, rest_seconds, and instructions for each exercise."
        )
        prompt = (
            f"Create a 7-day workout plan for this user profile:\n"
            f"- Age: {user_profile.get('age', 'unknown')}\n"
            f"- Gender: {user_profile.get('gender', 'unknown')}\n"
            f"- Weight: {user_profile.get('weight_kg', 70)} kg\n"
            f"- Height: {user_profile.get('height_cm', 170)} cm\n"
            f"- Fitness level: {user_profile.get('fitness_level', 'intermediate')}\n"
            f"- Goal: {user_profile.get('goals', 'maintenance')}\n"
            f"- Workout location: {user_profile.get('workout_location', 'home')}\n"
            f"- Available time: {user_profile.get('daily_minutes', 30)} minutes/day\n"
            f"- Medical conditions: {user_profile.get('medical_conditions', 'none')}\n\n"
            f"Return ONLY valid JSON with a 'days' array."
        )
        return cls.generate_text(prompt, system, max_tokens=4096)

    @classmethod
    def generate_nutrition_plan_ai(cls, user_profile: dict) -> Optional[str]:
        system = (
            "You are AROMI, an expert AI nutritionist for the ArogyaMitra platform. "
            "Generate a detailed, personalised 7-day Indian meal plan in valid JSON. "
            "Include day_number, meals (breakfast/lunch/dinner/snack) with name, calories, "
            "protein_g, carbs_g, fat_g, recipe, and ingredients."
        )
        prompt = (
            f"Create a 7-day nutrition plan for this user:\n"
            f"- Calorie target: {user_profile.get('calorie_target', 2000)} kcal/day\n"
            f"- Diet type: {user_profile.get('diet_type', 'vegetarian')}\n"
            f"- Allergies: {user_profile.get('allergies', 'none')}\n"
            f"- Cuisine: {user_profile.get('cuisine_preference', 'indian')}\n"
            f"- Goal: {user_profile.get('goals', 'maintenance')}\n\n"
            f"Return ONLY valid JSON with a 'days' array."
        )
        return cls.generate_text(prompt, system, max_tokens=4096)

    @classmethod
    def chat_with_aromi(cls, user_message: str, chat_history: list, user_profile: dict) -> str:
        system = (
            "You are AROMI, a friendly and knowledgeable AI wellness coach for the ArogyaMitra platform. "
            "You provide personalised workout advice, nutrition tips, motivational support, and "
            "adaptive recommendations based on the user's situation (travel, injuries, mood, time). "
            "Keep responses helpful, concise, and encouraging.\n\n"
            f"User profile: Age {user_profile.get('age', 'N/A')}, "
            f"Gender {user_profile.get('gender', 'N/A')}, "
            f"Weight {user_profile.get('weight_kg', 'N/A')} kg, "
            f"Fitness level {user_profile.get('fitness_level', 'N/A')}, "
            f"Goal {user_profile.get('goals', 'N/A')}."
        )

        messages = [{"role": "system", "content": system}]
        for msg in chat_history[-20:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": user_message})

        client = _get_client()
        if not client:
            return "AROMI is currently unavailable. Please check the Groq API key configuration."

        try:
            completion = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                max_tokens=1024,
                temperature=0.8,
            )
            return completion.choices[0].message.content
        except Exception as e:
            return f"AROMI encountered an error: {str(e)}"
