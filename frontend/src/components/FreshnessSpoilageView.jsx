import React, { useState, useEffect } from 'react';
import {
  Eye, Thermometer, Droplets, Clock, AlertOctagon, CheckCircle2,
  BookmarkPlus, Sparkles, Camera, Upload, ShieldAlert, Check
} from 'lucide-react';
import { api } from '../utils/api';
import { speakText } from '../utils/speech';
import { CameraCaptureModal } from './CameraCaptureModal';

const SAMPLE_FRESHNESS_IMAGES = {
  banana_ripe: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
  banana_overripe: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
  salmon_fresh: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  avocado_spoiled: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
  spinach_crisp: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
};

export function FreshnessSpoilageView({ voiceEnabled, onPantryUpdated }) {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState('banana_overripe');
  const [searchItem, setSearchItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [freshnessData, setFreshnessData] = useState(null);
  const [activeImage, setActiveImage] = useState(SAMPLE_FRESHNESS_IMAGES.banana_overripe);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [savedToPantry, setSavedToPantry] = useState(false);

  useEffect(() => {
    loadSamples();
    fetchAnalysis(null, 'banana_overripe');
  }, []);

  const loadSamples = async () => {
    try {
      const data = await api.getFreshnessSamples();
      setSamples(data);
    } catch (e) {
      console.error('Failed to load freshness samples:', e);
    }
  };

  const fetchAnalysis = async (itemName = null, sampleId = null, file = null, customImageUrl = null) => {
    setLoading(true);
    setSavedToPantry(false);
    try {
      const result = await api.analyzeFreshness({
        itemName,
        sampleId,
        file,
      });
      setFreshnessData(result);
      if (customImageUrl) {
        setActiveImage(customImageUrl);
      } else if (sampleId && SAMPLE_FRESHNESS_IMAGES[sampleId]) {
        setActiveImage(SAMPLE_FRESHNESS_IMAGES[sampleId]);
      } else {
        setActiveImage(SAMPLE_FRESHNESS_IMAGES.banana_ripe);
      }

      if (voiceEnabled && result) {
        speakText(
          `Freshness analysis for ${result.item_name}: Status is ${result.status} with a freshness score of ${result.freshness_score} percent. ${result.safety_verdict}`
        );
      }
    } catch (e) {
      console.error('Error analyzing freshness:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      fetchAnalysis(file.name.replace(/\.[^/.]+$/, ''), null, file, event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (photoDataUrl) => {
    fetchAnalysis('Scanned Produce Item', null, null, photoDataUrl);
  };

  const handleSaveToPantry = async () => {
    if (!freshnessData) return;
    try {
      await api.saveFreshnessToPantry({
        item_name: freshnessData.item_name,
        category: freshnessData.category,
        estimated_shelf_life_days: freshnessData.estimated_shelf_life_days,
        status: freshnessData.status,
        safety_verdict: freshnessData.safety_verdict,
        quantity: '1 batch'
      });
      setSavedToPantry(true);
      if (onPantryUpdated) onPantryUpdated();
      if (voiceEnabled) speakText('Added item to Pantry Expiry Radar.');
    } catch (e) {
      console.error('Failed to save to pantry:', e);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Search & Input Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchAnalysis(searchItem, null)}
              placeholder="E.g., Overripe speckled banana, Fresh Atlantic salmon, Hass avocado..."
              className="w-full pl-4 pr-24 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all"
            />
            <button
              onClick={() => fetchAnalysis(searchItem, null)}
              className="absolute right-2 top-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-md transition-all"
            >
              Analyze
            </button>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Camera Scan</span>
            </button>
            <label className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Upload Produce Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Preset Samples */}
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Spoilage Diagnostic Samples:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samples.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSample(s.id);
                  setSearchItem('');
                  fetchAnalysis(null, s.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSample === s.id && !searchItem
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {s.item_name} ({s.freshness_score}%)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Freshness Inspection Viewport */}
      {loading ? (
        <div className="glass-panel p-16 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-lg font-bold text-slate-200">Evaluating Visual Decay Markers & Spoilage Index...</p>
        </div>
      ) : freshnessData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image & Freshness Meter Gauge */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              
              <div className="relative aspect-video max-h-[360px] bg-black overflow-hidden">
                <img
                  src={activeImage}
                  alt={freshnessData.item_name}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Overlay Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    style={{ backgroundColor: `${freshnessData.status_color}25`, borderColor: `${freshnessData.status_color}80`, color: freshnessData.status_color }}
                    className="px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg"
                  >
                    {freshnessData.status}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Freshness Score</div>
                  <div className="text-2xl font-black" style={{ color: freshnessData.status_color }}>
                    {freshnessData.freshness_score}%
                  </div>
                </div>
              </div>

              {/* Title & Safety Statement */}
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {freshnessData.category}
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    {freshnessData.item_name}
                  </h2>
                </div>

                <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                  freshnessData.safe_to_eat
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  {freshnessData.safe_to_eat ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-sm mb-1">
                      {freshnessData.safe_to_eat ? 'Safe for Consumption' : 'Spoilage Hazard / Do Not Ingest'}
                    </div>
                    <div className="leading-relaxed opacity-90">{freshnessData.safety_verdict}</div>
                  </div>
                </div>

                {/* Add to Pantry Radar Action */}
                <button
                  onClick={handleSaveToPantry}
                  disabled={savedToPantry}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                    savedToPantry
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {savedToPantry ? (
                    <>
                      <Check className="w-4 h-4 text-amber-400" />
                      <span>Tracking on Pantry Expiry Radar</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Track on Pantry Expiry Radar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Zero-Waste Culinary Repurposing Ideas */}
            {freshnessData.cooking_alternatives_if_ripe?.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Zero-Waste Culinary Repurposing</span>
                </h3>
                <ul className="space-y-2">
                  {freshnessData.cooking_alternatives_if_ripe.map((alt, i) => (
                    <li key={i} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span>{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Spoilage Diagnostic & Scientific Storage */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Shelf-Life Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
                <Clock className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">Room Ambient</span>
                <div className="text-3xl font-black text-amber-400 mt-1">
                  {freshnessData.estimated_shelf_life_days}
                  <span className="text-xs font-medium text-slate-400 ml-1">days</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">At ~20°C</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
                <Thermometer className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">Chilled Fridge</span>
                <div className="text-3xl font-black text-cyan-400 mt-1">
                  {freshnessData.shelf_life_cold_days}
                  <span className="text-xs font-medium text-slate-400 ml-1">days</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">At 1°C - 4°C</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
                <Droplets className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">Deep Freezer</span>
                <div className="text-3xl font-black text-indigo-400 mt-1">
                  {freshnessData.shelf_life_freezer_days}
                  <span className="text-xs font-medium text-slate-400 ml-1">days</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">At -18°C</span>
              </div>
            </div>

            {/* Visual Spoilage Markers */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Detected Biological Decay Markers</span>
              </h3>
              <div className="space-y-3">
                {freshnessData.spoilage_markers?.map((marker, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{marker.feature}</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        marker.severity === 'None' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        marker.severity === 'Low' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {marker.severity} Severity ({marker.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          marker.severity === 'None' ? 'bg-emerald-400' :
                          marker.severity === 'Low' ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.max(5, marker.percentage)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{marker.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific Storage Optimization Guide */}
            {freshnessData.storage_advice && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-emerald-400" />
                  <span>Scientific Storage Preservation Guide</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Optimal Temperature</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{freshnessData.storage_advice.optimal_temperature_c}</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Relative Humidity</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{freshnessData.storage_advice.ideal_humidity}</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Container Type</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{freshnessData.storage_advice.best_container}</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Ethylene Sensitivity</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{freshnessData.storage_advice.ethylene_gas_sensitivity}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  {freshnessData.storage_advice.storage_tips?.map((tip, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      ) : null}

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        title="Scan Food or Produce for Freshness"
      />
    </div>
  );
}
