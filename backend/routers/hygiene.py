from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from typing import Optional, Dict, Any, List
from backend.models import HygieneInspectionResponse
from backend.services.vision_analyzer import vision_analyzer
from backend.services.knowledge_base import HYGIENE_DATABASE
from backend.database import add_hygiene_audit, get_hygiene_audits

router = APIRouter(prefix="/api/hygiene", tags=["Hygiene & Safety Monitoring"])

@router.get("/samples")
def get_hygiene_samples():
    """Returns sample inspection scenarios (e.g. Cross-contamination risk vs. Compliant Line)."""
    samples = []
    for key, val in HYGIENE_DATABASE.items():
        samples.append({
            "id": key,
            "title": "Kitchen Line Violation Detection" if "violation" in key else "Full Compliance Prep Station",
            "inspection_type": val["inspection_type"],
            "score": val["overall_score"],
            "grade": val["grade"],
            "pass_status": val["pass_status"]
        })
    return samples

@router.post("/analyze", response_model=HygieneInspectionResponse)
async def analyze_hygiene_inspection(
    scene_description: Optional[str] = Form(None),
    sample_id: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Multimodal video/image surveillance inspection audit.
    Identifies PPE compliance, cross-contamination proximity, cleanliness grade.
    """
    image_data = None
    if image:
        content = await image.read()
    result = vision_analyzer.analyze_hygiene(scene_description=scene_description, sample_id=sample_id, image_data=image_data)
    # Save audit record
    add_hygiene_audit(result)
    return result

@router.get("/audits", response_model=List[Dict[str, Any]])
def list_hygiene_audits():
    """Retrieves historical hygiene audit logs."""
    return get_hygiene_audits()
