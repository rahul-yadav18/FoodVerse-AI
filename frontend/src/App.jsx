import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FoodNutritionView } from './components/FoodNutritionView';
import { FreshnessSpoilageView } from './components/FreshnessSpoilageView';
import { HygieneMonitoringView } from './components/HygieneMonitoringView';
import { SmartCookingMealPlanView } from './components/SmartCookingMealPlanView';
import { PantryDashboardView } from './components/PantryDashboardView';
import { Cpu, Database, Server, Sparkles, Layers } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('nutrition');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [backendHealthy, setBackendHealthy] = useState(true);
  const [cookingIngredients, setCookingIngredients] = useState([]);

  // Check FastAPI backend connection on startup
  useEffect(() => {
    fetch('/api/nutrition/samples')
      .then((res) => {
        if (res.ok) setBackendHealthy(true);
      })
      .catch((err) => {
        console.warn('Backend connection warning:', err);
        setBackendHealthy(false);
      });
  }, []);

  const handleCookWithPantry = (ingredients) => {
    setCookingIngredients(ingredients);
    setActiveTab('cooking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      
      {/* Top Application Header */}
      <Header
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        backendHealthy={backendHealthy}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Module 1: Food Recognition & Nutrition */}
        {activeTab === 'nutrition' && (
          <FoodNutritionView
            voiceEnabled={voiceEnabled}
            onLoggedMeal={() => {}}
          />
        )}

        {/* Module 2: Freshness & Spoilage Detection */}
        {activeTab === 'freshness' && (
          <FreshnessSpoilageView
            voiceEnabled={voiceEnabled}
            onPantryUpdated={() => {}}
          />
        )}

        {/* Module 3: Restaurant Hygiene & Safety */}
        {activeTab === 'hygiene' && (
          <HygieneMonitoringView
            voiceEnabled={voiceEnabled}
          />
        )}

        {/* Module 4: Smart Cooking Assistance & Meal Planner */}
        {activeTab === 'cooking' && (
          <SmartCookingMealPlanView
            voiceEnabled={voiceEnabled}
            defaultIngredients={cookingIngredients}
          />
        )}

        {/* Storage & Analytics Dashboard */}
        {activeTab === 'dashboard' && (
          <PantryDashboardView
            onCookWithIngredients={handleCookWithPantry}
          />
        )}

      </main>

      {/* Futuristic Technical Architecture Summary Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080c14] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800/60">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-200 font-bold">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Multimodal AI Layer</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Integrates vision-based plate decomposition, color degradation spoilage curves, and HACCP compliance neural heuristics.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-200 font-bold">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>FastAPI Microservice</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                High-throughput async Python backend providing REST APIs, multipart image uploads, and real-time inference routing.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-200 font-bold">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Dynamic UI & Animations</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                React 19 + Tailwind CSS with glassmorphism, scanner lasers, speech synthesis, and live webcam stream integration.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-200 font-bold">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Persistent Data Engine</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                SQLite relational store housing daily calorie macros, pantry expiry timelines, and restaurant surveillance audits.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <div>
              FoodVerse AI • Multimodal Food Intelligence Agent • Powered by React, Python & FastAPI
            </div>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>All 4 Core Pillars Operational</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
