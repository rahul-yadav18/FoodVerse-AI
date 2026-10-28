from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.models import (
    LeftoverRecipeRequest,
    GeneratedRecipe,
    UserProfileRequest,
    MealPlanResponse
)
from backend.services.cooking_agent import cooking_agent

router = APIRouter(prefix="/api/cooking", tags=["Smart Cooking & Meal Planning"])

@router.post("/leftover-recipes", response_model=List[GeneratedRecipe])
def generate_recipes_from_leftovers(req: LeftoverRecipeRequest):
    """
    Zero-waste culinary generator: crafts bespoke recipes from supplied pantry leftovers.
    """
    if not req.available_ingredients:
        ingredients = ["Eggs", "Spinach", "Tomatoes"]
    else:
        ingredients = req.available_ingredients
    return cooking_agent.generate_leftover_recipes(
        ingredients=ingredients,
        dietary_pref=req.dietary_preference or "Any",
        cooking_skill=req.cooking_skill or "Intermediate",
        max_time=req.max_time_minutes or 30
    )

@router.post("/meal-plan", response_model=MealPlanResponse)
def generate_meal_plan(profile: UserProfileRequest):
    """
    Biometrically calibrated meal planner using BMR/TDEE calculations and goal optimization.
    """
    return cooking_agent.generate_personalized_meal_plan(profile.model_dump())
