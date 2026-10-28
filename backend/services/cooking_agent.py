import random
import uuid
from typing import List, Dict, Any, Optional

class CookingAgentService:
    def generate_leftover_recipes(self, ingredients: List[str], dietary_pref: str = "Any", cooking_skill: str = "Intermediate", max_time: int = 30) -> List[Dict[str, Any]]:
        ing_str = ", ".join(ingredients).lower()
        recipes = []

        # Recipe 1: Golden Stir-Fry or Skillet Scramble
        r1_id = f"rec-{uuid.uuid4().hex[:6]}"
        r1_title = f"Quick Pantry Skillet with {ingredients[0].title() if ingredients else 'Fresh Greens'}"
        recipes.append({
            "id": r1_id,
            "title": r1_title,
            "description": f"A vibrant 15-minute high-heat sauté turning {', '.join(ingredients[:3])} into a fragrant, balanced meal.",
            "prep_time_minutes": 8,
            "cook_time_minutes": 12,
            "servings": 2,
            "difficulty": "Easy",
            "calories_per_serving": 340,
            "used_ingredients": ingredients,
            "missing_pantry_staples": ["Olive oil", "Garlic cloves", "Black pepper", "Sea salt"],
            "tags": ["Quick & Easy", "Zero Waste", "High Satiety"],
            "steps": [
                {
                    "step_number": 1,
                    "instruction": f"Prep ingredients: finely dice garlic, slice {', '.join(ingredients[:2])} into uniform bite-sized pieces for even cooking.",
                    "timer_seconds": 180,
                    "tip": "Uniform cuts ensure everything cooks at the exact same rate without scorching."
                },
                {
                    "step_number": 2,
                    "instruction": "Heat a heavy skillet or wok over medium-high flame with 1 tablespoon of olive oil until shimmering.",
                    "timer_seconds": 90,
                    "tip": "A hot pan prevents veggies and proteins from releasing water and getting soggy."
                },
                {
                    "step_number": 3,
                    "instruction": f"Add {ingredients[0] if ingredients else 'the firm ingredients'} to the pan. Sauté vigorously, tossing continuously for 4 minutes.",
                    "timer_seconds": 240,
                    "tip": "Listen for the steady sizzle. Add a splash of soy sauce or tamari for umami."
                },
                {
                    "step_number": 4,
                    "instruction": f"Toss in remaining {', '.join(ingredients[1:]) if len(ingredients) > 1 else 'herbs'} and season with cracked black pepper and a squeeze of fresh lemon juice.",
                    "timer_seconds": 120,
                    "tip": "Acid brightens up cooked flavors and balances rich oils."
                },
                {
                    "step_number": 5,
                    "instruction": "Plate hot and garnish with toasted sesame seeds or chili crisp if desired. Serve immediately!",
                    "timer_seconds": None,
                    "tip": "Enjoy piping hot for the crunchiest texture."
                }
            ],
            "chef_secret_tip": "Deglaze the skillet with 2 tablespoons of vegetable broth or dry white wine to lift the deeply caramelized fond from the bottom of the pan."
        })

        # Recipe 2: Comfort Bowl or Frittata / Warm Stew
        r2_id = f"rec-{uuid.uuid4().hex[:6]}"
        r2_title = f"Rustic Mediterranean Frittata & Herb Melange"
        recipes.append({
            "id": r2_id,
            "title": r2_title,
            "description": f"Fluffy baked egg and pantry skillet loaded with tender vegetables and savory aromatics.",
            "prep_time_minutes": 10,
            "cook_time_minutes": 18,
            "servings": 3,
            "difficulty": "Intermediate",
            "calories_per_serving": 290,
            "used_ingredients": [i for i in ingredients if i.lower() not in ["sugar", "cereal"]],
            "missing_pantry_staples": ["4 Whole Eggs", "Feta or Cheddar cheese", "Dried oregano"],
            "tags": ["Protein Rich", "Meal Prep Friendly", "Gluten-Free"],
            "steps": [
                {
                    "step_number": 1,
                    "instruction": "Preheat your oven to 190°C (375°F). Whisk 4 eggs in a bowl with a pinch of sea salt, black pepper, and 2 tbsp water or milk until frothy.",
                    "timer_seconds": 120,
                    "tip": "Whisking incorporates air bubbles, making your frittata exceptionally light and velvety."
                },
                {
                    "step_number": 2,
                    "instruction": f"In an oven-safe skillet, sauté {', '.join(ingredients[:2])} in olive oil over medium heat until tender-crisp.",
                    "timer_seconds": 300,
                    "tip": "Pre-cooking moisture-rich veggies prevents a watery frittata."
                },
                {
                    "step_number": 3,
                    "instruction": "Pour the whisked egg mixture evenly across the vegetables. Let the bottom set on stove-top for 2 minutes undisturbed.",
                    "timer_seconds": 120,
                    "tip": "Do not stir once poured to achieve a continuous golden crust."
                },
                {
                    "step_number": 4,
                    "instruction": "Transfer the skillet into the oven and bake for 10 to 12 minutes until the center is gently puffed and set.",
                    "timer_seconds": 660,
                    "tip": "It should have a very slight jiggle in the dead center when ready."
                },
                {
                    "step_number": 5,
                    "instruction": "Remove carefully with oven mitts, let cool for 3 minutes, slice into wedges and serve with warm crusty toast.",
                    "timer_seconds": 180,
                    "tip": "Keeps well in the fridge for up to 3 days of quick breakfasts."
                }
            ],
            "chef_secret_tip": "Sprinkle smoked paprika or crumbled goat cheese over the top before sliding into the oven for a caramelized savory crust."
        })

        return recipes

    def generate_personalized_meal_plan(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates metabolic requirements (BMR, TDEE) and builds a personalized daily/weekly meal plan.
        """
        age = profile.get("age", 28)
        gender = profile.get("gender", "Male")
        weight = profile.get("weight_kg", 72.0)
        height = profile.get("height_cm", 175.0)
        goal = profile.get("health_goal", "Weight Loss")
        diet = profile.get("diet_type", "Balanced")

        # Mifflin-St Jeor BMR Equation
        if gender.lower() == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

        activity_multiplier = 1.4  # Moderate activity
        tdee = int(bmr * activity_multiplier)

        # Caloric target based on goal
        if "loss" in goal.lower():
            target_cal = max(1400, tdee - 450)
            macro_dist = {"protein": "30%", "carbs": "40%", "fat": "30%"}
        elif "gain" in goal.lower() or "muscle" in goal.lower():
            target_cal = tdee + 350
            macro_dist = {"protein": "35%", "carbs": "45%", "fat": "20%"}
        elif "diabetic" in goal.lower():
            target_cal = tdee
            macro_dist = {"protein": "30%", "carbs": "30% (Low GI)", "fat": "40%"}
        elif "keto" in diet.lower():
            target_cal = tdee - 200
            macro_dist = {"protein": "25%", "carbs": "5% (Net)", "fat": "70%"}
        else:
            target_cal = tdee
            macro_dist = {"protein": "25%", "carbs": "50%", "fat": "25%"}

        days_data = [
            {
                "day": "Monday (Metabolic Reset)",
                "total_calories": target_cal,
                "macros": {"protein": round(target_cal * 0.3 / 4), "carbs": round(target_cal * 0.4 / 4), "fat": round(target_cal * 0.3 / 9)},
                "breakfast": {
                    "name": "Spinach & Egg White Scramble with Sourdough",
                    "cals": int(target_cal * 0.25),
                    "macros": "28g P / 32g C / 9g F",
                    "prep_time": "10 min"
                },
                "lunch": {
                    "name": "Mediterranean Quinoa Bowl with Grilled Chicken Breast",
                    "cals": int(target_cal * 0.35),
                    "macros": "42g P / 46g C / 14g F",
                    "prep_time": "15 min"
                },
                "dinner": {
                    "name": "Pan-Seared Wild Salmon with Steamed Asparagus & Lemon Dill",
                    "cals": int(target_cal * 0.30),
                    "macros": "36g P / 12g C / 18g F",
                    "prep_time": "20 min"
                },
                "snack": {
                    "name": "Greek Yogurt with Blueberries & Chia Seeds",
                    "cals": int(target_cal * 0.10),
                    "macros": "16g P / 14g C / 3g F",
                    "prep_time": "3 min"
                }
            },
            {
                "day": "Tuesday (Sustained Energy)",
                "total_calories": target_cal,
                "macros": {"protein": round(target_cal * 0.3 / 4), "carbs": round(target_cal * 0.4 / 4), "fat": round(target_cal * 0.3 / 9)},
                "breakfast": {
                    "name": "Steel-Cut Cinnamon Oats with Whey Protein & Crushed Walnuts",
                    "cals": int(target_cal * 0.25),
                    "macros": "26g P / 45g C / 11g F",
                    "prep_time": "8 min"
                },
                "lunch": {
                    "name": "Herb-Roasted Turkey & Avocado High-Fiber Wrap",
                    "cals": int(target_cal * 0.35),
                    "macros": "38g P / 38g C / 16g F",
                    "prep_time": "10 min"
                },
                "dinner": {
                    "name": "Tofu & Mixed Veggie Szechuan Stir-Fry with Cauliflower Rice",
                    "cals": int(target_cal * 0.30),
                    "macros": "28g P / 22g C / 15g F",
                    "prep_time": "18 min"
                },
                "snack": {
                    "name": "Crispy Roasted Edamame with Sea Salt",
                    "cals": int(target_cal * 0.10),
                    "macros": "14g P / 9g C / 4g F",
                    "prep_time": "2 min"
                }
            },
            {
                "day": "Wednesday (Anti-Inflammatory Focus)",
                "total_calories": target_cal,
                "macros": {"protein": round(target_cal * 0.3 / 4), "carbs": round(target_cal * 0.4 / 4), "fat": round(target_cal * 0.3 / 9)},
                "breakfast": {
                    "name": "Golden Turmeric Chia Pudding with Almond Milk & Mango Chunks",
                    "cals": int(target_cal * 0.25),
                    "macros": "15g P / 40g C / 14g F",
                    "prep_time": "5 min (prep ahead)"
                },
                "lunch": {
                    "name": "Tuscan White Bean & Kale Soup with Grilled Chicken Skewers",
                    "cals": int(target_cal * 0.35),
                    "macros": "40g P / 42g C / 10g F",
                    "prep_time": "15 min"
                },
                "dinner": {
                    "name": "Sesame Crusted Cod with Garlic Bok Choy & Brown Rice",
                    "cals": int(target_cal * 0.30),
                    "macros": "34g P / 30g C / 12g F",
                    "prep_time": "20 min"
                },
                "snack": {
                    "name": "Dark Chocolate (85%) with 10 Raw Almonds",
                    "cals": int(target_cal * 0.10),
                    "macros": "4g P / 8g C / 12g F",
                    "prep_time": "1 min"
                }
            }
        ]

        grocery_list = {
            "Produce & Fresh": [
                "Baby Spinach (300g)",
                "Fresh Hass Avocados (3 pcs)",
                "Asparagus spears (1 bunch)",
                "Bok Choy (2 heads)",
                "Organic Blueberries (1 punnet)",
                "Fresh Lemons (3 pcs)",
                "Garlic & Fresh Ginger"
            ],
            "Proteins & Dairy": [
                "Wild Salmon Fillets (2 x 150g)",
                "Skinless Chicken Breast (600g)",
                "Fresh Cod or Halibut Fillet (300g)",
                "Organic Free-Range Eggs (1 dozen)",
                "0% Greek Strained Yogurt (500g tub)",
                "Extra-Firm Organic Tofu (1 block)"
            ],
            "Pantry & Grains": [
                "Organic Tricolor Quinoa (500g)",
                "Steel-Cut Rolled Oats (500g)",
                "Chia Seeds & Raw Walnuts",
                "Cold-Pressed Extra Virgin Olive Oil",
                "Artisan Sourdough Loaf"
            ]
        }

        return {
            "plan_id": f"mp-{uuid.uuid4().hex[:8]}",
            "goal": goal,
            "target_calories_daily": target_cal,
            "macro_distribution": macro_dist,
            "days": days_data,
            "grocery_list": grocery_list,
            "hydration_advice": f"Aim for at least {round(weight * 0.035, 1)} Liters of water daily, spaced evenly between 07:00 and 20:00."
        }

cooking_agent = CookingAgentService()
