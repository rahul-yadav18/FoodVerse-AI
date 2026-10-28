import React, { useState, useEffect } from 'react';
import {
  Apple, Flame, Heart, AlertTriangle, ShieldCheck, Check,
  Camera, Upload, Mic, MicOff, Sparkles, PlusCircle, Volume2, AlertOctagon
} from 'lucide-react';
import { api } from '../utils/api';
import { speakText, createSpeechRecognizer } from '../utils/speech';
import { CameraCaptureModal } from './CameraCaptureModal';

// High-definition sample image representations
const SAMPLE_IMAGES = {
  avocado_toast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  salmon_quinoa_bowl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  chicken_biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  berry_acai_bowl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
  caesar_salad: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
};

export function FoodNutritionView({ voiceEnabled, onLoggedMeal }) {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState('salmon_quinoa_bowl');
  const [queryText, setQueryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeImage, setActiveImage] = useState(SAMPLE_IMAGES.salmon_quinoa_bowl);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loggedStatus, setLoggedStatus] = useState(false);

  // Load sample options on mount
  useEffect(() => {
    loadSamples();
    fetchAnalysis(null, 'salmon_quinoa_bowl');
  }, []);

  const loadSamples = async () => {
    try {
      const data = await api.getNutritionSamples();
      setSamples(data);
    } catch (e) {
      console.error('Failed to load nutrition samples:', e);
    }
  };

  const fetchAnalysis = async (query = null, sampleId = null, file = null, customImageUrl = null) => {
    setLoading(true);
    setLoggedStatus(false);
    setErrorMessage(null);
    try {
      const result = await api.analyzeNutrition({
        query: query,
        sampleId: sampleId,
        file: file,
      });
      setNutritionData(result);
      if (customImageUrl) {
        setActiveImage(customImageUrl);
      } else if (sampleId && SAMPLE_IMAGES[sampleId]) {
        setActiveImage(SAMPLE_IMAGES[sampleId]);
      } else {
        setActiveImage(SAMPLE_IMAGES.salmon_quinoa_bowl);
      }

      if (voiceEnabled && result) {
        speakText(
          `Identified ${result.dish_name}. It contains ${result.total_calories} calories with ${result.macronutrients.protein} grams of protein. Health score is ${result.health_rating} out of 100.`
        );
      }
    } catch (e) {
      console.error('Error analyzing nutrition:', e);
      setNutritionData(null);
      setErrorMessage(e.message || 'Image validation failed: No recognizable food detected.');
      if (customImageUrl) {
        setActiveImage(customImageUrl);
      }
      if (voiceEnabled) {
        speakText('No recognizable food detected in this image.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Voice Search
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsListening(false);
        setQueryText(transcript);
        fetchAnalysis(transcript, null);
      },
      (err) => {
        setIsListening(false);
        console.warn('Speech recognition error:', err);
      }
    );
    if (recognizer) {
      setIsListening(true);
      recognizer.start();
    } else {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge.');
    }
  };

  // Handle File Upload - pass image directly to CV, do not rely on filename
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      fetchAnalysis(null, null, file, imageUrl);
    };
    reader.readAsDataURL(file);
  };

  // Handle Camera Capture
  const handleCameraCapture = async (photoDataUrl) => {
    try {
      const res = await fetch(photoDataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'camera_snapshot.jpg', { type: 'image/jpeg' });
      fetchAnalysis(null, null, file, photoDataUrl);
    } catch (e) {
      fetchAnalysis(null, null, null, photoDataUrl);
    }
  };

  // Save to daily journal
  const handleLogMeal = async () => {
    if (!nutritionData) return;
    try {
      await api.logMeal({
        dish_name: nutritionData.dish_name,
        calories: nutritionData.total_calories,
        protein: nutritionData.macronutrients.protein,
        carbs: nutritionData.macronutrients.carbs,
        fat: nutritionData.macronutrients.fat,
        fiber: nutritionData.macronutrients.fiber,
        nutri_score: nutritionData.nutri_score,
        meal_type: 'Meal Scan'
      });
      setLoggedStatus(true);
      if (onLoggedMeal) onLoggedMeal();
      if (voiceEnabled) speakText('Meal saved to your daily nutrition log.');
    } catch (err) {
      console.error('Failed to log meal:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Multimodal Control Center */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Text / Prompt input with mic */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchAnalysis(queryText, null)}
              placeholder="E.g., Salmon quinoa bowl, Sourdough avocado toast, or describe your meal..."
              className="w-full pl-4 pr-24 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
            />
            <div className="absolute right-2 top-2 flex items-center space-x-1">
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                }`}
                title="Voice Query (Web Speech)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => fetchAnalysis(queryText, null)}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-md transition-all"
              >
                Scan
              </button>
            </div>
          </div>

          {/* Action buttons: Camera + File Upload */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Live Camera</span>
            </button>
            <label className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Multimodal Dish Presets:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samples.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSample(s.id);
                  setQueryText('');
                  fetchAnalysis(null, s.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSample === s.id && !queryText
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {s.dish_name} ({s.calories} kcal)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Alert Display when Image Recognition Fails / Non-food Detected */}
      {errorMessage && (
        <div className="p-6 bg-rose-950/40 border-2 border-rose-500/50 rounded-2xl flex items-start space-x-4 text-rose-200 shadow-2xl animate-fadeIn">
          <AlertOctagon className="w-7 h-7 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-white uppercase tracking-wider">
                Food Recognition Failed
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                Non-Food Rejected
              </span>
            </div>
            <p className="text-xs text-rose-300 leading-relaxed font-medium">
              {errorMessage}
            </p>
            <div className="text-[11px] text-slate-400 pt-1">
              Tip: Ensure the photo clearly shows a meal, plated dish, fruit, vegetable, or ingredient. Landscape, scenic, or non-food pictures will be automatically rejected.
            </div>
          </div>
        </div>
      )}

      {/* Main Analysis Display */}
      {loading ? (
        <div className="glass-panel p-16 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto" />
          <p className="text-lg font-bold text-slate-200">Processing Multimodal Food Vision...</p>
          <p className="text-sm text-slate-400">Decomposing components, calculating macros & glycemic impact...</p>
        </div>
      ) : nutritionData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Detection Overlay & Dish Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 relative group shadow-2xl">
              
              {/* Image Frame with Bounding Boxes */}
              <div className="relative aspect-square max-h-[420px] bg-black overflow-hidden">
                <img
                  src={activeImage}
                  alt={nutritionData.dish_name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Visual Bounding Boxes overlay */}
                {nutritionData.components?.map((comp, idx) => {
                  if (!comp.bounding_box) return null;
                  const [left, top, width, height] = comp.bounding_box;
                  return (
                    <div
                      key={idx}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${width}%`,
                        height: `${height}%`,
                      }}
                      className="absolute border-2 border-emerald-400/80 bg-emerald-500/10 rounded-lg pointer-events-none transition-all duration-300"
                    >
                      <span className="absolute -top-6 left-0 px-2 py-0.5 bg-slate-900/90 text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-500/30 whitespace-nowrap shadow-md">
                        {comp.name} ({Math.round(comp.confidence * 100)}%)
                      </span>
                    </div>
                  );
                })}

                {/* Nutri-Score Floating Badge */}
                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 shadow-xl">
                  <span className="text-[11px] font-bold text-slate-300 uppercase">Nutri-Score</span>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-sm text-white ${
                    nutritionData.nutri_score === 'A' ? 'bg-emerald-600' :
                    nutritionData.nutri_score === 'B' ? 'bg-lime-600' :
                    nutritionData.nutri_score === 'C' ? 'bg-amber-600' : 'bg-rose-600'
                  }`}>
                    {nutritionData.nutri_score}
                  </span>
                </div>
              </div>

              {/* Dish Meta */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      {nutritionData.cuisine} • {nutritionData.category}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">
                      {nutritionData.dish_name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Standard Serving: {nutritionData.serving_size}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-emerald-400">
                      {nutritionData.total_calories}
                    </span>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                      Total kcal
                    </span>
                  </div>
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {nutritionData.dietary_tags?.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold">
                    GI {nutritionData.glycemic_index} ({nutritionData.glycemic_load} Load)
                  </span>
                </div>

                {/* Allergen Warning Banner if any */}
                {nutritionData.allergens?.length > 0 && (
                  <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl flex items-start space-x-2.5 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Allergen Notice: </span>
                      <span>Contains {nutritionData.allergens.join(', ')}.</span>
                    </div>
                  </div>
                )}

                {/* Log Meal Action Button */}
                <button
                  onClick={handleLogMeal}
                  disabled={loggedStatus}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                    loggedStatus
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {loggedStatus ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Logged to Daily Diary</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Log Dish to Daily Food Journal</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Detected Component breakdown */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Detected Plate Components</span>
                <span className="text-emerald-400">{nutritionData.components?.length} items</span>
              </h3>
              <div className="space-y-2">
                {nutritionData.components?.map((comp, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{comp.name}</div>
                      <div className="text-[11px] text-slate-400">{comp.portion}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">{comp.calories} kcal</div>
                      <div className="text-[10px] text-slate-400">
                        {comp.protein}g P | {comp.carbs}g C | {comp.fat}g F
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Macronutrients & Health Insights */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Macro Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Protein */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Protein</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {nutritionData.macronutrients.protein}g
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (nutritionData.macronutrients.protein / 50) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Muscle Recovery</span>
              </div>

              {/* Carbohydrates */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Carbs</span>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {nutritionData.macronutrients.carbs}g
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (nutritionData.macronutrients.carbs / 80) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">{nutritionData.macronutrients.fiber}g Fiber</span>
              </div>

              {/* Fats */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Lipids / Fat</span>
                <div className="text-2xl font-black text-amber-400 mt-1">
                  {nutritionData.macronutrients.fat}g
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (nutritionData.macronutrients.fat / 40) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Essential Lipids</span>
              </div>

              {/* Health Score */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Health Rating</span>
                <div className="text-2xl font-black text-indigo-400 mt-1">
                  {nutritionData.health_rating}/100
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${nutritionData.health_rating}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">AI Holistic Index</span>
              </div>
            </div>

            {/* Micronutrient Profile Radar */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span>Key Micronutrients & Bioactive Compounds</span>
                </h3>
                <span className="text-xs text-slate-400">% Daily Value (DV)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {nutritionData.micronutrients?.map((micro, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-1">
                    <span className="text-xs font-semibold text-slate-300 block truncate">{micro.name}</span>
                    <div className="text-lg font-bold text-emerald-400">{micro.amount}</div>
                    <div className="text-[10px] font-semibold text-slate-400">{micro.daily_value_pct}% DV</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific AI Insights */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Multimodal Vision & Biochemical Insights</span>
              </h3>
              <ul className="space-y-2.5">
                {nutritionData.insights?.map((insight, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Personalized Dietary Recommendation */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span>AI Dietitian Advice</span>
                </span>
                <button
                  onClick={() => speakText(nutritionData.health_advice)}
                  className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-1"
                  title="Read aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Listen</span>
                </button>
              </div>
              <p className="text-xs leading-relaxed text-slate-200">
                {nutritionData.health_advice}
              </p>
            </div>

          </div>
        </div>
      ) : null}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        title="Scan Dish for Food Recognition & Nutrition"
      />
    </div>
  );
}
