import io
import os
import sys
import asyncio
import httpx
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.main import app

def get_valid_food_image() -> bytes:
    """Loads a real food photograph (banana or pizza)."""
    img_path = os.path.join(os.path.dirname(__file__), "real_banana.jpg")
    if os.path.exists(img_path):
        with open(img_path, "rb") as f:
            return f.read()
    # Fallback if file missing
    img = Image.new("RGB", (224, 224), color=(255, 255, 255))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def get_non_food_landscape_image() -> bytes:
    """Loads a real landscape photograph containing mountains and lake."""
    img_path = os.path.join(os.path.dirname(__file__), "real_landscape.jpg")
    if os.path.exists(img_path):
        with open(img_path, "rb") as f:
            return f.read()
    # Fallback synthetic landscape
    img = Image.new("RGB", (224, 224), color=(135, 206, 235))
    draw = ImageDraw.Draw(img)
    draw.polygon([(0, 224), (112, 90), (224, 224)], fill=(120, 120, 120))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def get_invalid_corrupted_image() -> bytes:
    """Generates corrupted non-image text bytes."""
    return b"CORRUPTED_NON_IMAGE_DATA_1234567890_NOT_AN_IMAGE_FILE"

async def run_tests():
    print("\n=======================================================")
    print("  Running Food Recognition & Nutrition Test Suite")
    print("=======================================================")
    
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        
        # 1. Test Valid Food Image
        print("\n[TEST 1] Uploading Valid Food Image (Banana)...")
        food_bytes = get_valid_food_image()
        files = {"image": ("food.jpg", food_bytes, "image/jpeg")}
        res = await client.post("/api/nutrition/analyze", files=files)
        
        print("  HTTP Status Code:", res.status_code)
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        data = res.json()
        print("  Identified Dish:", data.get("dish_name"))
        print(f"  Nutritional Estimates: {data.get('total_calories')} kcal | {data['macronutrients']['protein']}g Protein | {data['macronutrients']['carbs']}g Carbs | {data['macronutrients']['fat']}g Fat")
        assert data.get("dish_name") == "Banana", f"Expected Banana, got {data.get('dish_name')}"
        assert data.get("total_calories") == 105
        assert data["macronutrients"]["protein"] == 1.3
        print("  >> PASSED: Valid food image successfully classified by MobileNetV3 with authentic nutritional facts.")

        # 2. Test Non-Food Landscape Image
        print("\n[TEST 2] Uploading Non-Food Landscape Image (Scenic Mountains & Lake)...")
        landscape_bytes = get_non_food_landscape_image()
        files = {"image": ("landscape.jpg", landscape_bytes, "image/jpeg")}
        res = await client.post("/api/nutrition/analyze", files=files)
        
        print("  HTTP Status Code:", res.status_code)
        assert res.status_code == 422, f"Expected 422, got {res.status_code}: {res.text}"
        error_detail = res.json().get("detail", "")
        print("  Server Error Message:", error_detail)
        assert "No recognizable food detected" in error_detail
        print("  >> PASSED: Non-food landscape rejected without returning fabricated nutrition.")

        # 3. Test Invalid Corrupted Image Upload
        print("\n[TEST 3] Uploading Invalid Corrupted Non-Image Payload...")
        invalid_bytes = get_invalid_corrupted_image()
        files = {"image": ("corrupted.txt", invalid_bytes, "text/plain")}
        res = await client.post("/api/nutrition/analyze", files=files)
        
        print("  HTTP Status Code:", res.status_code)
        assert res.status_code == 400, f"Expected 400, got {res.status_code}: {res.text}"
        error_detail = res.json().get("detail", "")
        print("  Server Error Message:", error_detail)
        assert "Invalid image file format" in error_detail or "corrupted" in error_detail
        print("  >> PASSED: Invalid non-image payload rejected with clean HTTP 400 error.")

    print("\n=======================================================")
    print("  ALL 3 TESTS PASSED SUCCESSFULLY!")
    print("=======================================================\n")

if __name__ == "__main__":
    asyncio.run(run_tests())
