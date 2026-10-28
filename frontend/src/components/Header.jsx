import React, { useState, useEffect } from 'react';
import { Sparkles, Utensils, ShieldCheck, Activity, Volume2, VolumeX, Cpu, Radio } from 'lucide-react';
import { stopSpeech } from '../utils/speech';

export function Header({ voiceEnabled, setVoiceEnabled, backendHealthy }) {
  return (
    <header className="border-b border-slate-800 bg-[#0d1322]/80 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
              <Utensils className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent">
                FoodVerse AI
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Agent v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Multimodal Food Intelligence & Kitchen Safety Platform
            </p>
          </div>
        </div>

        {/* Status Indicators & Multimodal Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Backend Status Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendHealthy ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${backendHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-slate-300 font-medium hidden md:inline">
              FastAPI Core:
            </span>
            <span className={`font-semibold ${backendHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
              {backendHealthy ? 'Online' : 'Standby'}
            </span>
          </div>

          {/* Multimodal AI Engine badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>Vision + Audio + LLM</span>
          </div>

          {/* Voice Audio Readout Toggle */}
          <button
            onClick={() => {
              if (voiceEnabled) stopSpeech();
              setVoiceEnabled(!voiceEnabled);
            }}
            title={voiceEnabled ? 'Mute AI Voice Assistant' : 'Enable AI Voice Assistant'}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              voiceEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{voiceEnabled ? 'Voice Active' : 'Voice Off'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
