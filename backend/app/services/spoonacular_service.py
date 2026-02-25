"""Spoonacular API service — recipe and nutrition data (shell for Activity 3.3)."""

import os
from typing import Optional, List

import httpx

BASE_URL = "https://api.spoonacular.com"


class SpoonacularService:

    @staticmethod
    def _api_key() -> Optional[str]:
        key = os.getenv("SPOONACULAR_API_KEY")
        return key if key and not key.startswith("your_") else None

    @classmethod
    def search_recipes(cls, query: str, diet: str = "", max_results: int = 5) -> List[dict]:
        """Search Spoonacular for recipes matching a query."""
        api_key = cls._api_key()
        if not api_key:
            return []

        params = {
            "query": query,
            "number": max_results,
            "apiKey": api_key,
            "addRecipeNutrition": True,
        }
        if diet:
            params["diet"] = diet

        try:
            resp = httpx.get(f"{BASE_URL}/recipes/complexSearch", params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            results = []
            for item in data.get("results", []):
                nutrition = item.get("nutrition", {})
                nutrients = {n["name"]: n["amount"] for n in nutrition.get("nutrients", [])}
                results.append({
                    "id": item["id"],
                    "title": item["title"],
                    "image": item.get("image", ""),
                    "calories": nutrients.get("Calories", 0),
                    "protein_g": nutrients.get("Protein", 0),
                    "carbs_g": nutrients.get("Carbohydrates", 0),
                    "fat_g": nutrients.get("Fat", 0),
                })
            return results
        except Exception:
            return []

    @classmethod
    def get_recipe_details(cls, recipe_id: int) -> Optional[dict]:
        """Get detailed recipe information from Spoonacular."""
        api_key = cls._api_key()
        if not api_key:
            return None

        try:
            resp = httpx.get(
                f"{BASE_URL}/recipes/{recipe_id}/information",
                params={"apiKey": api_key, "includeNutrition": True},
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "id": data["id"],
                "title": data["title"],
                "ready_in_minutes": data.get("readyInMinutes"),
                "servings": data.get("servings"),
                "instructions": data.get("instructions", ""),
                "ingredients": [i["original"] for i in data.get("extendedIngredients", [])],
                "image": data.get("image", ""),
            }
        except Exception:
            return None
