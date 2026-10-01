import React from 'react';
import { CelestialBody, Mission } from '../../types/mission';
import { soundManager } from '../../utils/audio';
import {
  Compass,
  ArrowRight,
  Layers,
  Thermometer,
  Weight,
  Sparkles,
  Radio,
  ExternalLink,
  ChevronRight,
  RotateCw,
} from 'lucide-react';

interface PlanetaryFocusHUDProps {
  currentFocus: string;
  body: CelestialBody | null;
  missionsOnBody: Mission[];
  onSelectMission: (mission: Mission) => void;
  onSelectFocus: (focusId: string) => void;
  onOpenAIDiscussion: (topic: string) => void;
  lang?: 'en' | 'bn';
}

export const PlanetaryFocusHUD: React.FC<PlanetaryFocusHUDProps> = ({
  currentFocus,
  body,
  missionsOnBody,
  onSelectMission,
  onSelectFocus,
  onOpenAIDiscussion,
  lang = 'en',
}) => {
  if (!body || currentFocus === 'solar') return null;

  const endedCount = missionsOnBody.filter(
    (m) => m.status === 'MISSION_ENDED' || m.status === 'HISTORIC_RELIC'
  ).length;

  const navPlanets = [
    { id: 'earth', nameEn: 'Earth', nameBn: 'পৃথিবী' },
    { id: 'moon', nameEn: 'Moon', nameBn: 'চাঁদ' },
    { id: 'mars', nameEn: 'Mars', nameBn: 'মঙ্গল গ্রহ' },
    { id: 'jupiter', nameEn: 'Jupiter', nameBn: 'বৃহস্পতি' },
    { id: 'saturn', nameEn: 'Saturn', nameBn: 'শনি' },
  ];

  return (
    <aside
      aria-label="Planetary Exploration Console"
      className="absolute top-20 left-4 sm:left-6 z-20 w-80 sm:w-96 max-h-[calc(100vh-170px)] flex flex-col pointer-events-auto animate-in slide-in-from-left duration-250"
    >
      <div className="bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header with Glowing Planet Icon */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-r from-slate-900/90 to-slate-950/80 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center shrink-0 shadow-lg"
              style={{ backgroundColor: body.color }}
            >
              <span className="w-4 h-4 rounded-full bg-white/40 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                <span>{lang === 'bn' ? 'প্ল্যানেটারি সারফেস ডেটা' : 'SURFACE TELEMETRY FEED'}</span>
              </div>
              <h3 className="text-xl font-extrabold text-white font-heading">
                {lang === 'bn'
                  ? body.id === 'earth'
                    ? 'পৃথিবী (Earth)'
                    : body.id === 'moon'
                    ? 'চাঁদ (The Moon)'
                    : body.id === 'mars'
                    ? 'মঙ্গল গ্রহ (Mars)'
                    : body.name
                  : body.name}
              </h3>
              <p className="text-xs text-amber-300/90 font-mono mt-0.5">
                {body.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playRadarPing();
              onSelectFocus('solar');
            }}
            className="text-xs font-mono text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg px-2.5 py-1 transition"
            title="Return to full Solar System"
          >
            ✕
          </button>
        </div>

        {/* Quick Fly-To Planets Switcher */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
          <span className="text-slate-500 mr-1 shrink-0">{lang === 'bn' ? 'ফ্লাই:' : 'FLY:'}</span>
          {navPlanets.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                soundManager.playCameraWarp();
                onSelectFocus(p.id);
              }}
              className={`px-2.5 py-1 rounded-md transition shrink-0 ${
                currentFocus === p.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800'
              }`}
            >
              {lang === 'bn' ? p.nameBn : p.nameEn}
            </button>
          ))}
        </div>

        {/* Scrollable Body: Surface Sites & Exploration */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[50vh]">
          {/* Scientific Summary */}
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            {body.description}
          </p>

          {/* Planetary Artifact Counter */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block uppercase">
                {lang === 'bn' ? 'মোট প্রযুক্তি মিশন' : 'TOTAL MISSIONS'}
              </span>
              <span className="text-base font-bold text-white block mt-0.5">
                {body.hardwareCount}
              </span>
            </div>
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-amber-400 text-[10px] block uppercase">
                {lang === 'bn' ? 'স্থায়ী পদচিহ্ন/অবশেষ' : 'ENDED / RELICS'}
              </span>
              <span className="text-base font-bold text-amber-300 block mt-0.5">
                {endedCount}
              </span>
            </div>
          </div>

          {/* Interactive Landing Sites & Hardware List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <span>{lang === 'bn' ? 'অবতরণ ক্ষেত্র ও রোভার' : 'LANDING SITES & HARDWARE'}</span>
              <span className="text-slate-500 font-normal">
                {missionsOnBody.length} {lang === 'bn' ? 'চিহ্নিত' : 'Sites'}
              </span>
            </div>

            {missionsOnBody.length > 0 ? (
              <div className="space-y-2">
                {missionsOnBody.map((mission) => {
                  const isEnded = mission.status === 'MISSION_ENDED';
                  const isRelic = mission.status === 'HISTORIC_RELIC';

                  return (
                    <button
                      key={mission.id}
                      onClick={() => {
                        soundManager.playHotspotClick();
                        onSelectMission(mission);
                      }}
                      className="w-full text-left p-3 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-xl transition group flex flex-col gap-1 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isEnded
                                ? 'bg-amber-400'
                                : isRelic
                                ? 'bg-sky-400'
                                : 'bg-emerald-400 animate-pulse'
                            }`}
                          />
                          <span>{mission.name}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition" />
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        {mission.location.regionName}
                      </div>

                      <div className="mt-1 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                        <span
                          className={
                            isEnded
                              ? 'text-amber-400'
                              : isRelic
                              ? 'text-sky-300'
                              : 'text-emerald-400'
                          }
                        >
                          {isEnded
                            ? lang === 'bn' ? 'মিশন সমাপ্ত (নীরব)' : 'MISSION ENDED'
                            : isRelic
                            ? lang === 'bn' ? 'ঐতিহাসিক পদচিহ্ন' : 'HISTORIC RELIC'
                            : lang === 'bn' ? 'সক্রিয় মিশন' : 'ACTIVE'}
                        </span>
                        <span className="text-cyan-400 font-medium">
                          {lang === 'bn' ? '৩ডি CAD দেখুন →' : 'Inspect 3D CAD →'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-xs text-slate-400 font-mono">
                {lang === 'bn'
                  ? 'এই গ্রহে রোভার বা ল্যান্ডার নেই। দূর থেকে টেলিস্কোপ ও অরবিটার দ্বারা পর্যবেক্ষণ করা হয়েছে।'
                  : 'Explored primarily via flyby and atmospheric orbiters.'}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-between text-xs">
          <button
            onClick={() => onOpenAIDiscussion(body.name)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'bn' ? 'এআই জিজ্ঞাসা করুন' : 'Ask AI Guide'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playRadarPing();
              onSelectFocus('solar');
            }}
            className="text-slate-400 hover:text-white font-mono text-[11px] transition"
          >
            ⟲ {lang === 'bn' ? 'সৌরজগত' : 'Full Solar System'}
          </button>
        </div>
      </div>
    </aside>
  );
};
