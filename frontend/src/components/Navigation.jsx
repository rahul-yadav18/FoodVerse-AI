import React from 'react';
import { Apple, Eye, ShieldAlert, Sparkles, LayoutDashboard } from 'lucide-react';

export function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: 'nutrition',
      label: 'Food Recognition & Nutrition',
      shortLabel: 'Nutrition',
      icon: Apple,
      color: 'emerald',
      badge: 'Vision AI'
    },
    {
      id: 'freshness',
      label: 'Freshness & Spoilage Detection',
      shortLabel: 'Freshness',
      icon: Eye,
      color: 'amber',
      badge: 'Decay Radar'
    },
    {
      id: 'hygiene',
      label: 'Restaurant Hygiene & Safety',
      shortLabel: 'Hygiene & Safety',
      icon: ShieldAlert,
      color: 'rose',
      badge: 'HACCP Audit'
    },
    {
      id: 'cooking',
      label: 'Smart Cooking & Meal Planner',
      shortLabel: 'Chef & Planner',
      icon: Sparkles,
      color: 'cyan',
      badge: 'Zero-Waste'
    },
    {
      id: 'dashboard',
      label: 'Pantry Radar & Health Log',
      shortLabel: 'Pantry & Logs',
      icon: LayoutDashboard,
      color: 'indigo',
      badge: 'Storage'
    }
  ];

  return (
    <nav className="border-b border-slate-800/80 bg-[#0d1322]/50 backdrop-blur-sm sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 sm:space-x-3 overflow-x-auto py-3 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900/50 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className="font-semibold">{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                  isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
                {isActive && (
                  <div className="absolute -bottom-3 left-4 right-4 h-[2px] bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
