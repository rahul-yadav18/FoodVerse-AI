# 🥗 FoodVerse AI – Multimodal Food Intelligence Agent

An end-to-end multimodal, AI-powered food intelligence and kitchen safety platform. FoodVerse AI bridges visual computer vision, audio speech interaction, microbiological spoilage prediction, and LLM-driven culinary reasoning to solve fragmented food decision-making across households and commercial restaurant environments.

---

## 🏗️ Architecture Overview

The system matches the specification provided in the system architecture diagram:

```
                                    +-----------------------------------+
                                    | FoodVerse AI - Multimodal Agent   |
                                    +-----------------+-----------------+
                                                      |
                  +-----------------------------------+-----------------------------------+
                  |                                   |                                   |
                  v (Built With)                      v (Receives)                        v (Ensure)
    +---------------------------+        +---------------------------+        +---------------------------+
    |      React Frontend       |        |        User Input         |        |      FastAPI Backend      |
    |     (Web Application)     |        | (Image/Video/Audio/Text)  |        |  (API & Application Logic)|
    +---------------------------+        +-------------+-------------+        +-------------+-------------+
                                                       |                                    |
                                                       | (Processes)                        | (Stores & Retrieves)
                                                       v                                    v
                                         +---------------------------+        +---------------------------+
                                         |         AI Models         |        |       Data Storage        |
                                         |   (Vision + Audio + LLM)  |        |      (Database/Files)     |
                                         +-------------+-------------+        +---------------------------+
                                                       |
        +----------------------------------------------+----------------------------------------------+
        |                               |                               |                             |
        v (Generates)                   v (Generates)                   v (Generates)                 v (Generates)
+-----------------------+   +-----------------------+   +-----------------------+   +-----------------------+
|   Food Recognition    |   |    Food Freshness     |   |   Restaurant Hygiene  |   |     Smart Cooking     |
|  & Nutrition Analysis |   |  & Spoilage Detection |   |   & Safety Monitoring |   |    & Meal Planning    |
+-----------------------+   +-----------------------+   +-----------------------+   +-----------------------+
```

---

## 🚀 The 4 Core Pillars

### 1. 🥑 Food Recognition & Nutrition Analysis
- **Multimodal Visual Scanning**: Upload food photographs, capture live webcam frames, or type dish queries.
- **Plate Component Decomposition**: Neural bounding boxes pinpoint specific items (e.g. Poached Egg, Sourdough, Salmon Fillet, Quinoa, Steamed Edamame).
- **Comprehensive Macro & Micronutrients**: Real USDA-calibrated metrics for Calories, Protein, Carbohydrates, Fats, Dietary Fiber, Potassium, Omega-3, Folate, and Vitamin profiles.
- **Nutri-Score & Glycemic Load**: Dynamic score (A through E) and Glycemic Index classification for diabetic and metabolic wellness.
- **Dietary Badges & Allergen Alert**: Real-time warnings for Gluten, Dairy, Tree Nuts, and Seafood.
- **Daily Journal Logging**: One-click logging into the local SQLite database.

### 2. 🔬 Food Freshness & Spoilage Detection
- **Computer Vision Spoilage Modeling**: Analyzes visual decay markers (surface browning, skin wrinkling, pectin breakdown, mold mycelium risk).
- **Freshness Score Gauge (0–100%)**: Visualized with animated status badges (`Peak Freshness`, `Good Condition`, `Consume Soon`, `Spoiled / Discard`).
- **Multimodal Shelf-Life Estimator**: Real-time countdown for ambient room temperature (20°C), chilled refrigeration (1–4°C), and deep freezer (-18°C).
- **Scientific Storage Matrix**: Prescribes ideal humidity percentages, optimal container types, and ethylene gas sensitivity.
- **Zero-Waste Repurposing**: Culinary conversion tips for overripe produce (e.g. overripe bananas into no-sugar banana bread).

### 3. 🛡️ Restaurant Hygiene & Safety Monitoring
- **Surveillance Vision Audit**: Real-time bounding box detection on live kitchen and prep line feeds.
- **PPE Compliance Inspection**: Verifies hairnets, face coverings, and disposable food-grade gloves.
- **Cross-Contamination Hazard Detection**: Detects spatial hazards (e.g. raw poultry prep boards placed adjacent to ready-to-eat salads).
- **HACCP & FDA Food Code Citations**: Cites regulatory provisions (e.g. FDA 3-302.11 for separation of raw foods, FDA 2-402.11 for hair restraints).
- **Formal Inspection Audit Report**: Cleanliness rating, percentage metrics, and one-click printable official PDF audit export.

### 4. 🍳 Smart Cooking Assistance & Personalized Meal Planning
- **Zero-Waste Pantry Chef**: Select or enter ingredients currently on hand; AI crafts creative recipes that eliminate household food waste.
- **Interactive Voice Cook Assistant**:
  - Hands-free step-by-step cooking guide.
  - Text-to-speech audio reader (Web Speech API) so you can listen while you cook.
  - Integrated precision timers with sound alerts for sautéing, baking, and simmering.
  - Confetti celebration upon finishing a recipe!
- **Personalized Biometric Meal Planner**:
  - Calculates BMR & TDEE using the Mifflin-St Jeor equation based on age, gender, weight, height, and activity level.
  - Configurable health goals: Weight Loss, Muscle Gain, Diabetic Health, Heart Health, Keto, Vegan, Mediterranean.
  - Generates full weekly schedules (Breakfast, Lunch, Dinner, Snack) with macro balances.
  - Consolidated categorized grocery checklist (Produce, Proteins, Pantry Staples).

### 5. 📊 Persistent Data Storage & Pantry Radar
- **SQLite Database (`foodverse.db`)**: Houses logged meals, pantry inventory, and inspection audits.
- **Pantry Expiry Radar**: Chronological tracking of fresh goods with color-coded countdowns and quick "Cook with this" actions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, JavaScript (ES Modules), Tailwind CSS, Lucide Icons, Canvas Confetti |
| **CSS Animations** | Scanner laser line, pulse glow rings, glassmorphic backdrop filters, custom scrollbars |
| **Voice & Audio** | Web Speech API (`SpeechSynthesis` voice readout & `SpeechRecognition` voice input) |
| **Backend** | Python 3.14, FastAPI, Uvicorn, Pydantic v2 |
| **Database** | SQLite (with file-based persistence in `foodverse.db`) |
| **Computer Vision & AI** | Multimodal bounding-box heuristics, color histogram browning indicators, USDA nutrition matrix, HACCP regulatory engine |

---

## ⚡ Quick Start

### Option A: Launch with Single Command (Serves Both Backend + Frontend)
```bash
run.bat
```
*Or via terminal:*
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Navigate to: **`http://127.0.0.1:8000`** in your browser.

---

### Option B: Full Development Mode (Hot-Reloading for both Python & React)
```bash
start_dev.bat
```
- **React Frontend**: `http://localhost:5173`
- **FastAPI Backend & Swagger Docs**: `http://127.0.0.1:8000/docs`

---

## 📡 API Endpoints

- `GET /api/status` – Platform health & capabilities
- `POST /api/nutrition/analyze` – Multimodal visual recognition & nutrition decomposition
- `POST /api/nutrition/log` – Save meal to daily diary
- `GET /api/freshness/samples` – Retrieve spoilage scenario presets
- `POST /api/freshness/analyze` – Spoilage diagnostic & shelf life calculation
- `POST /api/hygiene/analyze` – Surveillance audit & PPE compliance check
- `POST /api/cooking/leftover-recipes` – Zero-waste recipe generator
- `POST /api/cooking/meal-plan` – Biometric BMR/TDEE meal planning
- `GET /api/pantry/items` – Active inventory on expiry radar
- `GET /api/analytics/summary` – Holistic dashboard statistics
