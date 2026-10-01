import React from 'react';
import { X, HelpCircle, ExternalLink, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                <span>NASA SPACE APPS CHALLENGE 2026</span>
              </div>
              <h2 id="about-modal-title" className="text-xl font-bold text-white font-heading">
                About Mission Echo
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close about modal"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Challenge Statement */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold block">
              CHALLENGE #1: ABANDONED BUT NOT FORGOTTEN
            </span>
            <p className="text-white font-medium text-base">
              “What did humanity leave behind, and what did we learn from it?”
            </p>
            <p className="text-xs text-slate-400 leading-normal">
              When robotic explorers on Mars run out of solar power, or Apollo descent stages remain in the lunar vacuum, their operational life ends—but their technological legacy remains immortal. Mission Echo preserves and celebrates these monuments of human ingenuity.
            </p>
          </div>

          {/* Project Story */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white font-heading">
              The Project Narrative
            </h3>
            <p className="text-slate-300">
              Humanity sends machines into space. They travel millions of kilometers across cold cosmic voids. They land on hostile alien worlds. They collect data. They make paradigm-shifting discoveries.
            </p>
            <p className="text-slate-300 italic border-l-2 border-cyan-500 pl-3">
              “Eventually, missions end. The machines stop transmitting. But the hardware remains. The data remains. The knowledge remains. The story continues.”
            </p>
          </div>

          {/* Scientific Verification & Authoritative Sources */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authoritative Data & Image Sources</span>
            </h3>
            <p className="text-xs text-slate-400">
              All coordinates, dates, technical specs, and historical quotes in Mission Echo are grounded directly in official NASA, JPL, and ESA repositories:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <a
                href="https://mars.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-cyan-300 transition"
              >
                <span>NASA Mars Exploration</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href="https://photojournal.jpl.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-cyan-300 transition"
              >
                <span>NASA/JPL Photojournal</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href="https://pds.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-cyan-300 transition"
              >
                <span>Planetary Data System (PDS)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href="https://lroc.sese.asu.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-cyan-300 transition"
              >
                <span>LRO Camera Lunar Catalog</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Educational Accessibility & Design Constitution */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white font-heading">
              Design & Accessibility Standards
            </h3>
            <p className="text-xs text-slate-400">
              Built with real-time 3D WebGL (Three.js), synthetic Web Audio API telemetry, server-proxied Gemini 3.8 Flash intelligence, and strict WCAG AA contrast compliance. Features multilingual support including English and Bengali (বাংলা).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>MISSION ECHO • NASA SPACE APPS CHALLENGE 2026</span>
          <span className="flex items-center gap-1 text-slate-300">
            <span>Built for open space education</span>
          </span>
        </div>
      </div>
    </div>
  );
};
