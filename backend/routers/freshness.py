from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from typing import Optional, Dict, Any, List
from backend.models import FreshnessAssessmentResponse
from backend.services.vision_analyzer import vision_analyzer
from backend.services.knowledge_base import FRESHNESS_DATABASE
from backend.database import add_pantry_item
import uuid
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/freshness", tags=["Freshness & Spoilage"])

@router.get("/samples")
def get_freshness_samples():
    """Returns sample produce/meat freshness profiles."""
    samples = []
    for key, val in FRESHNESS_DATABASE.items():
        samples.append({
            "id": key,
            "item_name": val["item_name"],
            "category": val["category"],
            "freshness_score": val["freshness_score"],
            "status": val["status"],
            "status_color": val["status_color"],
            "shelf_life_days": val["estimated_shelf_life_days"]
        })
    return samples

@router.post("/analyze", response_model=FreshnessAssessmentResponse)
async def analyze_freshness(
    item_name: Optional[str] = Form(None),
    sample_id: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Multimodal visual spoilage analysis and shelf-life prediction.
    """
    image_data = None
    if image:
        content = await image.read()
    result = vision_analyzer.analyze_freshness(item_name=item_name, sample_id=sample_id, image_data=image_data)
    return result

@router.post("/save-to-pantry")
def save_scanned_to_pantry(payload: Dict[str, Any]):
    """Adds the analyzed item to pantry inventory tracking with calculated expiration."""
    days = payload.get("estimated_shelf_life_days", 3)
    today = datetime.now()
    item_id = f"p-{uuid.uuid4().hex[:6]}"
    record = {
        "id": item_id,
        "name": payload.get("item_name", "Produce Item"),
        "category": payload.get("category", "Produce"),
        "purchase_date": today.strftime("%Y-%m-%d"),
        "expiry_date": (today + timedelta(days=days)).strftime("%Y-%m-%d"),
        "days_left": days,
        "freshness_status": payload.get("status", "Good Condition"),
        "quantity": payload.get("quantity", "1 batch"),
        "notes": payload.get("safety_verdict", "Monitored by FoodVerse AI")
    }
    saved = add_pantry_item(record)
    return {"status": "success", "message": "Item added to Pantry Expiry Radar", "item": saved}
