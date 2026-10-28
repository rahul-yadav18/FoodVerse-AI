import sqlite3
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "foodverse.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Pantry Items Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pantry (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        purchase_date TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        days_left INTEGER NOT NULL,
        freshness_status TEXT NOT NULL,
        quantity TEXT NOT NULL,
        notes TEXT
    )
    """)

    # Daily Food Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS food_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        dish_name TEXT NOT NULL,
        calories INTEGER NOT NULL,
        protein REAL NOT NULL,
        carbs REAL NOT NULL,
        fat REAL NOT NULL,
        fiber REAL DEFAULT 0,
        nutri_score TEXT NOT NULL
    )
    """)

    # Hygiene Inspection Audits Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hygiene_audits (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        inspection_type TEXT NOT NULL,
        overall_score INTEGER NOT NULL,
        grade TEXT NOT NULL,
        pass_status INTEGER NOT NULL,
        summary TEXT NOT NULL,
        violations_json TEXT,
        metrics_json TEXT
    )
    """)

    # Saved Recipes Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_recipes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        prep_time_minutes INTEGER NOT NULL,
        cook_time_minutes INTEGER NOT NULL,
        calories INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        ingredients_json TEXT NOT NULL,
        steps_json TEXT NOT NULL,
        tags_json TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # Seed initial pantry items if empty
    cursor.execute("SELECT COUNT(*) FROM pantry")
    if cursor.fetchone()[0] == 0:
        today = datetime.now()
        initial_pantry = [
            ("p1", "Organic Hass Avocados", "Produce", today.strftime("%Y-%m-%d"), (today + timedelta(days=2)).strftime("%Y-%m-%d"), 2, "Consume Soon", "3 pcs", "Ripe, great for guacamole"),
            ("p2", "Greek Whole Milk Yogurt", "Dairy", (today - timedelta(days=3)).strftime("%Y-%m-%d"), (today + timedelta(days=4)).strftime("%Y-%m-%d"), 4, "Good Condition", "500g", "Kept in cold fridge door"),
            ("p3", "Fresh Spinach Leaves", "Vegetables", today.strftime("%Y-%m-%d"), (today + timedelta(days=3)).strftime("%Y-%m-%d"), 3, "Good Condition", "250g bag", "Airtight crisp container"),
            ("p4", "Chicken Breast Fillets", "Meat", today.strftime("%Y-%m-%d"), (today + timedelta(days=1)).strftime("%Y-%m-%d"), 1, "Consume Soon", "500g", "Vacuum packed"),
            ("p5", "Artisan Sourdough Loaf", "Bakery", (today - timedelta(days=1)).strftime("%Y-%m-%d"), (today + timedelta(days=5)).strftime("%Y-%m-%d"), 5, "Peak Freshness", "1 loaf", "Linen bread bag"),
            ("p6", "Bananas (Cavendish)", "Produce", (today - timedelta(days=4)).strftime("%Y-%m-%d"), (today + timedelta(days=1)).strftime("%Y-%m-%d"), 1, "Onset Spoilage", "4 pcs", "Speckled with sugar spots - bake into bread!")
        ]
        cursor.executemany("INSERT INTO pantry VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", initial_pantry)

    # Seed initial food log entries if empty
    cursor.execute("SELECT COUNT(*) FROM food_logs")
    if cursor.fetchone()[0] == 0:
        now = datetime.now()
        initial_logs = [
            ("l1", (now - timedelta(hours=4)).strftime("%Y-%m-%d 08:30"), "Breakfast", "Avocado Toast with Poached Egg", 380, 16.5, 34.0, 19.5, 7.2, "A"),
            ("l2", (now - timedelta(hours=1)).strftime("%Y-%m-%d 13:00"), "Lunch", "Mediterranean Grilled Salmon Bowl", 540, 42.0, 45.0, 18.0, 6.8, "A"),
        ]
        cursor.executemany("INSERT INTO food_logs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", initial_logs)

    # Seed hygiene audit record if empty
    cursor.execute("SELECT COUNT(*) FROM hygiene_audits")
    if cursor.fetchone()[0] == 0:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        sample_violations = json.dumps([
            {
                "id": "v-101",
                "severity": "Critical",
                "category": "Cross-Contamination",
                "description": "Uncooked poultry prep board placed adjacent to freshly cut salad greens.",
                "haccp_fda_code": "FDA 3-302.11 Separation of Raw & RTE Foods",
                "corrective_action": "Relocate raw poultry to red-designated station; sanitize surface with quaternary ammonium compound."
            }
        ])
        sample_metrics = json.dumps({"ppe_compliance": 92, "surface_cleanliness": 88, "temp_safety": 96})
        cursor.execute(
            "INSERT INTO hygiene_audits VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            ("ha-sample-1", now_str, "Prep Station & Line", 91, "A", 1, "Kitchen maintains high PPE compliance. Minor spatial risk remediated immediately.", sample_violations, sample_metrics)
        )

    conn.commit()
    conn.close()

# Pantry helpers
def get_all_pantry() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pantry ORDER BY days_left ASC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

def add_pantry_item(item: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO pantry VALUES (:id, :name, :category, :purchase_date, :expiry_date, :days_left, :freshness_status, :quantity, :notes)",
        item
    )
    conn.commit()
    conn.close()
    return item

def delete_pantry_item(item_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM pantry WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()

# Food log helpers
def get_food_logs() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM food_logs ORDER BY timestamp DESC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

def add_food_log(entry: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO food_logs VALUES (:id, :timestamp, :meal_type, :dish_name, :calories, :protein, :carbs, :fat, :fiber, :nutri_score)",
        entry
    )
    conn.commit()
    conn.close()
    return entry

# Hygiene audit helpers
def get_hygiene_audits() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM hygiene_audits ORDER BY timestamp DESC")
    rows = []
    for r in cursor.fetchall():
        d = dict(r)
        d["violations"] = json.loads(d["violations_json"]) if d.get("violations_json") else []
        d["metrics"] = json.loads(d["metrics_json"]) if d.get("metrics_json") else {}
        rows.append(d)
    conn.close()
    return rows

def add_hygiene_audit(audit: Dict[str, Any]):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO hygiene_audits VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            audit["id"],
            audit["timestamp"],
            audit["inspection_type"],
            audit["overall_score"],
            audit["grade"],
            1 if audit.get("pass_status", True) else 0,
            audit["summary"],
            json.dumps(audit.get("violations", [])),
            json.dumps(audit.get("cleanliness_metrics", {}))
        )
    )
    conn.commit()
    conn.close()
