from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from typing import Optional, Dict, Any, List
from backend.models import NutritionAnalysisResponse, FoodLogEntry
from backend.services.vision_analyzer import vision_analyzer
from backend.services.knowledge_base import NUTRITION_DATABASE
from backend.database import add_food_log, get_food_logs
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/nutrition", tags=["Nutrition Analysis"])

@router.get("/samples")
def get_nutrition_samples():
    """Returns sample food recognition items for quick interactive testing."""
    samples = []
    for key, val in NUTRITION_DATABASE.items():
        samples.append({
            "id": key,
            "dish_name": val["dish_name"],
            "category": val["category"],
            "calories": val["total_calories"],
            "nutri_score": val["nutri_score"],
            "protein": val["macronutrients"]["protein"],
            "carbs": val["macronutrients"]["carbs"],
            "fat": val["macronutrients"]["fat"]
        })
    return samples

@router.post("/analyze", response_model=NutritionAnalysisResponse)
async def analyze_food(
    query: Optional[str] = Form(None),
    sample_id: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Multimodal visual recognition and nutrition decomposition.
    Accepts raw image file uploads, sample presets, or text queries.
    Rejects non-food images using PyTorch computer vision.
    """
    image_bytes = None
    if image:
        image_bytes = await image.read()
    result = vision_analyzer.analyze_nutrition(query=query, sample_id=sample_id, image_bytes=image_bytes)
    return result

@router.post("/log")
def log_meal(entry: Dict[str, Any]):
    """Logs an analyzed meal to the user's daily food journal."""
    log_id = f"log-{uuid.uuid4().hex[:8]}"
    record = {
        "id": log_id,
        "timestamp": entry.get("timestamp", datetime.now().strftime("%Y-%m-%d %H:%M")),
        "meal_type": entry.get("meal_type", "Lunch"),
        "dish_name": entry.get("dish_name", "Analyzed Meal"),
        "calories": entry.get("calories", 400),
        "protein": entry.get("protein", 20.0),
        "carbs": entry.get("carbs", 35.0),
        "fat": entry.get("fat", 15.0),
        "fiber": entry.get("fiber", 5.0),
        "nutri_score": entry.get("nutri_score", "A")
    }
    saved = add_food_log(record)
    return {"status": "success", "message": "Meal logged to daily journal", "data": saved}

@router.get("/logs", response_model=List[Dict[str, Any]])
def list_logs():
    return get_food_logs()
