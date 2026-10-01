import React, { useState } from 'react';
import { Mission, HardwareStatus, Destination } from '../../types/mission';
import { X, Layers, ArrowUpRight, Compass, ShieldAlert, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface FootprintsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  missions: Mission[];
  onSelectMission: (mission: Mission) => void;
  onFocusDestination: (dest: string) => void;
}

export const FootprintsDrawer: React.FC<FootprintsDrawerProps> = ({
  isOpen,
  onClose,
  missions,
  onSelectMission,
  onFocusDestination,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<HardwareStatus | 'ALL'>('ALL');

  if (!isOpen) return null;

  const filteredMissions = missions.filter((m) => {
    if (selectedDestination !== 'ALL' && m.destination !== selectedDestination) return false;
    if (selectedStatus !== 'ALL' && m.status !== selectedStatus) return false;
    return true;
  });

  const endedCount = missions.filter(m => m.status === 'MISSION_ENDED').length;
  const relicCount = missions.filter(m => m.status === 'HISTORIC_RELIC').length;
  const activeCount = missions.filter(m => m.status === 'ACTIVE').length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="footprints-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
    >
      <div className="w-full max-w-xl h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>NASA Challenge Archive #1</span>
            </div>
            <h2 id="footprints-title" className="text-xl font-bold text-white font-heading mt-1">
              What Did Humanity Leave Behind?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              A catalog of machines, instruments, and archaeological footprints across alien soil.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close footprints drawer"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Callout Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-amber-200 font-medium block">
              “The machine stopped. The knowledge did not.”
            </span>
            <span className="text-slate-400 text-[11px] block mt-0.5">
              Over 200,000 kg of human technology preserved indefinitely in extraterrestrial vacuum and dust.
            </span>
          </div>
          <div className="text-right pl-3 font-mono">
            <div className="text-amber-400 font-bold text-sm">{endedCount + relicCount}</div>
            <div className="text-[10px] text-slate-400 uppercase">Monuments</div>
          </div>
        </div>

        {/* Interactive Filters (Buttons / Segmented Controls) */}
        <div className="p-4 border-b border-slate-800/80 flex flex-col gap-2.5 bg-slate-950/80">
          {/* Destination filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-mono text-[11px] mr-1">TARGET:</span>
            {(['ALL', 'MARS', 'MOON', 'EARTH', 'DEEP_SPACE'] as const).map((dest) => (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  selectedDestination === dest
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {dest === 'ALL' ? 'All Worlds' : dest}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-500 font-mono text-[11px] mr-1">STATUS:</span>
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                selectedStatus === 'ALL'
                  ? 'bg-slate-800 text-white border border-slate-600'
                  : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              All ({missions.length})
            </button>
            <button
              onClick={() => setSelectedStatus('MISSION_ENDED')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                selectedStatus === 'MISSION_ENDED'
                  ? 'bg-amber-950 border border-amber-500 text-amber-200'
                  : 'bg-slate-900 border border-slate-800 text-amber-400/80'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Ended ({endedCount})
            </button>
            <button
              onClick={() => setSelectedStatus('HISTORIC_RELIC')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                selectedStatus === 'HISTORIC_RELIC'
                  ? 'bg-sky-950 border border-sky-500 text-sky-200'
                  : 'bg-slate-900 border border-slate-800 text-sky-400/80'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Relics ({relicCount})
            </button>
            <button
              onClick={() => setSelectedStatus('ACTIVE')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                selectedStatus === 'ACTIVE'
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-200'
                  : 'bg-slate-900 border border-slate-800 text-emerald-400/80'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active ({activeCount})
            </button>
          </div>
        </div>

        {/* Missions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMissions.map((mission) => {
            const isEnded = mission.status === 'MISSION_ENDED';
            const isRelic = mission.status === 'HISTORIC_RELIC';

            return (
              <div
                key={mission.id}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition flex flex-col gap-2 group"
              >
                {/* Unboxed Metadata (Zero-pill discipline) */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-medium">{mission.destination}</span>
                    <span aria-hidden="true">·</span>
                    <span>{mission.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{mission.operationalDuration.split('(')[0]}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isEnded
                          ? 'bg-amber-400'
                          : isRelic
                          ? 'bg-sky-400'
                          : 'bg-emerald-400 animate-pulse'
                      }`}
                    />
                    <span
                      className={`text-[11px] font-mono ${
                        isEnded
                          ? 'text-amber-400'
                          : isRelic
                          ? 'text-sky-300'
                          : 'text-emerald-400'
                      }`}
                    >
                      {isEnded ? 'MISSION ENDED' : isRelic ? 'HISTORIC RELIC' : 'ACTIVE'}
                    </span>
                  </div>
                </div>

                {/* Title & Headline */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition flex items-center justify-between">
                    <span>{mission.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 transition" />
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {mission.headline}
                  </p>
                </div>

                {/* Where it rests now */}
                <div className="text-xs bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 mt-1 flex flex-col gap-1">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>LOCATION: {mission.location.regionName}</span>
                    <span className="text-slate-500">{mission.location.coordinatesText}</span>
                  </div>
                  <div className="text-[11px] text-amber-300/90 italic">
                    {mission.thenVsNow.nowTitle}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <button
                    onClick={() => {
                      soundManager.playRadarPing();
                      onFocusDestination(mission.destination.toLowerCase());
                      onClose();
                    }}
                    className="text-slate-400 hover:text-white font-mono flex items-center gap-1 transition"
                  >
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Focus in 3D</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playHotspotClick();
                      onSelectMission(mission);
                    }}
                    className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-medium rounded-md transition"
                  >
                    Inspect Mission Story →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
