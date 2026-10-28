import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Flame, AlertCircle, Clock, Trash2, Plus,
  Sparkles, Check, Utensils, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { api } from '../utils/api';

export function PantryDashboardView({ onCookWithIngredients }) {
  const [analytics, setAnalytics] = useState(null);
  const [foodLogs, setFoodLogs] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [hygieneAudits, setHygieneAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Pantry Item Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce');
  const [newItemDays, setNewItemDays] = useState(3);
  const [newItemQty, setNewItemQty] = useState('1 unit');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sum, logs, pantry, audits] = await Promise.all([
        api.getAnalyticsSummary(),
        api.getFoodLogs(),
        api.getPantryItems(),
        api.getHygieneAudits()
      ]);
      setAnalytics(sum);
      setFoodLogs(logs);
      setPantryItems(pantry);
      setHygieneAudits(audits);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePantry = async (id) => {
    try {
      await api.deletePantryItem(id);
      setPantryItems(pantryItems.filter(item => item.id !== id));
      loadAllData();
    } catch (e) {
      console.error('Failed to delete item:', e);
    }
  };

  const handleCreatePantry = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    try {
      await api.addPantryItem({
        name: newItemName.trim(),
        category: newItemCategory,
        days_left: newItemDays,
        quantity: newItemQty,
        freshness_status: newItemDays <= 2 ? 'Consume Soon' : 'Good Condition'
      });
      setShowAddModal(false);
      setNewItemName('');
      loadAllData();
    } catch (err) {
      console.error('Failed to add pantry item:', err);
    }
  };

  const handleCookExpiring = () => {
    const expiring = pantryItems
      .filter(item => item.days_left <= 2)
      .map(item => item.name);
    if (onCookWithIngredients) {
      onCookWithIngredients(expiring.length > 0 ? expiring : ['Eggs', 'Spinach']);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Calories Consumed Today */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Today's Calories</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {analytics?.nutrition_summary?.daily_calories || 0}
            <span className="text-xs font-normal text-slate-400 ml-1">/ 2,100 kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${analytics?.nutrition_summary?.calorie_progress_pct || 0}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block">
            {analytics?.nutrition_summary?.meals_logged || 0} meals recorded today
          </span>
        </div>

        {/* Macros Breakdown */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Macronutrient Intake
          </span>
          <div className="grid grid-cols-3 gap-1 text-center pt-1">
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Protein</span>
              <div className="text-sm font-bold text-emerald-400">
                {analytics?.nutrition_summary?.protein_g || 0}g
              </div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Carbs</span>
              <div className="text-sm font-bold text-cyan-400">
                {analytics?.nutrition_summary?.carbs_g || 0}g
              </div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Fat</span>
              <div className="text-sm font-bold text-amber-400">
                {analytics?.nutrition_summary?.fat_g || 0}g
              </div>
            </div>
          </div>
        </div>

        {/* Pantry Radar Status */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Pantry Expiry Radar</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {analytics?.pantry_summary?.expiring_soon || 0}
            <span className="text-xs font-normal text-slate-400 ml-1">items urgent</span>
          </div>
          <span className="text-xs text-slate-300 block">
            {analytics?.pantry_summary?.total_items || 0} total fresh inventory monitored
          </span>
          <button
            onClick={handleCookExpiring}
            className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>Cook with expiring items</span>
            <span>→</span>
          </button>
        </div>

        {/* Latest Hygiene Audit */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Kitchen Safety Rating</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-black text-white">
              Grade {analytics?.hygiene_summary?.latest_grade || 'A'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-xs">
              {analytics?.hygiene_summary?.latest_score || 95}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {analytics?.hygiene_summary?.total_inspections || 1} surveillance audits completed
          </span>
        </div>

      </div>

      {/* Main Row: Pantry Expiry Radar + Food Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Pantry Expiry Radar */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>Pantry Expiry Radar</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Items dynamically tracked by days until biological decay.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add Item</span>
                </button>
                <button
                  onClick={handleCookExpiring}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cook Urgent</span>
                </button>
              </div>
            </div>

            {/* Inventory List */}
            <div className="space-y-2.5">
              {pantryItems.map((item) => {
                const isUrgent = item.days_left <= 2;
                const isModerate = item.days_left > 2 && item.days_left <= 4;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        isUrgent ? 'bg-rose-500 animate-ping' :
                        isModerate ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <div>
                        <div className="font-bold text-slate-100">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.category} • {item.quantity} • Expires: {item.expiry_date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${
                        isUrgent ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        isModerate ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.days_left} {item.days_left === 1 ? 'day' : 'days'} left
                      </span>
                      <button
                        onClick={() => handleDeletePantry(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Daily Food Log Journal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-emerald-400" />
              <span>Daily Nutrition Log Journal</span>
            </h3>

            <div className="space-y-3">
              {foodLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No meals logged yet today. Use the Food Recognition Scanner to add entries!
                </div>
              ) : (
                foodLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{log.dish_name}</span>
                      <span className="font-bold text-emerald-400">{log.calories} kcal</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{log.meal_type} • {log.timestamp}</span>
                      <span>
                        {log.protein}g P | {log.carbs}g C | {log.fat}g F
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Historical Hygiene Audits */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Recent Hygiene Surveillance Audits</span>
            </h3>
            <div className="space-y-2 text-xs">
              {hygieneAudits.map((a) => (
                <div key={a.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{a.inspection_type}</div>
                    <div className="text-[10px] text-slate-400">{a.timestamp}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.pass_status ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      Grade {a.grade} ({a.overall_score}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Add Pantry Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Add Fresh Item to Pantry Radar</h3>
            
            <form onSubmit={handleCreatePantry} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="E.g., Organic Blueberries, Greek Yogurt..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Produce">Produce / Fruits</option>
                  <option value="Vegetables">Vegetables & Greens</option>
                  <option value="Dairy">Dairy & Eggs</option>
                  <option value="Meat">Meat & Poultry</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Bakery">Bakery & Grains</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Days Until Decay</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={newItemDays}
                    onChange={(e) => setNewItemDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Quantity</label>
                  <input
                    type="text"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    placeholder="E.g. 500g, 4 pcs"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold shadow-md shadow-cyan-500/20"
                >
                  Save to Radar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
