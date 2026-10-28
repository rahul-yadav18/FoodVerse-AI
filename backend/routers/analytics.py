from fastapi import APIRouter
from typing import Dict, Any
from backend.database import get_food_logs, get_all_pantry, get_hygiene_audits

router = APIRouter(prefix="/api/analytics", tags=["Platform Analytics"])

@router.get("/summary")
def get_analytics_summary() -> Dict[str, Any]:
    logs = get_food_logs()
    pantry = get_all_pantry()
    audits = get_hygiene_audits()

    total_calories_today = sum(l.get("calories", 0) for l in logs)
    total_protein_today = round(sum(l.get("protein", 0.0) for l in logs), 1)
    total_carbs_today = round(sum(l.get("carbs", 0.0) for l in logs), 1)
    total_fat_today = round(sum(l.get("fat", 0.0) for l in logs), 1)

    expiring_soon_count = sum(1 for p in pantry if p.get("days_left", 0) <= 2)
    latest_hygiene_score = audits[0].get("overall_score", 95) if audits else 95
    latest_hygiene_grade = audits[0].get("grade", "A") if audits else "A"

    return {
        "nutrition_summary": {
            "daily_calories": total_calories_today,
            "daily_calorie_target": 2100,
            "calorie_progress_pct": min(100, int((total_calories_today / 2100) * 100)) if total_calories_today else 0,
            "protein_g": total_protein_today,
            "carbs_g": total_carbs_today,
            "fat_g": total_fat_today,
            "meals_logged": len(logs)
        },
        "pantry_summary": {
            "total_items": len(pantry),
            "expiring_soon": expiring_soon_count,
            "fresh_items": len(pantry) - expiring_soon_count
        },
        "hygiene_summary": {
            "latest_score": latest_hygiene_score,
            "latest_grade": latest_hygiene_grade,
            "total_inspections": len(audits),
            "active_alerts": 1 if latest_hygiene_score < 75 else 0
        }
    }
