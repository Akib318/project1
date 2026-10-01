import React, { useState } from 'react';
import { MISSIONS_DATA, CELESTIAL_BODIES } from './data/missionsData';
import { Mission, CelestialBody } from './types/mission';
import { SolarSystemCanvas } from './components/3d/SolarSystemCanvas';
import { NavigationHUD } from './components/hud/NavigationHUD';
import { FootprintsDrawer } from './components/hud/FootprintsDrawer';
import { PlanetaryFocusHUD } from './components/hud/PlanetaryFocusHUD';
import { MissionProfileModal } from './components/modals/MissionProfileModal';
import { MissionControlModal } from './components/modals/MissionControlModal';
import { AIMissionGuideModal } from './components/modals/AIMissionGuideModal';
import { TimeMachineModal } from './components/modals/TimeMachineModal';
import { QuizModal } from './components/modals/QuizModal';
import { AboutModal } from './components/modals/AboutModal';
import { ModelInspectionModal } from './components/modals/ModelInspectionModal';
import { soundManager } from './utils/audio';
import {
  Compass,
  Layers,
  Sparkles,
  Sliders,
  ChevronRight,
  Radio,
  ArrowRight,
  Box,
  Globe,
} from 'lucide-react';

export default function App() {
  // Localization state (Defaults to 'bn' as requested by user, easily toggled)
  const [lang, setLang] = useState<'en' | 'bn'>('bn');

  // Navigation & 3D state
  const [currentFocus, setCurrentFocus] = useState<string>('solar');
  const [showFootprints, setShowFootprints] = useState<boolean>(true);
  const [hasEnteredExperience, setHasEnteredExperience] = useState<boolean>(false);

  // Modals state
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isFootprintsDrawerOpen, setIsFootprintsDrawerOpen] = useState<boolean>(false);
  const [isSimModalOpen, setIsSimModalOpen] = useState<boolean>(false);
  const [activeSimScenarioId, setActiveSimScenarioId] = useState<string | undefined>(undefined);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [aiModalPersona, setAiModalPersona] = useState<'guide' | 'talk_to_mission'>('guide');
  const [aiModalMission, setAiModalMission] = useState<Mission | null>(null);
  const [isTimeMachineOpen, setIsTimeMachineOpen] = useState<boolean>(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isModelTerminalOpen, setIsModelTerminalOpen] = useState<boolean>(false);

  // Explorer Badges Gamification
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([
    'badge-tourist',
  ]);

  const unlockBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges((prev) => [...prev, badgeId]);
      soundManager.playHotspotClick();
    }
  };

  const handleSelectFocus = (focusId: string) => {
    setCurrentFocus(focusId);
    if (focusId === 'earth' || focusId === 'moon' || focusId === 'mars') {
      unlockBadge('badge-cartographer');
    }
  };

  const handleSelectMission = (mission: Mission) => {
    soundManager.playHotspotClick();
    setSelectedMission(mission);
    unlockBadge('badge-rover-spec');
  };

  const handleOpenAIChat = (
    mission?: Mission,
    persona: 'guide' | 'talk_to_mission' = 'guide'
  ) => {
    soundManager.playHotspotClick();
    setAiModalMission(mission || selectedMission);
    setAiModalPersona(persona);
    setIsAIModalOpen(true);
  };

  const handleOpenSimulation = (missionId?: string) => {
    soundManager.playHotspotClick();
    setActiveSimScenarioId(
      missionId === 'insight' ? 'insight-sand-scour' : 'opp-dust-storm'
    );
    setIsSimModalOpen(true);
  };

  const endedMissionsCount = MISSIONS_DATA.filter(
    (m) => m.status === 'MISSION_ENDED' || m.status === 'HISTORIC_RELIC'
  ).length;

  // Active Celestial Body & Associated Missions
  const focusedBody: CelestialBody | null =
    CELESTIAL_BODIES.find((b) => b.id === currentFocus) || null;

  const missionsOnBody = MISSIONS_DATA.filter(
    (m) => m.destination.toLowerCase() === currentFocus.toLowerCase()
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 3D WebGL Solar System Canvas with Real Photographic Textures */}
      <div className="absolute inset-0 z-0">
        <SolarSystemCanvas
          currentFocus={currentFocus}
          onSelectFocus={handleSelectFocus}
          onSelectMission={handleSelectMission}
          showFootprints={showFootprints}
          lang={lang}
        />
      </div>

      {/* Top Navigation HUD */}
      <NavigationHUD
        currentFocus={currentFocus}
        onSelectFocus={handleSelectFocus}
        showFootprints={showFootprints}
        onToggleFootprints={() => setShowFootprints((prev) => !prev)}
        onOpenSimModal={() => handleOpenSimulation()}
        onOpenAIModal={() => handleOpenAIChat()}
        onOpenTimeMachineModal={() => {
          soundManager.playHotspotClick();
          setIsTimeMachineOpen(true);
        }}
        onOpenQuizModal={() => {
          soundManager.playHotspotClick();
          setIsQuizModalOpen(true);
        }}
        onOpenAboutModal={() => {
          soundManager.playHotspotClick();
          setIsAboutModalOpen(true);
        }}
        onOpenCustomModelModal={() => {
          soundManager.playHotspotClick();
          setIsModelTerminalOpen(true);
        }}
        endedMissionsCount={endedMissionsCount}
        totalMissionsCount={MISSIONS_DATA.length}
        lang={lang}
        onToggleLang={() => setLang((l) => (l === 'en' ? 'bn' : 'en'))}
      />

      {/* Dedicated Floating Quick Action: Real NASA 3D Models */}
      <div className="absolute top-20 right-6 z-20 hidden sm:block">
        <button
          onClick={() => {
            soundManager.playHotspotClick();
            setIsModelTerminalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-950/85 hover:bg-slate-900 backdrop-blur-xl border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 rounded-xl shadow-2xl transition group"
        >
          <Box className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition" />
          <div className="text-left">
            <span className="text-[10px] font-mono text-cyan-400 block uppercase leading-none">
              {lang === 'bn' ? 'নাসা ৩ডি মডেল ও গিটহাব' : 'NASA 3D LAB & GITHUB'}
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {lang === 'bn' ? 'রিয়েল ৩ডি মডেল দেখুন' : 'Inspect Real 3D Models'}
            </span>
          </div>
        </button>
      </div>

      {/* Deep Interactive Planetary Focus HUD (Slides in on Earth/Moon/Mars/etc. click) */}
      <PlanetaryFocusHUD
        currentFocus={currentFocus}
        body={focusedBody}
        missionsOnBody={missionsOnBody}
        onSelectMission={handleSelectMission}
        onSelectFocus={handleSelectFocus}
        onOpenAIDiscussion={(topic) => handleOpenAIChat(undefined, 'guide')}
        lang={lang}
      />

      {/* Hero Welcome Curtain (First-time Arrival Experience) */}
      {!hasEnteredExperience && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 rounded-full text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>
                {lang === 'bn'
                  ? 'নাসা স্পেস অ্যাপস চ্যালেঞ্জ ২০২৬ • চ্যালেঞ্জ #১'
                  : 'NASA SPACE APPS CHALLENGE 2026 • CHALLENGE #1'}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-heading tracking-tight">
                MISSION ECHO
              </h1>
              <p className="text-xl sm:text-2xl text-amber-300/90 font-light italic">
                {lang === 'bn'
                  ? '“ফেলে আসা, কিন্তু বিস্মৃত নয়”'
                  : '“Abandoned but Not Forgotten”'}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
              {lang === 'bn'
                ? 'মানুষ মহাকাশে যেসকল মহাকাশযান ও রোভার পাঠিয়েছে, তাদের অন্বেষণ করুন। তারা কোথায় গিয়েছিল, কি আবিষ্কার করেছিল, এবং তাদের মিশন শেষ হওয়ার পর চাঁদ ও মঙ্গলে কি অবশিষ্ট রয়েছে তা আবিষ্কার করুন।'
                : 'Explore the machines humanity sent beyond Earth. Discover where they went, what they discovered, and what remains across the Moon and Mars after their missions end.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playCameraWarp();
                  setHasEnteredExperience(true);
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>{lang === 'bn' ? 'সৌরজগতে প্রবেশ করুন' : 'ENTER THE SOLAR SYSTEM'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundManager.playHotspotClick();
                  setHasEnteredExperience(true);
                  setIsModelTerminalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'রিয়েল ৩ডি মডেল ল্যাব' : 'Real 3D Model Lab'}</span>
              </button>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <span>{lang === 'bn' ? 'নাসা অফিসিয়াল ৩ডি GLTF মডেল' : 'Official NASA 3D GLTF'}</span>
              <span>·</span>
              <span>{lang === 'bn' ? 'ফটোগ্রামেট্রিক টেক্সচার' : 'PBR Textures'}</span>
              <span>·</span>
              <span>{lang === 'bn' ? 'জেমিনি এআই গাইড' : 'Gemini AI Guide'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Mission Carousel & Quick Access Bar */}
      <aside
        aria-label="Featured Space Relics"
        className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          {/* Quick Relics Drawer Button */}
          <div className="flex items-center justify-between pointer-events-auto">
            <button
              onClick={() => {
                soundManager.playHotspotClick();
                setIsFootprintsDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-slate-950/90 hover:bg-slate-900 backdrop-blur-xl border border-amber-500/40 text-amber-300 text-xs font-mono rounded-xl shadow-xl flex items-center gap-2 transition"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {lang === 'bn'
                  ? `সকল পদচিহ্ন ও অবশেষ (${MISSIONS_DATA.length})`
                  : `EXPLORE ALL RELICS & MONUMENTS (${MISSIONS_DATA.length})`}
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-slate-800 shadow">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{lang === 'bn' ? 'মিশন শেষ' : 'Ended'} ({endedMissionsCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>{lang === 'bn' ? 'ঐতিহাসিক প্রতীক' : 'Historic Relic'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{lang === 'bn' ? 'সক্রিয়' : 'Active'}</span>
              </span>
            </div>
          </div>

          {/* Quick Mission Cards Scroll Container */}
          <div className="pointer-events-auto flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {MISSIONS_DATA.map((mission) => {
              const isEnded = mission.status === 'MISSION_ENDED';
              const isRelic = mission.status === 'HISTORIC_RELIC';

              return (
                <button
                  key={mission.id}
                  onClick={() => handleSelectMission(mission)}
                  className="shrink-0 text-left bg-slate-950/90 hover:bg-slate-900 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-3 w-56 sm:w-64 transition shadow-xl group flex flex-col justify-between"
                >
                  <div>
                    {/* Unboxed Metadata */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span className="text-cyan-400 font-medium">
                        {mission.destination}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isEnded
                              ? 'bg-amber-400'
                              : isRelic
                              ? 'bg-sky-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span
                          className={`text-[10px] ${
                            isEnded
                              ? 'text-amber-400'
                              : isRelic
                              ? 'text-sky-300'
                              : 'text-emerald-400'
                          }`}
                        >
                          {isEnded
                            ? 'ENDED'
                            : isRelic
                            ? 'RELIC'
                            : 'ACTIVE'}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition truncate">
                      {mission.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {mission.location.regionName}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{mission.type}</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition flex items-center">
                      {lang === 'bn' ? 'পরিদর্শন করুন →' : 'Inspect →'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* FOOTPRINTS DRAWER ("What did humanity leave behind?") */}
      <FootprintsDrawer
        isOpen={isFootprintsDrawerOpen}
        onClose={() => setIsFootprintsDrawerOpen(false)}
        missions={MISSIONS_DATA}
        onSelectMission={(m) => {
          setIsFootprintsDrawerOpen(false);
          handleSelectMission(m);
        }}
        onFocusDestination={(dest) => {
          handleSelectFocus(dest);
        }}
      />

      {/* MISSION PROFILE MODAL (3D CAD, 7-Phase Timeline, Then vs Now, Media, Sources) */}
      <MissionProfileModal
        mission={selectedMission}
        onClose={() => setSelectedMission(null)}
        onOpenAIChat={(m, persona) => handleOpenAIChat(m, persona)}
        onOpenSimulation={(id) => handleOpenSimulation(id)}
        lang={lang}
      />

      {/* MISSION CONTROL SIMULATOR MODAL */}
      <MissionControlModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        initialScenarioId={activeSimScenarioId}
        onUnlockBadge={unlockBadge}
      />

      {/* AI MISSION GUIDE & TALK TO THE MISSION MODAL */}
      <AIMissionGuideModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        initialMission={aiModalMission}
        initialPersona={aiModalPersona}
      />

      {/* TIME MACHINE & ROVER EVOLUTION MODAL */}
      <TimeMachineModal
        isOpen={isTimeMachineOpen}
        onClose={() => setIsTimeMachineOpen(false)}
      />

      {/* DISCOVERY QUIZ & BADGES MODAL */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        unlockedBadgeIds={unlockedBadges}
        onUnlockBadge={unlockBadge}
      />

      {/* ABOUT & NASA SOURCES MODAL */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* DEDICATED 3D MODEL LAB MODAL (Real NASA Models + GitHub Link + File Upload) */}
      <ModelInspectionModal
        isOpen={isModelTerminalOpen}
        onClose={() => setIsModelTerminalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
