import io
import os
import sys
from datetime import datetime
from PIL import Image
import streamlit as st

# Ensure root directory is in sys.path so backend imports work seamlessly
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Reuse existing backend services and database logic without modification
from backend.services.vision_analyzer import vision_analyzer
from backend.services.cooking_agent import cooking_agent
from backend.services.knowledge_base import (
    NUTRITION_DATABASE,
    FRESHNESS_DATABASE,
    HYGIENE_DATABASE
)
from backend.database import (
    init_db,
    get_all_pantry,
    add_pantry_item,
    delete_pantry_item,
    get_food_logs,
    add_food_log,
    get_hygiene_audits,
    add_hygiene_audit
)
from fastapi import HTTPException

# Initialize SQLite database schema
init_db()

# ----------------- Streamlit Page Configuration -----------------
st.set_page_config(
    page_title="FoodVerse AI | Multimodal Food Intelligence Agent",
    page_icon="🥗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ----------------- Sidebar -----------------
st.sidebar.title("🥗 FoodVerse AI")
st.sidebar.caption("Multimodal Food Intelligence & Kitchen Safety Agent")
st.sidebar.markdown("---")

# Navigation Selector
selected_page = st.sidebar.radio(
    "Navigation",
    [
        "🥑 Food Recognition & Nutrition",
        "🔬 Freshness & Spoilage AI",
        "🛡️ Restaurant Hygiene & Safety",
        "🍳 Smart Cooking & Meal Planner",
        "📊 Pantry Radar & Logs"
    ]
)

st.sidebar.markdown("---")

# Streamlit Community Cloud Persistence Notice (Requirement 6)
st.sidebar.info(
    "ℹ️ **Cloud Environment Notice**:\n\n"
    "When hosted on Streamlit Community Cloud, local SQLite data persistence is ephemeral "
    "and resets whenever the cloud container restarts or re-deploys. For production "
    "permanent storage, connect an external managed database."
)

st.sidebar.markdown("---")
st.sidebar.markdown(
    "<small style='color: gray;'>FoodVerse AI Capstone • PyTorch MobileNetV3 • Streamlit Entry Point</small>",
    unsafe_allow_html=True
)

# =========================================================================
# MODULE 1: Food Recognition & Nutrition Analysis
# =========================================================================
if selected_page == "🥑 Food Recognition & Nutrition":
    st.header("🥑 Food Recognition & Nutrition Analysis")
    st.write(
        "Upload a food image or choose a preset dish. The computer vision model (MobileNetV3) "
        "identifies food items, rejects non-food / landscape images, and estimates calibrated macronutrients."
    )

    col_input, col_preset = st.columns([2, 1])

    with col_input:
        uploaded_file = st.file_uploader(
            "Upload Meal / Dish Photo (JPEG, PNG, WEBP)",
            type=["jpg", "jpeg", "png", "webp"],
            help="Images containing landscapes or non-food items will be rejected by the CV model."
        )

    with col_preset:
        preset_choice = st.selectbox(
            "Or Quick Demo Preset",
            ["(None - Use Uploaded File)"] + [val["dish_name"] for val in NUTRITION_DATABASE.values()]
        )

    st.markdown("---")

    nutrition_result = None
    display_image = None

    if uploaded_file is not None:
        image_bytes = uploaded_file.getvalue()
        try:
            display_image = Image.open(io.BytesIO(image_bytes))
            st.image(display_image, caption="Uploaded Image", width=380)
        except Exception:
            st.error("Invalid image format.")

        with st.spinner("Analyzing image with PyTorch MobileNetV3..."):
            try:
                nutrition_result = vision_analyzer.analyze_nutrition(image_bytes=image_bytes)
            except HTTPException as e:
                st.error(f"⛔ Validation Failed: {e.detail}")
                st.info("Tip: Ensure the photo clearly contains a dish, plate of food, fruit, or vegetable.")
            except Exception as e:
                st.error(f"Unexpected error: {str(e)}")

    elif preset_choice != "(None - Use Uploaded File)":
        # Find preset key
        preset_key = None
        for k, v in NUTRITION_DATABASE.items():
            if v["dish_name"] == preset_choice:
                preset_key = k
                break
        if preset_key:
            nutrition_result = vision_analyzer.analyze_nutrition(sample_id=preset_key)

    # Render results only when food identification succeeds
    if nutrition_result:
        st.success(f"✅ Identified: **{nutrition_result['dish_name']}** ({nutrition_result['category']} • {nutrition_result['cuisine']})")

        # Top Macro Metrics
        m_col1, m_col2, m_col3, m_col4, m_col5 = st.columns(5)
        m_col1.metric("Calories", f"{nutrition_result['total_calories']} kcal")
        m_col2.metric("Protein", f"{nutrition_result['macronutrients']['protein']} g")
        m_col3.metric("Carbs", f"{nutrition_result['macronutrients']['carbs']} g")
        m_col4.metric("Fat", f"{nutrition_result['macronutrients']['fat']} g")
        m_col5.metric("Fiber", f"{nutrition_result['macronutrients'].get('fiber', 0)} g")

        # Health & Dietary Metadata
        col_tags, col_scores = st.columns(2)
        with col_tags:
            st.write("**Dietary Tags:**", ", ".join(nutrition_result.get("dietary_tags", [])))
            if nutrition_result.get("allergens"):
                st.warning(f"⚠️ **Allergen Notice**: Contains {', '.join(nutrition_result['allergens'])}")
        with col_scores:
            st.write(f"**Nutri-Score**: `{nutrition_result['nutri_score']}` | **Health Score**: `{nutrition_result['health_rating']}/100`")
            st.write(f"**Glycemic Index**: `{nutrition_result['glycemic_index']}` ({nutrition_result['glycemic_load']} Load)")

        # Micronutrients Table
        if nutrition_result.get("micronutrients"):
            st.subheader("Key Micronutrients")
            st.table(nutrition_result["micronutrients"])

        # Health Advice
        if nutrition_result.get("health_advice"):
            st.info(f"💡 **AI Dietitian Advice**: {nutrition_result['health_advice']}")

        # Log Meal Action
        if st.button("📝 Log Dish to Daily Food Journal"):
            log_record = {
                "id": f"log-{os.urandom(4).hex()}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "meal_type": "Meal Scan",
                "dish_name": nutrition_result["dish_name"],
                "calories": nutrition_result["total_calories"],
                "protein": nutrition_result["macronutrients"]["protein"],
                "carbs": nutrition_result["macronutrients"]["carbs"],
                "fat": nutrition_result["macronutrients"]["fat"],
                "fiber": nutrition_result["macronutrients"].get("fiber", 0),
                "nutri_score": nutrition_result["nutri_score"]
            }
            add_food_log(log_record)
            st.success("Meal logged to SQLite database! Check the 'Pantry Radar & Logs' tab.")

# =========================================================================
# MODULE 2: Food Freshness & Spoilage AI
# =========================================================================
elif selected_page == "🔬 Freshness & Spoilage AI":
    st.header("🔬 Food Freshness & Spoilage Detection")
    st.write(
        "Analyzes biological decay markers, color shifts, and moisture loss to estimate shelf life "
        "and provide scientific preservation guidelines."
    )

    freshness_samples = [v["item_name"] for v in FRESHNESS_DATABASE.values()]
    selected_item = st.selectbox("Select Freshness Assessment Scenario", freshness_samples)

    # Match scenario key
    matched_key = None
    for k, v in FRESHNESS_DATABASE.items():
        if v["item_name"] == selected_item:
            matched_key = k
            break

    if matched_key:
        data = vision_analyzer.analyze_freshness(sample_id=matched_key)

        st.markdown("---")
        col_summary, col_score = st.columns([2, 1])

        with col_summary:
            st.subheader(data["item_name"])
            st.write(f"**Category:** {data['category']}")
            st.write(f"**Status:** `{data['status']}`")
            if data["safe_to_eat"]:
                st.success(f"✅ **Safety Verdict**: {data['safety_verdict']}")
            else:
                st.error(f"⛔ **Safety Verdict**: {data['safety_verdict']}")

        with col_score:
            st.metric("Freshness Score", f"{data['freshness_score']}%")
            st.progress(data['freshness_score'] / 100.0)

        # Shelf Life Metrics
        st.subheader("Estimated Remaining Shelf-Life")
        s1, s2, s3 = st.columns(3)
        s1.metric("Ambient (Room Temp)", f"{data['estimated_shelf_life_days']} days")
        s2.metric("Chilled (Fridge 1-4°C)", f"{data['shelf_life_cold_days']} days")
        s3.metric("Deep Freezer (-18°C)", f"{data['shelf_life_freezer_days']} days")

        # Spoilage Markers
        st.subheader("Biological Decay Markers")
        markers_data = [
            {"Feature": m["feature"], "Severity": m["severity"], "Decay %": f"{m['percentage']}%", "Description": m["description"]}
            for m in data.get("spoilage_markers", [])
        ]
        st.table(markers_data)

        # Scientific Storage Advice
        if data.get("storage_advice"):
            st.subheader("Scientific Storage Guidelines")
            st.write(f"**Optimal Temperature:** {data['storage_advice']['optimal_temperature_c']}")
            st.write(f"**Ideal Humidity:** {data['storage_advice']['ideal_humidity']}")
            st.write(f"**Recommended Container:** {data['storage_advice']['best_container']}")
            st.write(f"**Ethylene Sensitivity:** {data['storage_advice']['ethylene_gas_sensitivity']}")
            for tip in data['storage_advice'].get('storage_tips', []):
                st.markdown(f"- {tip}")

        # Add to Pantry Action
        if st.button("📌 Track on Pantry Expiry Radar"):
            pantry_record = {
                "id": f"p-{os.urandom(3).hex()}",
                "name": data["item_name"],
                "category": data["category"],
                "purchase_date": datetime.now().strftime("%Y-%m-%d"),
                "expiry_date": (datetime.now()).strftime("%Y-%m-%d"),
                "days_left": data["estimated_shelf_life_days"],
                "freshness_status": data["status"],
                "quantity": "1 batch",
                "notes": data["safety_verdict"]
            }
            add_pantry_item(pantry_record)
            st.success(f"Added {data['item_name']} to Pantry Expiry Radar!")

# =========================================================================
# MODULE 3: Restaurant Hygiene & Safety
# =========================================================================
elif selected_page == "🛡️ Restaurant Hygiene & Safety":
    st.header("🛡️ Restaurant Hygiene & Kitchen Safety Audit")
    st.write(
        "Computer vision surveillance audit checking food handler PPE (hairnets, gloves), "
        "cross-contamination separation, and HACCP / FDA Food Code compliance."
    )

    scenario = st.radio(
        "Surveillance Inspection Scenario:",
        [
            "Line Station Cross-Contamination & PPE Violation",
            "Pristine Commercial Kitchen Line (Full Compliance)"
        ]
    )

    sample_id = "kitchen_prep_violation" if "Violation" in scenario else "kitchen_prep_pristine"
    audit = vision_analyzer.analyze_hygiene(sample_id=sample_id)

    st.markdown("---")
    h1, h2, h3 = st.columns(3)
    h1.metric("Overall Safety Score", f"{audit['overall_score']}/100")
    h2.metric("Inspection Grade", audit['grade'])
    h3.metric("Pass Status", "PASSED" if audit['pass_status'] else "REMEDIATION REQUIRED")

    st.info(f"📋 **Inspector Summary**: {audit['summary']}")

    # Cleanliness Metrics
    st.subheader("Checkpoint Metrics")
    m_cols = st.columns(len(audit.get("cleanliness_metrics", {})))
    for idx, (k, v) in enumerate(audit.get("cleanliness_metrics", {}).items()):
        m_cols[idx].metric(k.replace("_", " ").title(), f"{v}%")

    # Flagged Violations
    st.subheader(f"Flagged Violations ({len(audit.get('violations', []))})")
    if not audit.get("violations"):
        st.success("✅ Zero regulatory safety infractions detected.")
    else:
        for vio in audit["violations"]:
            with st.expander(f"⚠️ [{vio['severity']}] {vio['category']} - {vio['haccp_fda_code']}"):
                st.write(f"**Description**: {vio['description']}")
                st.write(f"**Mandated Remediation**: {vio['corrective_action']}")

    # Positive Practices & Recommendations
    c_pos, c_rec = st.columns(2)
    with c_pos:
        st.subheader("Verified Compliant Practices")
        for p in audit.get("positive_practices", []):
            st.markdown(f"- ✅ {p}")
    with c_rec:
        st.subheader("Recommended Next Actions")
        for r in audit.get("recommended_actions", []):
            st.markdown(f"- ➔ {r}")

# =========================================================================
# MODULE 4: Smart Cooking & Meal Planning
# =========================================================================
elif selected_page == "🍳 Smart Cooking & Meal Planner":
    st.header("🍳 Smart Cooking & Personalized Meal Planner")

    tab_chef, tab_plan = st.tabs(["Zero-Waste Pantry Chef", "Biometric Meal Planner"])

    with tab_chef:
        st.subheader("Generate Recipes from Available Pantry Leftovers")
        available_ings = st.multiselect(
            "Select or Type Leftover Ingredients:",
            ["Eggs", "Spinach", "Tomatoes", "Garlic", "Avocado", "Chicken Breast", "Rice", "Bread", "Salmon", "Cheese", "Mushrooms"],
            default=["Eggs", "Spinach", "Tomatoes"]
        )

        diet_pref = st.selectbox("Dietary Preference", ["Any", "Vegetarian", "High-Protein", "Gluten-Free", "Low-Carb"])

        if st.button("✨ Generate AI Zero-Waste Recipes"):
            recipes = cooking_agent.generate_leftover_recipes(
                ingredients=available_ings,
                dietary_pref=diet_pref,
                cooking_skill="Intermediate",
                max_time=30
            )

            for rec in recipes:
                st.markdown("---")
                st.markdown(f"### {rec['title']} ({rec['calories_per_serving']} kcal/serving)")
                st.write(rec["description"])
                st.write(f"**Prep Time:** {rec['prep_time_minutes']} min | **Cook Time:** {rec['cook_time_minutes']} min | **Difficulty:** {rec['difficulty']}")

                if rec.get("missing_pantry_staples"):
                    st.write(f"**Pantry staples needed:** {', '.join(rec['missing_pantry_staples'])}")

                st.write("**Cooking Steps:**")
                for s in rec["steps"]:
                    timer_str = f" *(Timer: {s['timer_seconds']}s)*" if s.get("timer_seconds") else ""
                    st.markdown(f"**Step {s['step_number']}**: {s['instruction']}{timer_str}")
                    if s.get("tip"):
                        st.caption(f"💡 Pro tip: {s['tip']}")

                if rec.get("chef_secret_tip"):
                    st.info(f"👨‍🍳 **Chef Secret**: {rec['chef_secret_tip']}")

    with tab_plan:
        st.subheader("Personalized Biometric Nutrition & Meal Plan")

        b1, b2, b3, b4 = st.columns(4)
        age = b1.number_input("Age", 18, 90, 28)
        gender = b2.selectbox("Gender", ["Male", "Female"])
        weight_kg = b3.number_input("Weight (kg)", 40.0, 180.0, 72.0)
        height_cm = b4.number_input("Height (cm)", 120.0, 220.0, 175.0)

        g1, g2 = st.columns(2)
        goal = g1.selectbox("Health Goal", ["Weight Loss", "Muscle Gain", "Diabetic Health", "Heart Health"])
        diet_type = g2.selectbox("Diet Style", ["Balanced", "Mediterranean", "Keto", "Vegan", "High-Protein"])

        if st.button("📊 Calculate Metabolic Budget & Generate Meal Plan"):
            profile_data = {
                "age": age,
                "gender": gender,
                "weight_kg": weight_kg,
                "height_cm": height_cm,
                "health_goal": goal,
                "diet_type": diet_type
            }
            plan = cooking_agent.generate_personalized_meal_plan(profile_data)

            st.markdown("---")
            st.metric("Target Caloric Intake", f"{plan['target_calories_daily']} kcal/day")
            st.write(f"**Hydration Target:** {plan['hydration_advice']}")

            st.write("**Daily Macro Target Ratios:**")
            st.write(plan.get("macro_distribution", {}))

            st.subheader("Sample Daily Schedule")
            for day in plan.get("days", []):
                with st.expander(f"📅 {day['day']} ({day['total_calories']} kcal)"):
                    st.write(f"**Breakfast**: {day['breakfast']['name']} ({day['breakfast']['cals']} kcal)")
                    st.write(f"**Lunch**: {day['lunch']['name']} ({day['lunch']['cals']} kcal)")
                    st.write(f"**Dinner**: {day['dinner']['name']} ({day['dinner']['cals']} kcal)")
                    st.write(f"**Snack**: {day['snack']['name']} ({day['snack']['cals']} kcal)")

            st.subheader("Consolidated Smart Grocery List")
            for cat, items in plan.get("grocery_list", {}).items():
                st.write(f"**{cat}**")
                for it in items:
                    st.markdown(f"- [ ] {it}")

# =========================================================================
# MODULE 5: Pantry Radar & Storage Logs
# =========================================================================
elif selected_page == "📊 Pantry Radar & Logs":
    st.header("📊 Pantry Radar & Storage Records")

    # Storage notice
    st.caption("ℹ️ Local SQLite database entries. Cloud session data is temporary and resets on restart.")

    pantry_items = get_all_pantry()
    food_logs = get_food_logs()
    hygiene_audits = get_hygiene_audits()

    st.subheader(f"Pantry Expiry Radar ({len(pantry_items)} items monitored)")
    if pantry_items:
        p_table = [
            {
                "Item": item["name"],
                "Category": item["category"],
                "Days Left": item["days_left"],
                "Status": item["freshness_status"],
                "Quantity": item["quantity"]
            }
            for item in pantry_items
        ]
        st.table(p_table)
    else:
        st.write("No pantry items currently logged.")

    st.subheader(f"Daily Food Logs ({len(food_logs)} records)")
    if food_logs:
        f_table = [
            {
                "Timestamp": l["timestamp"],
                "Dish Name": l["dish_name"],
                "Calories": f"{l['calories']} kcal",
                "Protein": f"{l['protein']}g",
                "Carbs": f"{l['carbs']}g",
                "Fat": f"{l['fat']}g",
                "Nutri-Score": l["nutri_score"]
            }
            for l in food_logs
        ]
        st.table(f_table)
    else:
        st.write("No meals logged yet today.")

    st.subheader(f"Recent Hygiene Audits ({len(hygiene_audits)} inspections)")
    if hygiene_audits:
        h_table = [
            {
                "Timestamp": a["timestamp"],
                "Station": a["inspection_type"],
                "Score": f"{a['overall_score']}%",
                "Grade": a["grade"],
                "Status": "PASSED" if a["pass_status"] else "REMEDIATION"
            }
            for a in hygiene_audits
        ]
        st.table(h_table)
    else:
        st.write("No audits recorded.")
