import React, { useState } from 'react';
import { SPACE_ERAS_DATA, ROVER_EVOLUTION_DATA, EraItem, TechEvolutionRover } from '../../data/timelineData';
import { X, Cpu, Clock, Layers, ArrowRight, Zap, Scale, HardDrive } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface TimeMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMissionById?: (missionId: string) => void;
}

export const TimeMachineModal: React.FC<TimeMachineModalProps> = ({
  isOpen,
  onClose,
  onSelectMissionById,
}) => {
  const [activeTab, setActiveTab] = useState<'EVOLUTION' | 'ERAS'>('EVOLUTION');
  const [selectedRover, setSelectedRover] = useState<TechEvolutionRover>(ROVER_EVOLUTION_DATA[1]); // Opportunity by default

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="time-machine-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950 border border-violet-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-950/80 border border-violet-500/40 rounded-lg text-violet-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span>TECHNOLOGICAL TIME MACHINE</span>
              </div>
              <h2 id="time-machine-title" className="text-xl font-bold text-white font-heading">
                Space History & Rover Evolution Matrix
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close time machine modal"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls (Segmented Control) */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              setActiveTab('EVOLUTION');
              soundManager.playHotspotClick();
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'EVOLUTION'
                ? 'bg-violet-950 text-violet-300 border border-violet-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Mars Rover Technology Evolution
          </button>

          <button
            onClick={() => {
              setActiveTab('ERAS');
              soundManager.playHotspotClick();
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'ERAS'
                ? 'bg-violet-950 text-violet-300 border border-violet-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Historical Exploration Eras (1960–2026)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {activeTab === 'EVOLUTION' ? (
            <div className="space-y-6">
              {/* Rover Selection Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ROVER_EVOLUTION_DATA.map((rover) => (
                  <button
                    key={rover.id}
                    onClick={() => {
                      soundManager.playHotspotClick();
                      setSelectedRover(rover);
                    }}
                    className={`p-3.5 text-left rounded-xl border transition flex flex-col justify-between ${
                      selectedRover.id === rover.id
                        ? 'bg-violet-950/80 border-violet-500 shadow-md text-violet-200'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-mono text-cyan-400 block mb-0.5">
                        {rover.year}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {rover.name}
                      </h4>
                    </div>
                    <div className="mt-3 text-xs font-mono text-slate-400">
                      Mass: {rover.massKg} kg
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Rover Deep Engineering Specs Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-2">
                  <div>
                    <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
                      ENGINEERING SPECIFICATION ARCHIVE
                    </span>
                    <h3 className="text-2xl font-bold text-white font-heading mt-0.5">
                      {selectedRover.name} ({selectedRover.year})
                    </h3>
                  </div>

                  <span className="text-xs font-mono px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 rounded-lg">
                    Current Status: {selectedRover.currentStatus}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono mb-6">
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">TOTAL MASS & FOOTPRINT</span>
                    <span className="text-sm font-bold text-white block">{selectedRover.massKg} kg</span>
                    <span className="text-slate-400 text-[11px]">{selectedRover.dimensions}</span>
                  </div>

                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">POWER SYSTEM</span>
                    <span className="text-sm font-bold text-amber-400 block">{selectedRover.powerWatts} Watts</span>
                    <span className="text-slate-400 text-[11px]">{selectedRover.powerSource}</span>
                  </div>

                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">DISTANCE TRAVERSED</span>
                    <span className="text-sm font-bold text-cyan-300 block">{selectedRover.totalDistanceTraversed}</span>
                    <span className="text-slate-400 text-[11px]">Lifetime: {selectedRover.operationalLifetime}</span>
                  </div>

                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">FLIGHT COMPUTER & MEMORY</span>
                    <span className="text-xs text-white block">{selectedRover.computerSpecs}</span>
                  </div>

                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">SCIENCE PAYLOAD MASS</span>
                    <span className="text-sm font-bold text-emerald-400 block">{selectedRover.sciencePayloadKg} kg</span>
                    <span className="text-slate-400 text-[11px]">Percentage of total: {((selectedRover.sciencePayloadKg / selectedRover.massKg) * 100).toFixed(1)}%</span>
                  </div>

                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">TOP WHEELED SPEED</span>
                    <span className="text-sm font-bold text-white block">{selectedRover.topSpeedMph} mph</span>
                    <span className="text-slate-400 text-[11px]">Rocker-bogie crawl velocity</span>
                  </div>
                </div>

                {/* Signature Breakthrough Card */}
                <div className="bg-violet-950/30 border border-violet-500/40 rounded-xl p-4 text-xs text-violet-200">
                  <span className="font-mono text-violet-400 font-semibold block mb-1">
                    SIGNATURE TECHNOLOGICAL BREAKTHROUGH:
                  </span>
                  {selectedRover.signatureBreakthrough}
                </div>
              </div>

              {/* Educational Comparison Takeaway */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 leading-relaxed">
                <span className="font-mono text-cyan-400 uppercase font-semibold block mb-1">
                  WHY ROBOTIC DESIGN EVOLVED:
                </span>
                Early rovers like Sojourner and Opportunity relied on solar energy. While solar panels can survive for years, dust storms like the 2018 Martian catastrophe demonstrated that solar is vulnerable to global weather. Subsequent rovers (Curiosity, Perseverance) transitioned to plutonium-238 nuclear MMRTG generators, allowing 24/7 winter science and immune to dust obscurity.
              </div>
            </div>
          ) : (
            /* Historical Eras View */
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                {SPACE_ERAS_DATA.map((era) => (
                  <div key={era.id} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-violet-500 border-2 border-violet-300 ring-4 ring-violet-950" />

                    <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition flex flex-col gap-2.5">
                      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                        <span className="text-violet-400 font-bold tracking-wider">{era.period}</span>
                        <span className="text-amber-400 font-semibold">{era.hardwareLeftBehindKg}</span>
                      </div>

                      <h4 className="text-lg font-bold text-white font-heading">
                        {era.title}
                      </h4>

                      <p className="text-sm text-slate-300 leading-relaxed">
                        {era.summary}
                      </p>

                      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs font-mono text-cyan-200">
                        <span className="text-slate-400 font-semibold mr-1">SCIENTIFIC MILESTONE:</span>
                        {era.scientificMilestone}
                      </div>

                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 pt-1 font-mono">
                        <span className="text-slate-500">KEY HARDWARE:</span>
                        {era.featuredHardware.map((hw, i) => (
                          <span key={i} className="text-slate-300">
                            {hw}{i < era.featuredHardware.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>NASA HISTORICAL REPOSITORY & JPL TELEMETRY ARCHIVES</span>
          <span>CHALLENGE #1: ABANDONED BUT NOT FORGOTTEN</span>
        </div>
      </div>
    </div>
  );
};
