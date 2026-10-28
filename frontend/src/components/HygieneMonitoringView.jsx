import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, FileText,
  Camera, Upload, Eye, Activity, Printer, Download, Sparkles
} from 'lucide-react';
import { api } from '../utils/api';
import { speakText } from '../utils/speech';
import { CameraCaptureModal } from './CameraCaptureModal';

const SAMPLE_HYGIENE_IMAGES = {
  kitchen_prep_violation: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
  kitchen_prep_pristine: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
};

export function HygieneMonitoringView({ voiceEnabled }) {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState('kitchen_prep_violation');
  const [scenePrompt, setScenePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [activeImage, setActiveImage] = useState(SAMPLE_HYGIENE_IMAGES.kitchen_prep_violation);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    loadSamples();
    fetchAudit(null, 'kitchen_prep_violation');
  }, []);

  const loadSamples = async () => {
    try {
      const data = await api.getHygieneSamples();
      setSamples(data);
    } catch (e) {
      console.error('Failed to load hygiene samples:', e);
    }
  };

  const fetchAudit = async (sceneDesc = null, sampleId = null, file = null, customImageUrl = null) => {
    setLoading(true);
    try {
      const result = await api.analyzeHygiene({
        sceneDescription: sceneDesc,
        sampleId,
        file,
      });
      setAuditData(result);
      if (customImageUrl) {
        setActiveImage(customImageUrl);
      } else if (sampleId && SAMPLE_HYGIENE_IMAGES[sampleId]) {
        setActiveImage(SAMPLE_HYGIENE_IMAGES[sampleId]);
      } else {
        setActiveImage(SAMPLE_HYGIENE_IMAGES.kitchen_prep_pristine);
      }

      if (voiceEnabled && result) {
        speakText(
          `Hygiene inspection complete. Station score is ${result.overall_score} percent, Grade ${result.grade}. ${result.violations.length} safety violations flagged.`
        );
      }
    } catch (e) {
      console.error('Error analyzing hygiene audit:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      fetchAudit(file.name.replace(/\.[^/.]+$/, ''), null, file, event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (photoDataUrl) => {
    fetchAudit('Kitchen Workstation Surveillance Frame', null, null, photoDataUrl);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Surveillance Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={scenePrompt}
              onChange={(e) => setScenePrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchAudit(scenePrompt, null)}
              placeholder="E.g., Kitchen prep station inspection, check line cooks PPE, cross-contamination..."
              className="w-full pl-4 pr-24 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm transition-all"
            />
            <button
              onClick={() => fetchAudit(scenePrompt, null)}
              className="absolute right-2 top-2 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg shadow-md transition-all"
            >
              Audit
            </button>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-rose-400 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Camera className="w-4 h-4 text-rose-400" />
              <span>CCTV / Camera</span>
            </button>
            <label className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Upload Video / Frame</span>
              <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Sample Inspection Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Surveillance Scenarios:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samples.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSample(s.id);
                  setScenePrompt('');
                  fetchAudit(null, s.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSample === s.id && !scenePrompt
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {s.title} (Grade {s.grade} - {s.score}%)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Inspection Audit Display */}
      {loading ? (
        <div className="glass-panel p-16 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-400 rounded-full animate-spin mx-auto" />
          <p className="text-lg font-bold text-slate-200">Executing Computer Vision Kitchen Safety Scan...</p>
          <p className="text-sm text-slate-400">Verifying PPE compliance, sanitation zones & cross-contamination vectors...</p>
        </div>
      ) : auditData ? (
        <div className="space-y-8">
          
          {/* Top Score Banner */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center space-x-5">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl border-2 shadow-2xl ${
                auditData.pass_status
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-rose-500/10'
              }`}>
                {auditData.grade}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Inspection ID: {auditData.inspection_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    auditData.pass_status ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {auditData.pass_status ? 'PASSED AUDIT' : 'REMEDIATION MANDATORY'}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">
                  {auditData.inspection_type}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {auditData.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-black text-white">
                  {auditData.overall_score}
                  <span className="text-sm text-slate-400">/100</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  Safety Rating
                </span>
              </div>
              <button
                onClick={handlePrintReport}
                className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Export Audit PDF</span>
              </button>
            </div>
          </div>

          {/* Core Grid: Visual Surveillance Overlay + Violations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Visual Feed with Bounding Box Annotations */}
            <div className="lg:col-span-6 space-y-6">
              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 relative group shadow-2xl">
                <div className="relative aspect-video max-h-[420px] bg-black overflow-hidden">
                  <img
                    src={activeImage}
                    alt="Kitchen Surveillance"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Real-time Bounding Boxes Overlay */}
                  {auditData.detections?.map((det, idx) => {
                    const [left, top, width, height] = det.box;
                    const isDanger = det.type === 'danger';
                    const isWarning = det.type === 'warning';
                    return (
                      <div
                        key={idx}
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          width: `${width}%`,
                          height: `${height}%`,
                        }}
                        className={`absolute border-2 rounded-lg pointer-events-none transition-all ${
                          isDanger ? 'border-rose-500 bg-rose-500/20 animate-pulse' :
                          isWarning ? 'border-amber-400 bg-amber-400/20' :
                          'border-emerald-400 bg-emerald-400/10'
                        }`}
                      >
                        <span className={`absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-extrabold rounded-md shadow-md whitespace-nowrap ${
                          isDanger ? 'bg-rose-600 text-white' :
                          isWarning ? 'bg-amber-600 text-white' :
                          'bg-emerald-600 text-white'
                        }`}>
                          {det.label}
                        </span>
                      </div>
                    );
                  })}

                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                    <span className="font-mono">CAM 04 – PREP LINE LIVE</span>
                  </div>
                </div>

                {/* Sub-panel: Cleanliness Metrics */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Core Compliance Checkpoints
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {Object.entries(auditData.cleanliness_metrics || {}).map(([key, val]) => (
                      <div key={key} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex justify-between items-center text-slate-400 capitalize">
                          <span>{key.replace(/_/g, ' ')}</span>
                          <span className="font-bold text-white">{val}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              val >= 90 ? 'bg-emerald-400' :
                              val >= 70 ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Violation Logs & Corrective Action */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Flagged Violations List */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>HACCP / FDA Violations Log</span>
                  </h3>
                  <span className="text-xs font-semibold text-rose-400">
                    {auditData.violations?.length || 0} Infractions
                  </span>
                </div>

                {auditData.violations?.length === 0 ? (
                  <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="font-bold text-emerald-300 text-sm">Zero Safety Violations Detected</div>
                    <p className="text-xs text-slate-400">The line fulfills all FDA Food Code and local sanitation standards.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditData.violations?.map((vio) => (
                      <div key={vio.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              vio.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                              vio.severity === 'Major' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                              'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                            }`}>
                              {vio.severity}
                            </span>
                            <span className="font-bold text-slate-200">{vio.category}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{vio.haccp_fda_code}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{vio.description}</p>
                        <div className="p-2.5 bg-rose-950/20 border border-rose-800/30 rounded-lg text-xs text-rose-200">
                          <span className="font-bold text-rose-400">Mandated Remediation: </span>
                          <span>{vio.corrective_action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Commendable Practices & Next Steps */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Compliant Practices</span>
                </h3>
                <ul className="space-y-2">
                  {auditData.positive_practices?.map((prac, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{prac}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-3 border-t border-slate-800">
                  Recommended Inspector Actions
                </h3>
                <ul className="space-y-1.5">
                  {auditData.recommended_actions?.map((act, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-400">
                      <span className="text-rose-400 font-bold">→</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      ) : null}

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        title="Kitchen Surveillance Video / Snapshot Audit"
      />
    </div>
  );
}
