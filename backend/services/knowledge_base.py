"""
FoodVerse AI Knowledge Base:
Calibrated nutrition data, freshness spoilage matrices, HACCP/FDA kitchen hygiene rules,
and dynamic recipe intelligence.
"""

NUTRITION_DATABASE = {
    "avocado_toast": {
        "dish_name": "Sourdough Avocado Toast with Poached Egg",
        "category": "Breakfast & Brunch",
        "cuisine": "Modern Californian",
        "total_calories": 395,
        "serving_size": "1 plate (240g)",
        "macronutrients": {
            "protein": 17.5,
            "carbs": 32.0,
            "fat": 22.0,
            "fiber": 8.5,
            "sugar": 2.1,
            "sodium": 390.0
        },
        "micronutrients": [
            {"name": "Potassium", "amount": "680mg", "daily_value_pct": 20},
            {"name": "Folate", "amount": "120mcg", "daily_value_pct": 30},
            {"name": "Vitamin E", "amount": "3.5mg", "daily_value_pct": 23},
            {"name": "Choline", "amount": "145mg", "daily_value_pct": 26}
        ],
        "glycemic_index": 38,
        "glycemic_load": "Low",
        "nutri_score": "A",
        "health_rating": 94,
        "dietary_tags": ["Vegetarian", "High Fiber", "Healthy Fats", "Heart-Healthy"],
        "allergens": ["Gluten (Wheat)", "Eggs"],
        "components": [
            {"name": "Whole Grain Sourdough", "portion": "1 slice (65g)", "calories": 140, "protein": 5.0, "carbs": 26.0, "fat": 1.0, "fiber": 2.5, "confidence": 0.98, "bounding_box": [15, 20, 70, 60]},
            {"name": "Mashed Hass Avocado", "portion": "80g", "calories": 130, "protein": 1.5, "carbs": 4.0, "fat": 12.0, "fiber": 5.0, "confidence": 0.96, "bounding_box": [22, 28, 55, 45]},
            {"name": "Poached Farm Egg", "portion": "1 large (50g)", "calories": 72, "protein": 6.3, "carbs": 0.4, "fat": 4.8, "fiber": 0.0, "confidence": 0.99, "bounding_box": [32, 22, 36, 38]},
            {"name": "Hemp Seeds & Chili Flakes", "portion": "1 tsp (5g)", "calories": 28, "protein": 1.6, "carbs": 0.4, "fat": 2.2, "fiber": 0.4, "confidence": 0.88, "bounding_box": [25, 30, 48, 40]}
        ],
        "insights": [
            "Rich in monounsaturated oleic acid, which improves lipid profile and satiety.",
            "Poached egg provides high-biological value protein and lutein for eye health.",
            "Slow-fermented sourdough has lower glycemic impact than standard white bread."
        ],
        "health_advice": "Ideal pre-workout or focus-heavy morning breakfast. To reduce sodium, replace salted butter or finishing flakes with lemon zest."
    },
    "salmon_quinoa_bowl": {
        "dish_name": "Mediterranean Grilled Salmon & Quinoa Power Bowl",
        "category": "Main Course / Bowls",
        "cuisine": "Mediterranean",
        "total_calories": 540,
        "serving_size": "1 bowl (380g)",
        "macronutrients": {
            "protein": 42.0,
            "carbs": 44.0,
            "fat": 19.5,
            "fiber": 7.8,
            "sugar": 3.4,
            "sodium": 420.0
        },
        "micronutrients": [
            {"name": "Omega-3 (EPA/DHA)", "amount": "2.2g", "daily_value_pct": 140},
            {"name": "Vitamin D", "amount": "14.2mcg", "daily_value_pct": 71},
            {"name": "Magnesium", "amount": "118mg", "daily_value_pct": 28},
            {"name": "Vitamin B12", "amount": "4.8mcg", "daily_value_pct": 200}
        ],
        "glycemic_index": 42,
        "glycemic_load": "Low",
        "nutri_score": "A",
        "health_rating": 98,
        "dietary_tags": ["High Protein", "Gluten-Free", "Anti-Inflammatory", "Pescatarian"],
        "allergens": ["Fish (Salmon)"],
        "components": [
            {"name": "Wild Atlantic Salmon Fillet", "portion": "150g", "calories": 260, "protein": 34.0, "carbs": 0.0, "fat": 13.0, "fiber": 0.0, "confidence": 0.99, "bounding_box": [30, 15, 45, 40]},
            {"name": "Cooked Tricolor Quinoa", "portion": "120g", "calories": 145, "protein": 5.0, "carbs": 26.0, "fat": 2.5, "fiber": 3.5, "confidence": 0.95, "bounding_box": [15, 45, 40, 40]},
            {"name": "Steamed Broccoli & Edamame", "portion": "80g", "calories": 75, "protein": 4.5, "carbs": 8.0, "fat": 2.0, "fiber": 3.5, "confidence": 0.92, "bounding_box": [50, 48, 35, 38]},
            {"name": "Lemon Tahini Dressing", "portion": "15ml", "calories": 60, "protein": 1.8, "carbs": 2.0, "fat": 5.5, "fiber": 0.8, "confidence": 0.89, "bounding_box": [38, 40, 25, 25]}
        ],
        "insights": [
            "Features 2,200mg of anti-inflammatory EPA and DHA omega-3 fatty acids.",
            "Complete protein profile combining salmon and the 9 essential amino acids in quinoa.",
            "High magnesium supports cardiovascular rhythm and muscle recovery."
        ],
        "health_advice": "Excellent post-resistance workout meal or balanced dinner for metabolic flexibility and cholesterol management."
    },
    "chicken_biryani": {
        "dish_name": "Dum Hyderabadi Chicken Biryani",
        "category": "Main Course",
        "cuisine": "Indian / Mughlai",
        "total_calories": 680,
        "serving_size": "1 plate (420g)",
        "macronutrients": {
            "protein": 38.0,
            "carbs": 82.0,
            "fat": 21.0,
            "fiber": 4.2,
            "sugar": 3.0,
            "sodium": 780.0
        },
        "micronutrients": [
            {"name": "Iron", "amount": "3.8mg", "daily_value_pct": 21},
            {"name": "Niacin (B3)", "amount": "9.4mg", "daily_value_pct": 59},
            {"name": "Zinc", "amount": "2.9mg", "daily_value_pct": 26},
            {"name": "Phosphorus", "amount": "310mg", "daily_value_pct": 25}
        ],
        "glycemic_index": 62,
        "glycemic_load": "Medium",
        "nutri_score": "B",
        "health_rating": 78,
        "dietary_tags": ["High Protein", "Halal Friendly", "Rich in Aromatics"],
        "allergens": ["Dairy (Ghee/Yogurt)"],
        "components": [
            {"name": "Marinated Spiced Chicken", "portion": "180g", "calories": 310, "protein": 31.0, "carbs": 4.0, "fat": 12.0, "fiber": 1.0, "confidence": 0.97, "bounding_box": [25, 25, 45, 40]},
            {"name": "Long Grain Saffron Basmati Rice", "portion": "200g", "calories": 280, "protein": 5.5, "carbs": 68.0, "fat": 4.0, "fiber": 2.0, "confidence": 0.98, "bounding_box": [10, 15, 80, 70]},
            {"name": "Crispy Caramelized Onions (Birista)", "portion": "25g", "calories": 65, "protein": 0.8, "carbs": 8.0, "fat": 3.5, "fiber": 1.0, "confidence": 0.91, "bounding_box": [40, 30, 30, 30]},
            {"name": "Cucumber Mint Raita", "portion": "50g", "calories": 35, "protein": 1.8, "carbs": 2.5, "fat": 1.5, "fiber": 0.4, "confidence": 0.93, "bounding_box": [70, 60, 25, 25]}
        ],
        "insights": [
            "Spices like star anise, cardamom, and saffron offer polyphenol antioxidants.",
            "Basmati rice has a lower glycemic index compared to jasmine or short grain rice.",
            "Moderate sodium level; pair with cucumber yogurt raita to buffer spice and provide probiotics."
        ],
        "health_advice": "Enjoy mindfully! Balancing with a raw side salad and hydrating well assists with digestive comfort."
    },
    "berry_acai_bowl": {
        "dish_name": "Organic Wild Acai Berry Superfood Bowl",
        "category": "Breakfast & Smoothie Bowl",
        "cuisine": "Brazilian / Modern Wellness",
        "total_calories": 360,
        "serving_size": "1 bowl (300g)",
        "macronutrients": {
            "protein": 9.5,
            "carbs": 58.0,
            "fat": 11.0,
            "fiber": 10.5,
            "sugar": 28.0,
            "sodium": 65.0
        },
        "micronutrients": [
            {"name": "Anthocyanins", "amount": "310mg", "daily_value_pct": 100},
            {"name": "Vitamin C", "amount": "45mg", "daily_value_pct": 50},
            {"name": "Manganese", "amount": "1.2mg", "daily_value_pct": 52},
            {"name": "Calcium", "amount": "95mg", "daily_value_pct": 8}
        ],
        "glycemic_index": 48,
        "glycemic_load": "Low",
        "nutri_score": "B",
        "health_rating": 89,
        "dietary_tags": ["Vegan", "Dairy-Free", "Antioxidant-Rich", "Superfood"],
        "allergens": ["Tree Nuts (Almonds/Coconut)"],
        "components": [
            {"name": "Pure Frozen Acai Puree", "portion": "150g", "calories": 110, "protein": 2.0, "carbs": 9.0, "fat": 7.0, "fiber": 4.0, "confidence": 0.99, "bounding_box": [10, 10, 80, 80]},
            {"name": "Fresh Blueberries & Strawberries", "portion": "80g", "calories": 48, "protein": 0.8, "carbs": 11.5, "fat": 0.4, "fiber": 3.0, "confidence": 0.95, "bounding_box": [20, 20, 35, 35]},
            {"name": "Gluten-Free Almond Granola", "portion": "35g", "calories": 140, "protein": 4.5, "carbs": 18.0, "fat": 5.5, "fiber": 2.5, "confidence": 0.94, "bounding_box": [50, 25, 40, 35]},
            {"name": "Toasted Coconut Flakes & Chia", "portion": "15g", "calories": 62, "protein": 1.5, "carbs": 2.5, "fat": 4.5, "fiber": 2.0, "confidence": 0.90, "bounding_box": [35, 55, 30, 25]}
        ],
        "insights": [
            "Abundant in anthocyanin flavonoids that protect against oxidative stress.",
            "Chia and flax toppings provide ALA plant-based omega-3s.",
            "High natural fructose: ideal around active workouts or early mornings."
        ],
        "health_advice": "For diabetic or low-carb targets, swap granola for hemp hearts or roasted pumpkin seeds to curb sugar spikes."
    },
    "caesar_salad": {
        "dish_name": "Crisp Tuscan Kale & Grilled Chicken Caesar",
        "category": "Salads",
        "cuisine": "Italian-American",
        "total_calories": 420,
        "serving_size": "1 bowl (320g)",
        "macronutrients": {
            "protein": 36.0,
            "carbs": 14.0,
            "fat": 24.0,
            "fiber": 4.5,
            "sugar": 2.8,
            "sodium": 590.0
        },
        "micronutrients": [
            {"name": "Vitamin K", "amount": "280mcg", "daily_value_pct": 230},
            {"name": "Vitamin A", "amount": "450mcg", "daily_value_pct": 50},
            {"name": "Calcium", "amount": "190mg", "daily_value_pct": 15},
            {"name": "Selenium", "amount": "31mcg", "daily_value_pct": 56}
        ],
        "glycemic_index": 22,
        "glycemic_load": "Low",
        "nutri_score": "A",
        "health_rating": 91,
        "dietary_tags": ["Keto Friendly", "High Protein", "Low Carb"],
        "allergens": ["Dairy (Parmesan)", "Eggs", "Fish (Anchovy in dressing)"],
        "components": [
            {"name": "Grilled Herb Chicken Breast", "portion": "140g", "calories": 210, "protein": 32.0, "carbs": 0.0, "fat": 4.5, "fiber": 0.0, "confidence": 0.98, "bounding_box": [20, 25, 45, 35]},
            {"name": "Romaine & Dinosaur Kale", "portion": "120g", "calories": 30, "protein": 2.0, "carbs": 5.0, "fat": 0.5, "fiber": 3.0, "confidence": 0.97, "bounding_box": [15, 15, 70, 70]},
            {"name": "Shaved 24-Mo Aged Parmigiano", "portion": "25g", "calories": 105, "protein": 8.0, "carbs": 0.5, "fat": 7.5, "fiber": 0.0, "confidence": 0.93, "bounding_box": [35, 40, 25, 20]},
            {"name": "Garlic Olive Oil Dressing", "portion": "20ml", "calories": 95, "protein": 0.5, "carbs": 1.5, "fat": 10.0, "fiber": 0.2, "confidence": 0.91, "bounding_box": [25, 30, 50, 40]}
        ],
        "insights": [
            "Very high vitamin K content promotes optimal bone mineralization and blood clotting.",
            "High satiety index with minimal blood glucose variance."
        ],
        "health_advice": "Great choice for ketogenic and metabolic-reset plans. Request dressing on the side if watching saturated fat."
    }
}

FRESHNESS_DATABASE = {
    "banana_ripe": {
        "item_name": "Cavendish Banana (Table Ripe)",
        "category": "Fruits",
        "freshness_score": 88,
        "status": "Good Condition",
        "status_color": "#10b981",
        "estimated_shelf_life_days": 4,
        "shelf_life_cold_days": 8,
        "shelf_life_freezer_days": 90,
        "spoilage_markers": [
            {"feature": "Surface Browning (Sugar Spots)", "severity": "Low", "percentage": 8, "description": "Minor tiger spots indicating peak starch-to-fructose conversion."},
            {"feature": "Stem Firmness", "severity": "None", "percentage": 0, "description": "Stem remains intact and pale green-yellow without fungal rot."},
            {"feature": "Peel Elasticity", "severity": "None", "percentage": 2, "description": "Peel retains natural moisture barrier; no mushiness."}
        ],
        "storage_advice": {
            "optimal_temperature_c": "12°C - 14°C (Room Temp)",
            "ideal_humidity": "85% - 90%",
            "best_container": "Hanging banana hook or breathable basket",
            "ethylene_gas_sensitivity": "High Producer & High Sensitive",
            "storage_tips": [
                "Wrap the stem in foil or beeswax wrap to slow ethylene emission.",
                "Keep isolated from ethylene-sensitive fruits like apples and avocados.",
                "Do not refrigerate underripe bananas as chilling injury darkens skin."
            ]
        },
        "safety_verdict": "Safe & Highly Palatable. Sweet flavor profile with optimal digestible carbohydrates.",
        "safe_to_eat": True,
        "cooking_alternatives_if_ripe": [
            "Eat fresh as a pre-workout fuel",
            "Slice over morning oats or chia pudding",
            "Blend into a creamy protein smoothie"
        ]
    },
    "banana_overripe": {
        "item_name": "Cavendish Banana (Overripe / Heavy Speckled)",
        "category": "Fruits",
        "freshness_score": 45,
        "status": "Consume Soon",
        "status_color": "#f59e0b",
        "estimated_shelf_life_days": 1,
        "shelf_life_cold_days": 3,
        "shelf_life_freezer_days": 60,
        "spoilage_markers": [
            {"feature": "Surface Browning", "severity": "Moderate", "percentage": 58, "description": "Extensive brown melanoidin spotting across 58% of peel."},
            {"feature": "Pulp Softening", "severity": "Moderate", "percentage": 40, "description": "Pectin breakdown resulting in soft, translucent flesh."},
            {"feature": "Microbial / Mold Activity", "severity": "None", "percentage": 0, "description": "No fungal mycelium or fermentation odor detected."}
        ],
        "storage_advice": {
            "optimal_temperature_c": "4°C (Refrigerator) or -18°C (Freezer)",
            "ideal_humidity": "70%",
            "best_container": "Airtight silicone bag / freezer-safe container",
            "ethylene_gas_sensitivity": "High Producer",
            "storage_tips": [
                "Peel, chop into rounds, and freeze immediately for smoothie prep.",
                "Refrigerate to halt ripening for 48 hours (skin will blacken, fruit remains fine)."
            ]
        },
        "safety_verdict": "Safe for consumption and culinary baking. Intense natural sweetness; do not discard!",
        "safe_to_eat": True,
        "cooking_alternatives_if_ripe": [
            "Cinnamon Banana Walnut Bread (Zero added sugar)",
            "Healthy 3-Ingredient Banana Oat Pancakes",
            "Dairy-Free 'Nice Cream' (frozen blended banana)"
        ]
    },
    "salmon_fresh": {
        "item_name": "Atlantic Salmon Fillet (Wild Caught)",
        "category": "Seafood",
        "freshness_score": 96,
        "status": "Peak Freshness",
        "status_color": "#10b981",
        "estimated_shelf_life_days": 2,
        "shelf_life_cold_days": 3,
        "shelf_life_freezer_days": 180,
        "spoilage_markers": [
            {"feature": "Muscle Firmness & Elasticity", "severity": "None", "percentage": 0, "description": "Flesh rebounds immediately on slight touch; clean striations."},
            {"feature": "Surface Moisture & Slime", "severity": "None", "percentage": 0, "description": "Glistening natural moisture with zero sticky or milky bacterial film."},
            {"feature": "Odor / TMA Volatiles", "severity": "None", "percentage": 0, "description": "Fresh sea-breeze aroma, completely devoid of ammoniacal fishiness."}
        ],
        "storage_advice": {
            "optimal_temperature_c": "0°C - 2°C (Ice bath in fridge)",
            "ideal_humidity": "95%",
            "best_container": "Perforated tray over crushed ice, wrapped in parchment",
            "ethylene_gas_sensitivity": "Non-sensitive",
            "storage_tips": [
                "Store on the bottom shelf of refrigerator to prevent drip contamination.",
                "Pat dry with clean paper towels before chilling to deter surface bacteria.",
                "If not cooking within 48 hours, vacuum seal and freeze at -18°C."
            ]
        },
        "safety_verdict": "Excellent freshness. Suitable for sashimi/tartare grade or pan-searing.",
        "safe_to_eat": True,
        "cooking_alternatives_if_ripe": [
            "Pan-seared crispy skin salmon with dill butter",
            "Miso-glazed broiled salmon",
            "Fresh poke bowl with avocado and ponzu"
        ]
    },
    "avocado_spoiled": {
        "item_name": "Hass Avocado (Over-oxidized / Decayed)",
        "category": "Produce",
        "freshness_score": 18,
        "status": "Spoiled / Discard",
        "status_color": "#ef4444",
        "estimated_shelf_life_days": 0,
        "shelf_life_cold_days": 0,
        "shelf_life_freezer_days": 0,
        "spoilage_markers": [
            {"feature": "Pulp Browning & Fiber Stringiness", "severity": "High", "percentage": 85, "description": "Severe polyphenol oxidase enzymatic browning with blackened vascular bundles."},
            {"feature": "Rancid Lipid Oxidation", "severity": "High", "percentage": 75, "description": "Peroxide breakdown producing sour/musty volatile odors."},
            {"feature": "Internal Surface Cavities", "severity": "Moderate", "percentage": 40, "description": "Flesh collapse and dehydration pockets."}
        ],
        "storage_advice": {
            "optimal_temperature_c": "N/A - Discard",
            "ideal_humidity": "N/A",
            "best_container": "Compost bin",
            "ethylene_gas_sensitivity": "High",
            "storage_tips": [
                "Do not store spoiled avocado near other fruits as microbial rot spreads rapidly.",
                "Compost safely; remove pit for seed sprouting project."
            ]
        },
        "safety_verdict": "Unsafe & Unpalatable. Lipid rancidity and mold spore risk may cause gastric irritation. Discard immediately.",
        "safe_to_eat": False,
        "cooking_alternatives_if_ripe": [
            "Not recommended for ingestion.",
            "Can be repurposed as a DIY deep-conditioning hair/skin mask if mold-free, or composted."
        ]
    },
    "spinach_crisp": {
        "item_name": "Baby Spinach Greens (Hydroponic)",
        "category": "Vegetables",
        "freshness_score": 92,
        "status": "Peak Freshness",
        "status_color": "#10b981",
        "estimated_shelf_life_days": 5,
        "shelf_life_cold_days": 7,
        "shelf_life_freezer_days": 120,
        "spoilage_markers": [
            {"feature": "Turgor Pressure / Leaf Wilting", "severity": "None", "percentage": 2, "description": "Vibrant emerald green leaves with crisp cellular structure."},
            {"feature": "Chlorophyll Degradation (Yellowing)", "severity": "None", "percentage": 1, "description": "Zero yellowing observed."},
            {"feature": "Bacterial Wet Rot / Slime", "severity": "None", "percentage": 0, "description": "Completely dry leaf surfaces with no slimy liquefaction."}
        ],
        "storage_advice": {
            "optimal_temperature_c": "1°C - 3°C (Crisper drawer)",
            "ideal_humidity": "90% - 95%",
            "best_container": "Rigid container lined with moisture-absorbing paper towel",
            "ethylene_gas_sensitivity": "High Sensitivity (Yellows rapidly near apples)",
            "storage_tips": [
                "Insert a dry paper towel in container to soak up condensation.",
                "Keep away from apples, tomatoes, and melons.",
                "Wash only right before cooking or eating."
            ]
        },
        "safety_verdict": "Prime quality. Maximum vitamin C, folate, and lutein bioavailability.",
        "safe_to_eat": True,
        "cooking_alternatives_if_ripe": [
            "Crisp raw garden salad",
            "Green goddess smoothie",
            "Quick garlic oil sauté"
        ]
    }
}

HYGIENE_DATABASE = {
    "kitchen_prep_violation": {
        "inspection_type": "Prep Station & Food Handlers",
        "overall_score": 68,
        "grade": "C",
        "pass_status": False,
        "summary": "Multiple safety infractions detected during prep rush: raw chicken cutting board placed contiguous to ready-to-eat salad bar, and line cook without mandated hair restraint.",
        "detections": [
            {
                "label": "HAZARD: Cross-Contamination",
                "type": "danger",
                "box": [22, 45, 28, 35],
                "confidence": 0.96,
                "details": "Raw poultry juice residue within 15cm of RTE washed greens."
            },
            {
                "label": "VIOLATION: No Hairnet",
                "type": "danger",
                "box": [58, 12, 18, 22],
                "confidence": 0.94,
                "details": "Prep cook actively handling plated items without hair restraint."
            },
            {
                "label": "COMPLIANT: Nitrile Gloves",
                "type": "success",
                "box": [62, 52, 15, 18],
                "confidence": 0.98,
                "details": "Clean food-grade disposable gloves fitted correctly."
            },
            {
                "label": "WARNING: Open Beverage Container",
                "type": "warning",
                "box": [82, 38, 12, 15],
                "confidence": 0.89,
                "details": "Uncovered employee drink bottle resting on active cutting block."
            }
        ],
        "violations": [
            {
                "id": "VIO-01",
                "severity": "Critical",
                "category": "Cross-Contamination",
                "description": "Raw animal foods not separated from ready-to-eat foods during storage, preparation, holding, or display.",
                "haccp_fda_code": "FDA Food Code 3-302.11(A)(1)",
                "corrective_action": "Halt line immediately. Remove and discard exposed RTE greens. Wash, rinse, and sanitize workstation with 200ppm quaternary solution. Designate red cutting boards for raw proteins exclusively."
            },
            {
                "id": "VIO-02",
                "severity": "Major",
                "category": "PPE Compliance",
                "description": "Food employees shall wear hair restraints such as hats, hair coverings or nets that are designed and worn to effectively keep their hair from contacting exposed food.",
                "haccp_fda_code": "FDA Food Code 2-402.11",
                "corrective_action": "Supply and mandate immediate donning of beard restraint and hairnet prior to resuming prep."
            },
            {
                "id": "VIO-03",
                "severity": "Minor",
                "category": "Sanitation",
                "description": "Employee beverage located in food preparation area without lid or straw to prevent accidental droplet spill.",
                "haccp_fda_code": "FDA Food Code 2-401.11",
                "corrective_action": "Relocate personal beverage to designated break storage shelf."
            }
        ],
        "positive_practices": [
            "Food handler was wearing fresh disposable gloves.",
            "Handwashing sink accessible and stocked with antibacterial foam and paper towels."
        ],
        "cleanliness_metrics": {
            "ppe_compliance": 50,
            "surface_cleanliness": 65,
            "cross_contamination_prevention": 42,
            "storage_hygiene": 85
        },
        "recommended_actions": [
            "Conduct emergency 15-minute kitchen briefing on HACCP cross-contamination barriers.",
            "Implement color-coded board and knife system (Red: Raw Meat, Green: Produce, Blue: Seafood).",
            "Schedule follow-up audit within 48 hours to verify adherence."
        ]
    },
    "kitchen_prep_pristine": {
        "inspection_type": "Cook Line & Plating Station",
        "overall_score": 97,
        "grade": "A+",
        "pass_status": True,
        "summary": "Exemplary food safety posture. 100% PPE compliance observed, flawless board segregation, digital temperature logs active, clean stainless work surfaces.",
        "detections": [
            {
                "label": "COMPLIANT: Hairnet & Mask",
                "type": "success",
                "box": [25, 10, 16, 24],
                "confidence": 0.99,
                "details": "Full hair covering and surgical mask fitted snugly."
            },
            {
                "label": "COMPLIANT: Color-Coded Stations",
                "type": "success",
                "box": [18, 48, 28, 30],
                "confidence": 0.97,
                "details": "Green NSF cutting board dedicated to organic produce."
            },
            {
                "label": "COMPLIANT: Digital Temp Probe",
                "type": "success",
                "box": [52, 45, 14, 20],
                "confidence": 0.95,
                "details": "Hot holding well maintained at 68°C (> 60°C requirement)."
            },
            {
                "label": "COMPLIANT: Sanitizer Bucket Ready",
                "type": "success",
                "box": [75, 65, 18, 22],
                "confidence": 0.92,
                "details": "Quat test strip verified between 200 - 400 ppm."
            }
        ],
        "violations": [],
        "positive_practices": [
            "All line cooks wearing approved hair restraints and beard covers.",
            "Dedicated stainless steel separation dividers between raw and cooked lines.",
            "Wiping cloths stored immersed in labeled sanitizer bucket.",
            "Digital probe thermometers calibrated and disinfected between readings."
        ],
        "cleanliness_metrics": {
            "ppe_compliance": 100,
            "surface_cleanliness": 98,
            "cross_contamination_prevention": 99,
            "storage_hygiene": 95
        },
        "recommended_actions": [
            "Maintain current standard operating procedure.",
            "Nominate station lead for Quarterly Food Safety Excellence Certificate."
        ]
    }
}
