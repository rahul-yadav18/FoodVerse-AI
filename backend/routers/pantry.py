from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.models import PantryItem
from backend.database import get_all_pantry, add_pantry_item, delete_pantry_item
import uuid
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/pantry", tags=["Pantry Inventory"])

@router.get("/items", response_model=List[PantryItem])
def list_pantry_items():
    return get_all_pantry()

@router.post("/items", response_model=PantryItem)
def create_pantry_item(item: Dict[str, Any]):
    item_id = f"p-{uuid.uuid4().hex[:6]}"
    days = int(item.get("days_left", 3))
    today = datetime.now()
    record = {
        "id": item_id,
        "name": item.get("name", "New Item"),
        "category": item.get("category", "General"),
        "purchase_date": today.strftime("%Y-%m-%d"),
        "expiry_date": (today + timedelta(days=days)).strftime("%Y-%m-%d"),
        "days_left": days,
        "freshness_status": item.get("freshness_status", "Good Condition"),
        "quantity": item.get("quantity", "1 unit"),
        "notes": item.get("notes", "")
    }
    return add_pantry_item(record)

@router.delete("/items/{item_id}")
def remove_pantry_item(item_id: str):
    delete_pantry_item(item_id)
    return {"status": "success", "message": f"Item {item_id} removed"}
