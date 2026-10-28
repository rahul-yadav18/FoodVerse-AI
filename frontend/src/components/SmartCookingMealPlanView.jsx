import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, ChefHat, Clock, Play, Pause, RotateCcw, Volume2,
  Calendar, Check, Plus, Trash2, ArrowRight, ArrowLeft, Heart, ShoppingBag, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../utils/api';
import { speakText, stopSpeech } from '../utils/speech';

export function SmartCookingMealPlanView({ voiceEnabled, defaultIngredients = [] }) {
  const [subTab, setSubTab] = useState('leftovers'); // 'leftovers', 'cookingGuide', 'mealPlan'

  // --- Leftover Chef State ---
  const [pantryIngredients, setPantryIngredients] = useState([
    'Eggs', 'Spinach', 'Tomatoes', 'Garlic', 'Avocado', 'Sourdough'
  ]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [dietaryPref, setDietaryPref] = useState('Any');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  // --- Interactive Cook Guide State ---
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerIntervalRef = useRef(null);

  // --- Meal Planner State ---
  const [profile, setProfile] = useState({
    age: 28,
    gender: 'Male',
    weight_kg: 72,
    height_cm: 175,
    activity_level: 'Moderately Active',
    health_goal: 'Weight Loss',
    diet_type: 'Balanced'
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [loadingMealPlan, setLoadingMealPlan] = useState(false);

  // Sync if defaultIngredients passed from pantry
  useEffect(() => {
    if (defaultIngredients && defaultIngredients.length > 0) {
      setPantryIngredients(defaultIngredients);
      fetchLeftoverRecipes(defaultIngredients);
    } else {
      fetchLeftoverRecipes(pantryIngredients);
    }
  }, []);

  // Timer logic for interactive step cooking
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerActive(false);
            if (voiceEnabled) speakText('Timer complete! Proceed to the next step.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerActive, timerSeconds, voiceEnabled]);

  const addIngredient = () => {
    if (customIngredient.trim() && !pantryIngredients.includes(customIngredient.trim())) {
      setPantryIngredients([...pantryIngredients, customIngredient.trim()]);
      setCustomIngredient('');
    }
  };

  const removeIngredient = (ing) => {
    setPantryIngredients(pantryIngredients.filter(i => i !== ing));
  };

  const fetchLeftoverRecipes = async (ingredients = pantryIngredients) => {
    setLoadingRecipes(true);
    try {
      const data = await api.generateLeftoverRecipes({
        ingredients,
        dietaryPref,
        cookingSkill: skillLevel,
        maxTime: 30
      });
      setGeneratedRecipes(data);
      if (data && data.length > 0 && !activeRecipe) {
        setActiveRecipe(data[0]);
      }
    } catch (e) {
      console.error('Failed to generate recipes:', e);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const startInteractiveCooking = (recipe) => {
    setActiveRecipe(recipe);
    setCurrentStepIndex(0);
    const firstStepTime = recipe.steps?.[0]?.timer_seconds || 0;
    setTimerSeconds(firstStepTime);
    setTimerActive(false);
    setSubTab('cookingGuide');
    if (voiceEnabled) {
      speakText(`Starting interactive cooking for ${recipe.title}. Step 1: ${recipe.steps[0].instruction}`);
    }
  };

  const changeStep = (newIndex) => {
    if (!activeRecipe || !activeRecipe.steps) return;
    if (newIndex >= 0 && newIndex < activeRecipe.steps.length) {
      setCurrentStepIndex(newIndex);
      const stepTime = activeRecipe.steps[newIndex]?.timer_seconds || 0;
      setTimerSeconds(stepTime);
      setTimerActive(false);
      if (voiceEnabled) {
        speakText(`Step ${newIndex + 1}: ${activeRecipe.steps[newIndex].instruction}`);
      }
    } else if (newIndex >= activeRecipe.steps.length) {
      // Finished cooking!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (voiceEnabled) {
        speakText('Congratulations! Your meal is complete. Enjoy your culinary creation!');
      }
    }
  };

  const fetchMealPlan = async () => {
    setLoadingMealPlan(true);
    try {
      const data = await api.generateMealPlan(profile);
      setMealPlan(data);
      if (voiceEnabled) {
        speakText(`Generated personalized meal plan targeting ${data.target_calories_daily} calories per day for ${data.goal}.`);
      }
    } catch (e) {
      console.error('Failed to generate meal plan:', e);
    } finally {
      setLoadingMealPlan(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-800 pb-3 space-x-3">
        <button
          onClick={() => setSubTab('leftovers')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'leftovers'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ChefHat className="w-4 h-4 text-cyan-400" />
          <span>Zero-Waste Pantry Chef</span>
        </button>

        <button
          onClick={() => setSubTab('cookingGuide')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'cookingGuide'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Interactive Voice Assistant & Timers</span>
          {activeRecipe && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-1" />
          )}
        </button>

        <button
          onClick={() => {
            setSubTab('mealPlan');
            if (!mealPlan) fetchMealPlan();
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'mealPlan'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Personalized Biometric Meal Planner</span>
        </button>
      </div>

      {/* TAB 1: ZERO-WASTE PANTRY CHEF */}
      {subTab === 'leftovers' && (
        <div className="space-y-8">
          
          {/* Ingredient Selector Box */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <ChefHat className="w-6 h-6 text-cyan-400" />
                <span>What Ingredients Do You Have Right Now?</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                FoodVerse AI will design waste-minimizing, chef-quality recipes using what's in your fridge.
              </p>
            </div>

            {/* Current Active Ingredient Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {pantryIngredients.map((ing) => (
                <span
                  key={ing}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 text-xs font-semibold flex items-center space-x-2 shadow-sm"
                >
                  <span>{ing}</span>
                  <button
                    onClick={() => removeIngredient(ing)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Input to add more */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="text"
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                placeholder="Add ingredient (e.g. Rice, Bell pepper, Tofu, Salmon)..."
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={addIngredient}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                + Add
              </button>
              <button
                onClick={() => fetchLeftoverRecipes()}
                disabled={loadingRecipes}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
              >
                {loadingRecipes ? 'Cooking Recipes...' : 'Generate AI Recipes'}
              </button>
            </div>
          </div>

          {/* Generated Recipe Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6 hover:border-cyan-500/40 transition-all shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        {recipe.tags?.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {recipe.title}
                      </h3>
                    </div>
                    <span className="text-lg font-black text-cyan-400">
                      {recipe.calories_per_serving} <span className="text-[10px] font-normal text-slate-400">kcal</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {recipe.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Prep Time</span>
                      <span className="font-bold text-white">{recipe.prep_time_minutes} min</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Cook Time</span>
                      <span className="font-bold text-white">{recipe.cook_time_minutes} min</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Difficulty</span>
                      <span className="font-bold text-emerald-400">{recipe.difficulty}</span>
                    </div>
                  </div>

                  {/* Missing Staples */}
                  {recipe.missing_pantry_staples?.length > 0 && (
                    <div className="text-[11px] text-slate-400">
                      <span className="font-bold text-slate-300">Staples needed: </span>
                      <span>{recipe.missing_pantry_staples.join(', ')}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => startInteractiveCooking(recipe)}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Step-by-Step Cooking Guide</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE COOK GUIDE & VOICE ASSISTANT */}
      {subTab === 'cookingGuide' && (
        <div className="space-y-8">
          {activeRecipe ? (
            <div className="glass-panel p-8 rounded-2xl border border-cyan-500/30 shadow-2xl space-y-6">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Interactive Smart Cooking Assistant
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {activeRecipe.title}
                  </h2>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => speakText(`Step ${currentStepIndex + 1}: ${activeRecipe.steps[currentStepIndex].instruction}`)}
                    className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700"
                  >
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>Read Step Aloud</span>
                  </button>
                  <span className="px-3 py-1.5 bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 rounded-xl text-xs font-bold">
                    Step {currentStepIndex + 1} of {activeRecipe.steps.length}
                  </span>
                </div>
              </div>

              {/* Step Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentStepIndex + 1) / activeRecipe.steps.length) * 100}%` }}
                />
              </div>

              {/* Main Active Step Card */}
              <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-6">
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white font-extrabold flex items-center justify-center text-lg shadow-lg shadow-cyan-500/25">
                    {currentStepIndex + 1}
                  </div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Current Instruction</span>
                </div>

                <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                  {activeRecipe.steps[currentStepIndex]?.instruction}
                </p>

                {activeRecipe.steps[currentStepIndex]?.tip && (
                  <div className="p-4 bg-cyan-950/20 border border-cyan-800/30 rounded-xl text-xs text-cyan-300 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Pro Tip: </strong>{activeRecipe.steps[currentStepIndex].tip}</span>
                  </div>
                )}

                {/* Built-in Smart Timer if Step Has Duration */}
                {activeRecipe.steps[currentStepIndex]?.timer_seconds && (
                  <div className="p-6 bg-[#0b0f19] border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Clock className="w-8 h-8 text-cyan-400 animate-pulse" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Precision Cook Timer</div>
                        <div className="text-3xl font-black font-mono text-cyan-300">
                          {formatTimer(timerSeconds)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setTimerActive(!timerActive)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
                          timerActive
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                            : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                        }`}
                      >
                        {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{timerActive ? 'Pause Timer' : 'Start Timer'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setTimerActive(false);
                          setTimerSeconds(activeRecipe.steps[currentStepIndex]?.timer_seconds || 0);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => changeStep(currentStepIndex - 1)}
                  disabled={currentStepIndex === 0}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <button
                  onClick={() => changeStep(currentStepIndex + 1)}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/25"
                >
                  <span>{currentStepIndex === activeRecipe.steps.length - 1 ? 'Finish Recipe' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-16 rounded-2xl text-center space-y-4">
              <ChefHat className="w-12 h-12 text-slate-500 mx-auto" />
              <p className="text-lg font-bold text-white">No active recipe selected.</p>
              <p className="text-xs text-slate-400">Head back to the Zero-Waste Pantry Chef tab to choose or generate a recipe.</p>
              <button
                onClick={() => setSubTab('leftovers')}
                className="px-4 py-2 bg-cyan-500 text-white text-xs font-bold rounded-xl"
              >
                Go to Pantry Chef
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PERSONALIZED BIOMETRIC MEAL PLANNER */}
      {subTab === 'mealPlan' && (
        <div className="space-y-8">
          
          {/* Biometrics Form */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-xl font-black text-white flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-cyan-400" />
              <span>Biometric & Metabolic Nutrition Calibrator</span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weight_kg}
                  onChange={(e) => setProfile({ ...profile, weight_kg: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={profile.height_cm}
                  onChange={(e) => setProfile({ ...profile, height_cm: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Health Goal</label>
                <select
                  value={profile.health_goal}
                  onChange={(e) => setProfile({ ...profile, health_goal: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Diabetic Health">Diabetic Control</option>
                  <option value="Heart Health">Heart Health</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Diet Style</label>
                <select
                  value={profile.diet_type}
                  onChange={(e) => setProfile({ ...profile, diet_type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Keto">Keto</option>
                  <option value="Vegan">Vegan</option>
                  <option value="High-Protein">High-Protein</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={fetchMealPlan}
                disabled={loadingMealPlan}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                {loadingMealPlan ? 'Computing Metabolic Targets...' : 'Generate Biometric Meal Plan'}
              </button>
            </div>
          </div>

          {/* Generated Meal Plan Display */}
          {mealPlan && (
            <div className="space-y-6">
              
              {/* Daily Target Summary Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Target Metabolic Budget
                  </span>
                  <div className="text-3xl font-black text-white mt-1">
                    {mealPlan.target_calories_daily} <span className="text-sm font-normal text-slate-400">kcal/day</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{mealPlan.hydration_advice}</p>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  {Object.entries(mealPlan.macro_distribution || {}).map(([m, p]) => (
                    <div key={m} className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
                      <span className="text-slate-400 capitalize block text-[10px]">{m}</span>
                      <span className="font-bold text-white">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Days Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mealPlan.days?.map((day, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h3 className="font-extrabold text-white text-sm">{day.day}</h3>
                      <span className="text-xs font-bold text-cyan-400">{day.total_calories} kcal</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span className="font-bold text-amber-400 uppercase text-[10px]">Breakfast</span>
                          <span>{day.breakfast.prep_time}</span>
                        </div>
                        <div className="font-semibold text-slate-200">{day.breakfast.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{day.breakfast.cals} kcal • {day.breakfast.macros}</div>
                      </div>

                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span className="font-bold text-emerald-400 uppercase text-[10px]">Lunch</span>
                          <span>{day.lunch.prep_time}</span>
                        </div>
                        <div className="font-semibold text-slate-200">{day.lunch.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{day.lunch.cals} kcal • {day.lunch.macros}</div>
                      </div>

                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span className="font-bold text-cyan-400 uppercase text-[10px]">Dinner</span>
                          <span>{day.dinner.prep_time}</span>
                        </div>
                        <div className="font-semibold text-slate-200">{day.dinner.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{day.dinner.cals} kcal • {day.dinner.macros}</div>
                      </div>

                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span className="font-bold text-indigo-400 uppercase text-[10px]">Snack</span>
                          <span>{day.snack.prep_time}</span>
                        </div>
                        <div className="font-semibold text-slate-200">{day.snack.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{day.snack.cals} kcal • {day.snack.macros}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Consolidated Grocery Shopping Checklist */}
              {mealPlan.grocery_list && (
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-cyan-400" />
                    <span>Consolidated Smart Grocery Checklist</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {Object.entries(mealPlan.grocery_list).map(([category, items]) => (
                      <div key={category} className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
                        <span className="font-bold text-cyan-300 uppercase text-[10px] block border-b border-slate-800 pb-1">
                          {category}
                        </span>
                        <ul className="space-y-1">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-center space-x-2 text-slate-300">
                              <Check className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

    </div>
  );
}
