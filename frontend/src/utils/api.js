// API Client for FoodVerse AI FastAPI backend

const BASE_URL = ''; // Relative path leverages Vite proxy to http://127.0.0.1:8000

export const api = {
  // Nutrition
  getNutritionSamples: async () => {
    const res = await fetch(`${BASE_URL}/api/nutrition/samples`);
    return res.json();
  },
  analyzeNutrition: async ({ query, sampleId, file }) => {
    const formData = new FormData();
    if (query) formData.append('query', query);
    if (sampleId) formData.append('sample_id', sampleId);
    if (file) formData.append('image', file);
    const res = await fetch(`${BASE_URL}/api/nutrition/analyze`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Image analysis failed. No food recognized in this image.');
    }
    return data;
  },
  logMeal: async (entry) => {
    const res = await fetch(`${BASE_URL}/api/nutrition/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return res.json();
  },
  getFoodLogs: async () => {
    const res = await fetch(`${BASE_URL}/api/nutrition/logs`);
    return res.json();
  },

  // Freshness
  getFreshnessSamples: async () => {
    const res = await fetch(`${BASE_URL}/api/freshness/samples`);
    return res.json();
  },
  analyzeFreshness: async ({ itemName, sampleId, file }) => {
    const formData = new FormData();
    if (itemName) formData.append('item_name', itemName);
    if (sampleId) formData.append('sample_id', sampleId);
    if (file) formData.append('image', file);
    const res = await fetch(`${BASE_URL}/api/freshness/analyze`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },
  saveFreshnessToPantry: async (payload) => {
    const res = await fetch(`${BASE_URL}/api/freshness/save-to-pantry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Hygiene
  getHygieneSamples: async () => {
    const res = await fetch(`${BASE_URL}/api/hygiene/samples`);
    return res.json();
  },
  analyzeHygiene: async ({ sceneDescription, sampleId, file }) => {
    const formData = new FormData();
    if (sceneDescription) formData.append('scene_description', sceneDescription);
    if (sampleId) formData.append('sample_id', sampleId);
    if (file) formData.append('image', file);
    const res = await fetch(`${BASE_URL}/api/hygiene/analyze`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },
  getHygieneAudits: async () => {
    const res = await fetch(`${BASE_URL}/api/hygiene/audits`);
    return res.json();
  },

  // Cooking & Planning
  generateLeftoverRecipes: async ({ ingredients, dietaryPref, cookingSkill, maxTime }) => {
    const res = await fetch(`${BASE_URL}/api/cooking/leftover-recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        available_ingredients: ingredients,
        dietary_preference: dietaryPref,
        cooking_skill: cookingSkill,
        max_time_minutes: maxTime,
      }),
    });
    return res.json();
  },
  generateMealPlan: async (profile) => {
    const res = await fetch(`${BASE_URL}/api/cooking/meal-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  // Pantry
  getPantryItems: async () => {
    const res = await fetch(`${BASE_URL}/api/pantry/items`);
    return res.json();
  },
  addPantryItem: async (item) => {
    const res = await fetch(`${BASE_URL}/api/pantry/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  deletePantryItem: async (itemId) => {
    const res = await fetch(`${BASE_URL}/api/pantry/items/${itemId}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Analytics
  getAnalyticsSummary: async () => {
    const res = await fetch(`${BASE_URL}/api/analytics/summary`);
    return res.json();
  },
};
