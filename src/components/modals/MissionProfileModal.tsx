import React, { useState } from 'react';
import { Mission, HardwareComponent } from '../../types/mission';
import { HardwareViewer3D } from '../3d/HardwareViewer3D';
import {
  X,
  Compass,
  Calendar,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  ShieldAlert,
  Award,
  Cpu,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface MissionProfileModalProps {
  mission: Mission | null;
  onClose: () => void;
  onOpenAIChat: (mission: Mission, persona?: 'guide' | 'talk_to_mission') => void;
  onOpenSimulation?: (missionId: string) => void;
  lang?: 'en' | 'bn';
}

export const MissionProfileModal: React.FC<MissionProfileModalProps> = ({
  mission,
  onClose,
  onOpenAIChat,
  onOpenSimulation,
  lang = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'STORY' | '3D_CAD' | 'TIMELINE' | 'DISCOVERIES' | 'MEDIA' | 'SOURCES'>('STORY');
  const [selectedComponent, setSelectedComponent] = useState<HardwareComponent | null>(null);

  if (!mission) return null;

  const isEnded = mission.status === 'MISSION_ENDED';
  const isRelic = mission.status === 'HISTORIC_RELIC';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mission-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Unboxed Metadata (Zero-pill discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span className="text-cyan-400 font-semibold">{mission.agency}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold">{mission.destination}</span>
              <span aria-hidden="true">·</span>
              <span>{mission.type}</span>
              <span aria-hidden="true">·</span>
              <span>Landed: {mission.landingDate}</span>
            </div>

            <div className="flex items-center gap-3">
              <h2 id="mission-title" className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight">
                {mission.name}
              </h2>
              <span
                className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
                  isEnded
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                    : isRelic
                    ? 'bg-sky-950/80 text-sky-300 border border-sky-500/50'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                }`}
              >
                {mission.status === 'MISSION_ENDED'
                  ? 'MISSION ENDED'
                  : mission.status === 'HISTORIC_RELIC'
                  ? 'HISTORIC RELIC'
                  : 'ACTIVE'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {mission.headline}
            </p>
          </div>

          {/* Close & Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* "Talk to the Mission" AI Button */}
            <button
              onClick={() => onOpenAIChat(mission, 'talk_to_mission')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-950/70 hover:bg-amber-900 border border-amber-500/50 text-amber-300 rounded-lg transition shadow-sm"
              title="Speak directly to the simulated historical persona of this spacecraft"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Talk to {mission.callsign || 'Mission'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close mission profile modal"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Segmented Control) */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800/80 bg-slate-950 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('STORY')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'STORY'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Then vs Now Story
          </button>

          <button
            onClick={() => setActiveTab('3D_CAD')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === '3D_CAD'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D Hardware Inspection</span>
          </button>

          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'TIMELINE'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mission Timeline ({mission.timeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('DISCOVERIES')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'DISCOVERIES'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Discoveries & Legacy</span>
          </button>

          <button
            onClick={() => setActiveTab('MEDIA')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'MEDIA'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Authentic Media ({mission.media.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SOURCES')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'SOURCES'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>NASA Sources</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* TAB 1: THEN VS NOW STORY */}
          {activeTab === 'STORY' && (
            <div className="space-y-6">
              {/* Challenge Banner: THEN vs NOW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* THEN CARD */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
                      THEN • PRIME MISSION
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {mission.thenVsNow.thenTitle}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {mission.thenVsNow.thenDescription}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
                    Duration: {mission.operationalDuration}
                  </div>
                </div>

                {/* NOW CARD */}
                <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono text-amber-400 tracking-wider uppercase mb-1">
                      NOW • WHAT REMAINS TODAY
                    </div>
                    <h3 className="text-lg font-bold text-amber-100 mb-2">
                      {mission.thenVsNow.nowTitle}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {mission.thenVsNow.nowDescription}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-900/60 text-xs font-mono text-amber-300">
                    Resting At: {mission.location.regionName} ({mission.location.coordinatesText})
                  </div>
                </div>
              </div>

              {/* What Remains at the Location */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Physical Hardware Preserved at Landing Site</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                  {mission.thenVsNow.whatRemains.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Did the Mission End? */}
              {mission.whyEnded && (
                <div className="bg-slate-900/50 border border-red-900/40 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>Why Did the Mission End?</span>
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {mission.whyEnded}
                  </p>
                </div>
              )}

              {/* Mission Summary & Context */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-2">
                  Scientific Mission Purpose
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {mission.summary}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 3D HARDWARE CAD & COMPONENT INSPECTION */}
          {activeTab === '3D_CAD' && (
            <div className="space-y-5">
              <HardwareViewer3D
                mission={mission}
                activeComponentId={selectedComponent?.id}
                onSelectComponent={(comp) => setSelectedComponent(comp)}
                lang={lang}
              />

              {/* Selected Component Detailed Inspector Card */}
              {selectedComponent ? (
                <div className="bg-slate-900/80 border border-cyan-500/40 rounded-xl p-5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div>
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                        Subsystem Telemetry Inspection
                      </span>
                      <h3 className="text-lg font-bold text-white font-heading">
                        {selectedComponent.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/50 rounded">
                      {selectedComponent.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                      <div className="text-xs font-mono text-slate-400 mb-1">WHAT IS IT?</div>
                      <div className="text-slate-200">{selectedComponent.whatIsIt}</div>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                      <div className="text-xs font-mono text-slate-400 mb-1">WHY WAS IT NEEDED?</div>
                      <div className="text-slate-200">{selectedComponent.whyNeeded}</div>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                      <div className="text-xs font-mono text-slate-400 mb-1">HOW DOES IT WORK?</div>
                      <div className="text-slate-200">{selectedComponent.howItWorks}</div>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                      <div className="text-xs font-mono text-cyan-400 mb-1">WHAT DID THIS MISSION USE IT FOR?</div>
                      <div className="text-slate-200">{selectedComponent.missionRole}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-xs text-slate-400 font-mono">
                  Select any component below or click glowing hotspots in the 3D viewer above to inspect subsystem engineering.
                </div>
              )}

              {/* Component Buttons Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {mission.components.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      soundManager.playHotspotClick();
                      setSelectedComponent(comp);
                    }}
                    className={`p-3 text-left rounded-lg border text-xs transition flex flex-col justify-between ${
                      selectedComponent?.id === comp.id
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <span className="font-semibold text-white block truncate mb-1">
                      {comp.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {comp.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE 7-PHASE TIMELINE */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-mono mb-2">
                Chronological mission trajectory from launch to eternal monument:
              </div>

              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                {mission.timeline.map((evt, idx) => (
                  <div key={evt.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div
                      className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                        evt.phase === 'MISSION_END'
                          ? 'bg-red-500 border-red-300 ring-4 ring-red-950'
                          : evt.phase === 'DISCOVERY'
                          ? 'bg-amber-400 border-amber-200 ring-4 ring-amber-950'
                          : 'bg-cyan-500 border-cyan-300 ring-4 ring-cyan-950'
                      }`}
                    />

                    <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition">
                      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 mb-1">
                        <span className="text-cyan-400 font-medium tracking-wider">
                          PHASE: {evt.phase}
                        </span>
                        <span>{evt.date}</span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-1.5">
                        {evt.title}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed mb-2">
                        {evt.description}
                      </p>

                      <div className="text-xs bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 text-cyan-200/90 font-mono">
                        <span className="text-slate-400 mr-1.5 font-semibold">SIGNIFICANCE:</span>
                        {evt.significance}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DISCOVERIES & LEGACY */}
          {activeTab === 'DISCOVERIES' && (
            <div className="space-y-6">
              {/* Scientific Discoveries */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Key Scientific Discoveries</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  {mission.scientificDiscoveries.map((disc, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{disc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mission Legacy */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Engineering & Historical Legacy</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  {mission.missionLegacy.map((leg, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-cyan-400 shrink-0 font-mono font-bold mt-0.5">#{idx + 1}</span>
                      <span className="leading-relaxed">{leg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: AUTHENTIC MEDIA */}
          {activeTab === 'MEDIA' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mission.media.map((med) => (
                  <div key={med.id} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="relative aspect-video bg-black overflow-hidden group">
                      <img
                        src={med.url}
                        alt={med.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          // Fallback placeholder if image load fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{med.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{med.caption}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>CREDIT: {med.credit}</span>
                        <a
                          href={med.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          NASA Archive <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: NASA SOURCES & CITATIONS */}
          {activeTab === 'SOURCES' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-mono">
                All mission coordinates, launch dates, operational timelines, and findings are verified against authoritative NASA archives:
              </div>

              <div className="space-y-2.5">
                {mission.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                          {src.institution}
                        </div>
                        <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition mt-0.5">
                          {src.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-1 truncate max-w-lg">
                          {src.url}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 transition" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Latest Verified Update Note */}
              <div className="mt-6 bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-400">
                <span className="text-amber-400 font-semibold">LATEST VERIFIED TELEMETRY:</span> {mission.latestUpdate.text} ({mission.latestUpdate.date} — {mission.latestUpdate.verifiedSource})
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 font-mono">
            Location: <span className="text-white">{mission.location.regionName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAIChat(mission, 'guide')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-medium rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask AI Guide about this Mission</span>
            </button>

            {onOpenSimulation && (mission.id === 'opportunity' || mission.id === 'insight') && (
              <button
                onClick={() => onOpenSimulation(mission.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/70 hover:bg-amber-900 border border-amber-500/50 text-amber-300 font-medium rounded-lg transition"
              >
                <span>Play Mission Control Sim</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
