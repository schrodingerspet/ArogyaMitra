"""Nutrition planning — calorie/macro calculations and template meal plans."""

import random
from typing import Optional

from .health_service import HealthService


# Indian-cuisine focused meal database
MEAL_DB = {
    "vegetarian": {
        "breakfast": [
            {"name": "Oats Upma", "calories": 320, "protein_g": 10, "carbs_g": 52, "fat_g": 8, "fiber_g": 6,
             "recipe": "Cook rolled oats with mustard seeds, curry leaves, veggies, and spices.",
             "ingredients": "Rolled oats, onion, green chili, mustard seeds, curry leaves, turmeric, salt"},
            {"name": "Moong Dal Chilla", "calories": 280, "protein_g": 16, "carbs_g": 38, "fat_g": 6, "fiber_g": 5,
             "recipe": "Blend soaked moong dal into batter, pour on hot pan like a dosa, fill with veggies.",
             "ingredients": "Moong dal, onion, tomato, green chili, coriander, cumin, salt"},
            {"name": "Poha with Peanuts", "calories": 310, "protein_g": 8, "carbs_g": 48, "fat_g": 10, "fiber_g": 3,
             "recipe": "Rinse poha, sauté with mustard seeds, onion, peanuts, turmeric, and lemon.",
             "ingredients": "Flattened rice, peanuts, onion, mustard seeds, turmeric, lemon, curry leaves"},
            {"name": "Idli Sambar", "calories": 290, "protein_g": 12, "carbs_g": 50, "fat_g": 4, "fiber_g": 5,
             "recipe": "Steam idli batter. Prepare sambar with toor dal and mixed vegetables.",
             "ingredients": "Idli batter, toor dal, drumstick, carrot, tomato, sambar powder, tamarind"},
            {"name": "Besan Chilla", "calories": 260, "protein_g": 14, "carbs_g": 32, "fat_g": 8, "fiber_g": 4,
             "recipe": "Mix besan with water, onion, tomato, and spices. Cook as thin pancakes.",
             "ingredients": "Gram flour, onion, tomato, green chili, coriander, cumin, salt"},
        ],
        "lunch": [
            {"name": "Rajma Chawal", "calories": 450, "protein_g": 18, "carbs_g": 68, "fat_g": 10, "fiber_g": 12,
             "recipe": "Cook kidney beans in spiced tomato gravy. Serve with steamed rice.",
             "ingredients": "Kidney beans, rice, tomato, onion, ginger, garlic, cumin, garam masala"},
            {"name": "Dal Tadka with Roti", "calories": 420, "protein_g": 16, "carbs_g": 60, "fat_g": 12, "fiber_g": 8,
             "recipe": "Cook toor dal, temper with ghee, cumin, garlic, and dry chilies. Serve with wheat roti.",
             "ingredients": "Toor dal, ghee, cumin, garlic, dry red chili, wheat flour, turmeric"},
            {"name": "Chole with Brown Rice", "calories": 480, "protein_g": 20, "carbs_g": 72, "fat_g": 10, "fiber_g": 14,
             "recipe": "Cook chickpeas in onion-tomato masala with chole spices. Serve with brown rice.",
             "ingredients": "Chickpeas, brown rice, onion, tomato, ginger, garlic, chole masala, amchur"},
            {"name": "Palak Paneer with Roti", "calories": 440, "protein_g": 22, "carbs_g": 48, "fat_g": 18, "fiber_g": 6,
             "recipe": "Blend spinach, cook with paneer cubes in a mild cream sauce. Serve with roti.",
             "ingredients": "Spinach, paneer, onion, tomato, cream, garlic, garam masala, wheat flour"},
            {"name": "Vegetable Pulao with Raita", "calories": 400, "protein_g": 12, "carbs_g": 62, "fat_g": 10, "fiber_g": 5,
             "recipe": "Cook rice with mixed vegetables and whole spices. Serve with yogurt raita.",
             "ingredients": "Basmati rice, mixed vegetables, yogurt, cucumber, cumin, bay leaf, cardamom"},
        ],
        "dinner": [
            {"name": "Mixed Vegetable Curry with Roti", "calories": 380, "protein_g": 14, "carbs_g": 52, "fat_g": 12, "fiber_g": 8,
             "recipe": "Cook seasonal vegetables in a mildly spiced onion-tomato gravy. Serve with roti.",
             "ingredients": "Mixed vegetables, onion, tomato, ginger, garlic, garam masala, wheat flour"},
            {"name": "Masoor Dal with Jeera Rice", "calories": 400, "protein_g": 18, "carbs_g": 60, "fat_g": 8, "fiber_g": 10,
             "recipe": "Cook red lentils until soft, temper with cumin. Serve with jeera rice.",
             "ingredients": "Masoor dal, rice, cumin seeds, ghee, turmeric, tomato, onion"},
            {"name": "Paneer Bhurji with Paratha", "calories": 460, "protein_g": 24, "carbs_g": 45, "fat_g": 20, "fiber_g": 4,
             "recipe": "Scramble paneer with onion, tomato, green chili, and spices. Serve with paratha.",
             "ingredients": "Paneer, onion, tomato, green chili, turmeric, wheat flour, oil"},
            {"name": "Baingan Bharta with Roti", "calories": 340, "protein_g": 10, "carbs_g": 48, "fat_g": 12, "fiber_g": 7,
             "recipe": "Roast eggplant, mash, and cook with onion-tomato masala. Serve with roti.",
             "ingredients": "Eggplant, onion, tomato, green chili, garlic, mustard oil, wheat flour"},
        ],
        "snack": [
            {"name": "Roasted Makhana", "calories": 150, "protein_g": 5, "carbs_g": 20, "fat_g": 5, "fiber_g": 2,
             "recipe": "Dry roast fox nuts with a pinch of salt and turmeric.",
             "ingredients": "Fox nuts (makhana), ghee, salt, turmeric"},
            {"name": "Fruit Chaat", "calories": 140, "protein_g": 2, "carbs_g": 32, "fat_g": 1, "fiber_g": 4,
             "recipe": "Mix seasonal fruits with chaat masala and lemon juice.",
             "ingredients": "Apple, banana, pomegranate, chaat masala, lemon, black salt"},
            {"name": "Sprouts Salad", "calories": 180, "protein_g": 12, "carbs_g": 24, "fat_g": 3, "fiber_g": 6,
             "recipe": "Mix sprouted moong with onion, tomato, lemon, and spices.",
             "ingredients": "Sprouted moong, onion, tomato, lemon, green chili, coriander, chaat masala"},
            {"name": "Buttermilk (Chaas)", "calories": 60, "protein_g": 3, "carbs_g": 5, "fat_g": 2, "fiber_g": 0,
             "recipe": "Blend yogurt with water, roasted cumin, salt, and coriander.",
             "ingredients": "Yogurt, water, roasted cumin, salt, coriander leaves"},
        ],
    },
    "non-veg": {
        "breakfast": [
            {"name": "Egg Bhurji with Toast", "calories": 350, "protein_g": 22, "carbs_g": 30, "fat_g": 16, "fiber_g": 2,
             "recipe": "Scramble eggs with onion, tomato, green chili. Serve with whole wheat toast.",
             "ingredients": "Eggs, onion, tomato, green chili, bread, butter, salt, pepper"},
            {"name": "Boiled Eggs with Fruits", "calories": 280, "protein_g": 18, "carbs_g": 28, "fat_g": 10, "fiber_g": 3,
             "recipe": "Boil eggs, serve with sliced fruits and a pinch of salt and pepper.",
             "ingredients": "Eggs, banana, apple, salt, pepper"},
        ],
        "lunch": [
            {"name": "Chicken Curry with Rice", "calories": 520, "protein_g": 35, "carbs_g": 55, "fat_g": 16, "fiber_g": 3,
             "recipe": "Cook chicken in onion-tomato gravy with Indian spices. Serve with rice.",
             "ingredients": "Chicken, rice, onion, tomato, ginger, garlic, garam masala, turmeric"},
            {"name": "Fish Curry with Roti", "calories": 440, "protein_g": 32, "carbs_g": 42, "fat_g": 14, "fiber_g": 3,
             "recipe": "Cook fish in mustard-based curry with tomato and spices. Serve with roti.",
             "ingredients": "Fish, mustard, tomato, onion, turmeric, red chili, wheat flour"},
        ],
        "dinner": [
            {"name": "Tandoori Chicken with Salad", "calories": 380, "protein_g": 40, "carbs_g": 12, "fat_g": 18, "fiber_g": 3,
             "recipe": "Marinate chicken in yogurt and spices, grill until charred. Serve with salad.",
             "ingredients": "Chicken, yogurt, red chili, garam masala, lemon, cucumber, onion, lettuce"},
            {"name": "Egg Curry with Jeera Rice", "calories": 420, "protein_g": 20, "carbs_g": 52, "fat_g": 14, "fiber_g": 3,
             "recipe": "Hard-boil eggs, simmer in onion-tomato gravy. Serve with jeera rice.",
             "ingredients": "Eggs, rice, onion, tomato, cumin, turmeric, garam masala, coriander"},
        ],
        "snack": [
            {"name": "Chicken Tikka (4 pcs)", "calories": 200, "protein_g": 28, "carbs_g": 4, "fat_g": 8, "fiber_g": 0,
             "recipe": "Marinate chicken cubes in yogurt-spice mix, grill on high heat.",
             "ingredients": "Chicken breast, yogurt, red chili, garam masala, lemon, ginger-garlic paste"},
        ],
    },
}


class NutritionService:

    @staticmethod
    def calculate_macro_targets(calorie_target: int, goal: str) -> dict:
        """Return macro split in grams based on goal."""
        splits = {
            "weight_loss":  {"protein": 0.35, "carbs": 0.35, "fat": 0.30},
            "muscle_gain":  {"protein": 0.35, "carbs": 0.45, "fat": 0.20},
            "maintenance":  {"protein": 0.30, "carbs": 0.40, "fat": 0.30},
            "flexibility":  {"protein": 0.25, "carbs": 0.45, "fat": 0.30},
            "endurance":    {"protein": 0.25, "carbs": 0.50, "fat": 0.25},
        }
        ratios = splits.get((goal or "maintenance").lower(), splits["maintenance"])
        return {
            "protein_g": round(calorie_target * ratios["protein"] / 4),
            "carbs_g": round(calorie_target * ratios["carbs"] / 4),
            "fat_g": round(calorie_target * ratios["fat"] / 9),
            "fiber_g": 30,
        }

    @classmethod
    def generate_meal_plan(
        cls,
        calorie_target: int = 2000,
        diet_type: str = "vegetarian",
        allergies: Optional[str] = None,
        cuisine_preference: str = "indian",
        duration_days: int = 7,
        goal: str = "maintenance",
    ) -> dict:
        """Return a structured 7-day meal plan dict."""
        dtype = (diet_type or "vegetarian").lower()
        if dtype not in MEAL_DB:
            dtype = "vegetarian"
        pool = MEAL_DB[dtype]

        allergy_list = [a.strip().lower() for a in (allergies or "").split(",") if a.strip()]
        macros = cls.calculate_macro_targets(calorie_target, goal)

        # Distribute calories across meals
        meal_cal = {
            "breakfast": round(calorie_target * 0.25),
            "lunch":     round(calorie_target * 0.35),
            "dinner":    round(calorie_target * 0.30),
            "snack":     round(calorie_target * 0.10),
        }

        days = []
        for day_num in range(1, duration_days + 1):
            day_meals = []
            day_total_cal = 0
            for meal_type in ("breakfast", "lunch", "dinner", "snack"):
                options = pool.get(meal_type, [])
                # Filter out allergens
                safe = [m for m in options if not any(
                    allergen in m.get("ingredients", "").lower() for allergen in allergy_list
                )]
                if not safe:
                    safe = options
                if not safe:
                    continue
                chosen = random.choice(safe)
                # Scale portions to roughly match target
                target_cal = meal_cal[meal_type]
                scale = target_cal / chosen["calories"] if chosen["calories"] else 1
                meal = {
                    "day_number": day_num,
                    "meal_type": meal_type,
                    "name": chosen["name"],
                    "calories": round(chosen["calories"] * scale),
                    "protein_g": round(chosen["protein_g"] * scale, 1),
                    "carbs_g": round(chosen["carbs_g"] * scale, 1),
                    "fat_g": round(chosen["fat_g"] * scale, 1),
                    "fiber_g": round(chosen.get("fiber_g", 3) * scale, 1),
                    "recipe": chosen.get("recipe", ""),
                    "ingredients": chosen.get("ingredients", ""),
                }
                day_meals.append(meal)
                day_total_cal += meal["calories"]

            days.append({
                "day_number": day_num,
                "meals": day_meals,
                "total_calories": day_total_cal,
            })

        return {
            "calorie_target": calorie_target,
            "diet_type": dtype,
            "duration_days": duration_days,
            "macro_targets": macros,
            "days": days,
        }
