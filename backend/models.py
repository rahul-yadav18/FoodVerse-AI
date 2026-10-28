from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ----------------- Module 1: Food Recognition & Nutrition -----------------
class Micronutrient(BaseModel):
    name: str
    amount: str
    daily_value_pct: int

class DetectedFoodComponent(BaseModel):
    name: str
    portion: str
    calories: int
    protein: float
    carbs: float
    fat: float
    fiber: float
    confidence: float
    bounding_box: Optional[List[float]] = None  # [x, y, width, height] in %

class NutritionAnalysisResponse(BaseModel):
    dish_name: str
    category: str
    cuisine: str
    total_calories: int
    serving_size: str
    macronutrients: Dict[str, float]  # protein, carbs, fat, fiber, sugar, sodium
    micronutrients: List[Micronutrient]
    glycemic_index: int
    glycemic_load: str  # Low, Medium, High
    nutri_score: str  # A, B, C, D, E
    health_rating: int  # 0-100
    dietary_tags: List[str]  # Vegan, Keto, Gluten-Free, Diabetic-Friendly
    allergens: List[str]  # e.g., Dairy, Nuts, Gluten
    components: List[DetectedFoodComponent]
    insights: List[str]
    health_advice: str

# ----------------- Module 2: Freshness & Spoilage Detection -----------------
class SpoilageMarker(BaseModel):
    feature: str  # e.g., "Surface Browning", "Moisture Loss", "Mould/Spores"
    severity: str  # None, Low, Moderate, High
    percentage: int
    description: str

class StorageOptimization(BaseModel):
    optimal_temperature_c: str
    ideal_humidity: str
    best_container: str
    ethylene_gas_sensitivity: str
    storage_tips: List[str]

class FreshnessAssessmentResponse(BaseModel):
    item_name: str
    category: str  # Fruits, Vegetables, Meat, Dairy, Bakery, Seafood
    freshness_score: int  # 0 to 100
    status: str  # "Peak Freshness", "Good Condition", "Consume Soon", "Onset Spoilage", "Spoiled / Discard"
    status_color: str  # hex or badge code
    estimated_shelf_life_days: int
    shelf_life_cold_days: int
    shelf_life_freezer_days: int
    spoilage_markers: List[SpoilageMarker]
    storage_advice: StorageOptimization
    safety_verdict: str
    safe_to_eat: bool
    cooking_alternatives_if_ripe: List[str]  # e.g., "Use overripe bananas for banana bread"

# ----------------- Module 3: Restaurant Hygiene & Safety -----------------
class HygieneBoundingBox(BaseModel):
    label: str  # e.g. "Hairnet [COMPLIANT]", "Cross-Contamination Hazard", "Gloves [COMPLIANT]"
    type: str  # "success", "danger", "warning", "info"
    box: List[float]  # [x, y, w, h] %
    confidence: float
    details: str

class HygieneViolation(BaseModel):
    id: str
    severity: str  # "Critical", "Major", "Minor"
    category: str  # "Cross-Contamination", "PPE Compliance", "Sanitation", "Temperature Control", "Waste Disposal"
    description: str
    haccp_fda_code: str
    corrective_action: str

class HygieneInspectionResponse(BaseModel):
    inspection_id: str
    timestamp: str
    inspection_type: str  # "Kitchen Line", "Prep Station", "Walk-in Storage", "Dining Area"
    overall_score: int  # 0 - 100
    grade: str  # A+, A, B, C, Failed
    pass_status: bool
    summary: str
    detections: List[HygieneBoundingBox]
    violations: List[HygieneViolation]
    positive_practices: List[str]
    cleanliness_metrics: Dict[str, int]  # PPE compliance %, Surface Sanitation %, Temperature Compliance %
    recommended_actions: List[str]

# ----------------- Module 4: Smart Cooking & Meal Planning -----------------
class RecipeStep(BaseModel):
    step_number: int
    instruction: str
    timer_seconds: Optional[int] = None
    tip: Optional[str] = None
    image_url: Optional[str] = None

class GeneratedRecipe(BaseModel):
    id: str
    title: str
    description: str
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    difficulty: str
    calories_per_serving: int
    used_ingredients: List[str]
    missing_pantry_staples: List[str]
    tags: List[str]
    steps: List[RecipeStep]
    chef_secret_tip: str

class LeftoverRecipeRequest(BaseModel):
    available_ingredients: List[str]
    dietary_preference: Optional[str] = "Any"
    cooking_skill: Optional[str] = "Intermediate"
    max_time_minutes: Optional[int] = 30

class UserProfileRequest(BaseModel):
    age: int = 28
    gender: str = "Male"
    weight_kg: float = 72.0
    height_cm: float = 175.0
    activity_level: str = "Moderately Active"
    health_goal: str = "Weight Loss"  # Muscle Gain, Weight Loss, Maintenance, Diabetic Care, Heart Health
    diet_type: str = "Balanced"  # Keto, Vegan, Mediterranean, High-Protein, Low-Carb
    daily_calorie_target: Optional[int] = 2000
    allergies: List[str] = []

class MealPlanDay(BaseModel):
    day: str
    total_calories: int
    macros: Dict[str, float]
    breakfast: Dict[str, Any]
    lunch: Dict[str, Any]
    dinner: Dict[str, Any]
    snack: Dict[str, Any]

class MealPlanResponse(BaseModel):
    plan_id: str
    goal: str
    target_calories_daily: int
    macro_distribution: Dict[str, str]
    days: List[MealPlanDay]
    grocery_list: Dict[str, List[str]]
    hydration_advice: str

# ----------------- Pantry & Logs -----------------
class PantryItem(BaseModel):
    id: str
    name: str
    category: str
    purchase_date: str
    expiry_date: str
    days_left: int
    freshness_status: str
    quantity: str

class FoodLogEntry(BaseModel):
    id: str
    timestamp: str
    meal_type: str  # Breakfast, Lunch, Dinner, Snack
    dish_name: str
    calories: int
    protein: float
    carbs: float
    fat: float
    nutri_score: str
