import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.database import init_db
from backend.routers.nutrition import router as nutrition_router
from backend.routers.freshness import router as freshness_router
from backend.routers.hygiene import router as hygiene_router
from backend.routers.cooking import router as cooking_router
from backend.routers.pantry import router as pantry_router
from backend.routers.analytics import router as analytics_router

# Initialize database schema and seeds
init_db()

app = FastAPI(
    title="FoodVerse AI – Multimodal Food Intelligence Agent",
    description="Multimodal AI-powered platform integrating vision, video analysis, and LLM reasoning for nutrition, freshness, kitchen hygiene, and smart cooking.",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount modular API routers
app.include_router(nutrition_router)
app.include_router(freshness_router)
app.include_router(hygiene_router)
app.include_router(cooking_router)
app.include_router(pantry_router)
app.include_router(analytics_router)

@app.get("/api/status")
def status():
    return {
        "platform": "FoodVerse AI",
        "role": "Multimodal Food Intelligence Agent",
        "status": "online",
        "version": "1.0.0",
        "capabilities": [
            "Food Recognition & Nutrition Analysis",
            "Food Freshness & Spoilage Detection",
            "Restaurant Hygiene & Safety Monitoring",
            "Smart Cooking Assistance & Personalized Meal Planning"
        ],
        "docs_url": "/docs"
    }

# Serve built frontend static bundle if dist exists
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        # Do not intercept API routes
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)

