import React, { useState } from 'react';
import {
  Compass,
  Cpu,
  Sliders,
  HelpCircle,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Layers,
  Radio,
  Globe,
  FileCode,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface NavigationHUDProps {
  currentFocus: string;
  onSelectFocus: (focus: string) => void;
  showFootprints: boolean;
  onToggleFootprints: () => void;
  onOpenSimModal: () => void;
  onOpenAIModal: () => void;
  onOpenTimeMachineModal: () => void;
  onOpenQuizModal: () => void;
  onOpenAboutModal: () => void;
  onOpenCustomModelModal?: () => void;
  endedMissionsCount: number;
  totalMissionsCount: number;
  lang: 'en' | 'bn';
  onToggleLang: () => void;
}

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  currentFocus,
  onSelectFocus,
  showFootprints,
  onToggleFootprints,
  onOpenSimModal,
  onOpenAIModal,
  onOpenTimeMachineModal,
  onOpenQuizModal,
  onOpenAboutModal,
  onOpenCustomModelModal,
  endedMissionsCount,
  totalMissionsCount,
  lang,
  onToggleLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const toggleSound = () => {
    const nextState = !isMuted;
    soundManager.setMuted(nextState);
    setIsMuted(nextState);
    if (!nextState) soundManager.playRadarPing();
  };

  const navTargets = [
    { id: 'solar', labelEn: 'Solar System', labelBn: 'সৌরজগত' },
    { id: 'earth', labelEn: 'Earth', labelBn: 'পৃথিবী' },
    { id: 'moon', labelEn: 'Moon', labelBn: 'চাঁদ' },
    { id: 'mars', labelEn: 'Mars', labelBn: 'মঙ্গল গ্রহ' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 sm:p-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand / NASA Challenge Kicker */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playRadarPing();
              onSelectFocus('solar');
            }}
            className="flex flex-col text-left group transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                NASA SPACE APPS 2026
              </span>
              <span className="text-slate-600 text-xs" aria-hidden="true">·</span>
              <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">
                {lang === 'bn' ? 'চ্যালেঞ্জ #১' : 'CHALLENGE #1'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading group-hover:text-cyan-300 transition">
                MISSION ECHO
              </span>
              <span className="hidden md:inline text-xs text-amber-300/80 font-mono tracking-tight">
                {lang === 'bn' ? 'ফেলে আসা কিন্তু বিস্মৃত নয়' : 'Abandoned but Not Forgotten'}
              </span>
            </div>
          </button>
        </div>

        {/* Central Planetary Navigation (Segmented Controls) */}
        <nav
          aria-label="Celestial Target Navigation"
          className="hidden md:flex items-center bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-1 shadow-2xl"
        >
          {navTargets.map((target) => {
            const isActive = currentFocus === target.id;
            return (
              <button
                key={target.id}
                onClick={() => {
                  soundManager.playRadarPing();
                  onSelectFocus(target.id);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {lang === 'bn' ? target.labelBn : target.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Actions & Utilities Bar */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Button (EN / বাংলা) */}
          <button
            onClick={() => {
              soundManager.playHotspotClick();
              onToggleLang();
            }}
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-slate-950/85 hover:bg-slate-900 text-cyan-300 border border-cyan-500/40 rounded-xl shadow transition"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{lang === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* "Show Humanity's Footprints" Toggle */}
          <button
            onClick={() => {
              soundManager.playHotspotClick();
              onToggleFootprints();
            }}
            title={lang === 'bn' ? 'মানবজাতির ফেলে আসা প্রযুক্তি চিহ্ন' : 'Highlight all human-made hardware relics'}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              showFootprints
                ? 'bg-amber-950/90 border-amber-500/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'মানবজাতির পদচিহ্ন' : 'Footprints'}</span>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {endedMissionsCount}/{totalMissionsCount}
            </span>
          </button>

          {/* Mission Control Simulator */}
          <button
            onClick={() => {
              soundManager.playHotspotClick();
              onOpenSimModal();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'bn' ? 'মিশন কন্ট্রোল' : 'Mission Control'}</span>
          </button>

          {/* AI Mission Guide */}
          <button
            onClick={() => {
              soundManager.playHotspotClick();
              onOpenAIModal();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-200 border border-cyan-500/50 rounded-xl transition shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'bn' ? 'এআই গাইড' : 'AI Guide'}</span>
          </button>

          {/* Time Machine & Rover Tech Evolution */}
          <button
            onClick={() => {
              soundManager.playHotspotClick();
              onOpenTimeMachineModal();
            }}
            title="View Space History Timeline & Rover Evolution"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition"
          >
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span>{lang === 'bn' ? 'টাইমলাইন' : 'Timeline'}</span>
          </button>

          {/* Discovery Quiz */}
          <button
            onClick={() => {
              soundManager.playHotspotClick();
              onOpenQuizModal();
            }}
            title="Discovery Quiz & Badges"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'bn' ? 'কুইজ' : 'Quiz'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute telemetry audio' : 'Mute telemetry audio'}
            className="p-2 bg-slate-950/85 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* About / Info */}
          <button
            onClick={() => {
              soundManager.playHotspotClick();
              onOpenAboutModal();
            }}
            aria-label="About project & NASA sources"
            className="p-2 bg-slate-950/85 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition"
            title="Project Sources & Challenge Info"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-slate-950/85 text-slate-300 border border-slate-800 rounded-xl transition"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>{lang === 'bn' ? 'প্ল্যানেটারি নেভিগেশন' : 'Planetary Navigation'}</span>
            <button
              onClick={() => {
                onToggleLang();
              }}
              className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded text-[11px]"
            >
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navTargets.map((target) => (
              <button
                key={target.id}
                onClick={() => {
                  soundManager.playRadarPing();
                  onSelectFocus(target.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition ${
                  currentFocus === target.id
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {lang === 'bn' ? target.labelBn : target.labelEn}
              </button>
            ))}
          </div>

          <div className="h-px bg-slate-800 my-1" />

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onToggleFootprints();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between px-3 py-2 text-xs rounded-xl border transition ${
                showFootprints
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                {lang === 'bn' ? 'মানবজাতির পদচিহ্ন' : 'Humanity’s Footprints'}
              </span>
              <span className="font-mono text-amber-400">
                {endedMissionsCount}/{totalMissionsCount}
              </span>
            </button>

            <button
              onClick={() => {
                onOpenSimModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              {lang === 'bn' ? 'মিশন কন্ট্রোল সিমুলেটর' : 'Mission Control Simulator'}
            </button>

            <button
              onClick={() => {
                onOpenAIModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-300"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {lang === 'bn' ? 'এআই মিশন গাইড ও কথোপকথন' : 'AI Mission Guide & Talk to Craft'}
            </button>

            <button
              onClick={() => {
                onOpenTimeMachineModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
            >
              <Cpu className="w-4 h-4 text-violet-400" />
              {lang === 'bn' ? 'স্পেস টাইমলাইন ও রোভার ইভোলিউশন' : 'Space Timeline & Rover Evolution'}
            </button>

            <button
              onClick={() => {
                onOpenQuizModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              {lang === 'bn' ? 'ডিসকভারি কুইজ ও ব্যাজ' : 'Discovery Quiz & Badges'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
