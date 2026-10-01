import React, { useState } from 'react';
import { HardwareViewer3D } from '../3d/HardwareViewer3D';
import { MISSIONS_DATA } from '../../data/missionsData';
import { Mission, HardwareComponent } from '../../types/mission';
import { X, Box, FileCode, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ModelInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'bn';
}

export const ModelInspectionModal: React.FC<ModelInspectionModalProps> = ({
  isOpen,
  onClose,
  lang = 'en',
}) => {
  const [selectedMission, setSelectedMission] = useState<Mission>(MISSIONS_DATA[0]); // Opportunity by default
  const [selectedComponent, setSelectedComponent] = useState<HardwareComponent | null>(null);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="model-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl max-h-[94vh] bg-slate-950 border border-cyan-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950/90 border border-cyan-500/50 rounded-xl text-cyan-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{lang === 'bn' ? 'নাসা ৩ডি ফটোগ্রামেট্রিক মডেল ল্যাব' : 'NASA 3D PHOTOGRAMMETRIC LAB'}</span>
              </div>
              <h2 id="model-modal-title" className="text-xl font-bold text-white font-heading">
                {lang === 'bn' ? 'রিয়েল ৩ডি স্পেসক্রাফট মডেল ভিউয়ার' : 'Real 3D Spacecraft & Rover Models'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close 3D model viewer"
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Switcher Buttons */}
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-mono text-[11px] mr-1">
            {lang === 'bn' ? 'মডেল নির্বাচন:' : 'SPACECRAFT:'}
          </span>
          {MISSIONS_DATA.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                soundManager.playHotspotClick();
                setSelectedMission(m);
                setSelectedComponent(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition flex items-center gap-1.5 shrink-0 ${
                selectedMission.id === m.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{m.callsign || m.name}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main 3D Model View */}
          <HardwareViewer3D
            mission={selectedMission}
            activeComponentId={selectedComponent?.id}
            onSelectComponent={(comp) => setSelectedComponent(comp)}
            lang={lang}
          />

          {/* GitHub / Custom Code Notice */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <FileCode className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-white font-bold block">
                  {lang === 'bn' ? 'নিজের গিটহাব ৩ডি কোড বা মডেল লোড করতে চান?' : 'Have your own GitHub 3D model or repository?'}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {lang === 'bn'
                    ? 'উপরের লিংক বাটনে ক্লিক করে যেকোনো গিটহাব র’ URL (GitHub Raw URL) বা লোকাল .glb/.gltf ফাইল লোড করতে পারেন।'
                    : 'Click the link or upload icon in the 3D viewer above to paste any raw GitHub link or drag-and-drop your custom model.'}
                </span>
              </div>
            </div>
            <a
              href="https://github.com/nasa/NASA-3D-Resources"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-mono shrink-0 flex items-center gap-1 transition"
            >
              <span>NASA GitHub 3D Archive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Selected Component Information Card */}
          {selectedComponent && (
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    {lang === 'bn' ? 'সাবসিস্টেম টেলিমেট্রি' : 'Subsystem Telemetry'}
                  </span>
                  <h3 className="text-lg font-bold text-white font-heading">
                    {selectedComponent.name}
                  </h3>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/50 rounded-lg">
                  {selectedComponent.category}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    {lang === 'bn' ? 'এটি কি?' : 'WHAT IS IT?'}
                  </div>
                  <div className="text-slate-200">{selectedComponent.whatIsIt}</div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    {lang === 'bn' ? 'কেন প্রয়োজন ছিল?' : 'WHY WAS IT NEEDED?'}
                  </div>
                  <div className="text-slate-200">{selectedComponent.whyNeeded}</div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    {lang === 'bn' ? 'কিভাবে কাজ করে?' : 'HOW DOES IT WORK?'}
                  </div>
                  <div className="text-slate-200">{selectedComponent.howItWorks}</div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-[11px] font-mono text-cyan-400 mb-1">
                    {lang === 'bn' ? 'এই মিশনে এর ভূমিকা:' : 'WHAT DID THIS MISSION USE IT FOR?'}
                  </div>
                  <div className="text-slate-200">{selectedComponent.missionRole}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{lang === 'bn' ? 'নাসা ওপেন ডেটা ৩ডি রিসোর্স' : 'NASA OPEN DATA 3D ASSETS'}</span>
          <span>GLTF / GLB / PBR COMPLIANT</span>
        </div>
      </div>
    </div>
  );
};
