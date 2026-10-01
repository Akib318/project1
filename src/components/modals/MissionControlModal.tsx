import React, { useState } from 'react';
import { SIMULATION_SCENARIOS, SimulationScenario, SimulationChoice } from '../../data/simulationsData';
import { X, Sliders, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle, RefreshCw, Radio } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface MissionControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScenarioId?: string;
  onUnlockBadge?: (badgeId: string) => void;
}

export const MissionControlModal: React.FC<MissionControlModalProps> = ({
  isOpen,
  onClose,
  initialScenarioId,
  onUnlockBadge,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    initialScenarioId || SIMULATION_SCENARIOS[0].id
  );
  const [selectedChoice, setSelectedChoice] = useState<SimulationChoice | null>(null);

  if (!isOpen) return null;

  const currentScenario = SIMULATION_SCENARIOS.find((s) => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];

  const handleSelectChoice = (choice: SimulationChoice) => {
    soundManager.playHotspotClick();
    setSelectedChoice(choice);
    if (onUnlockBadge) {
      onUnlockBadge('badge-flight-director');
    }
  };

  const handleResetScenario = () => {
    setSelectedChoice(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sim-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header: Mission Control Telemetry */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/80 border border-cyan-500/40 rounded-lg text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>FLIGHT DIRECTOR CONSOLE • EDUCATIONAL SIMULATION</span>
              </div>
              <h2 id="sim-title" className="text-xl font-bold text-white font-heading">
                Mission Control Decision Simulator
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close mission control modal"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-mono text-[11px] mr-1">SCENARIO:</span>
          {SIMULATION_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => {
                setSelectedScenarioId(scen.id);
                setSelectedChoice(null);
                soundManager.playRadarPing();
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                scen.id === currentScenario.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {scen.missionName}
            </button>
          ))}
        </div>

        {/* Scrollable Simulation Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Crisis Briefing Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-cyan-400 font-semibold">{currentScenario.target}</span>
              <span>{currentScenario.solOrDate}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {currentScenario.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentScenario.crisisBrief}
            </p>

            {/* Live Environmental Telemetry Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {currentScenario.environmentalTelemetry.map((t, idx) => (
                <div key={idx} className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-tight">
                    {t.label}
                  </div>
                  <div
                    className={`text-sm font-mono font-bold mt-1 ${
                      t.status === 'CRITICAL'
                        ? 'text-red-400'
                        : t.status === 'WARNING'
                        ? 'text-amber-400'
                        : 'text-cyan-300'
                    }`}
                  >
                    {t.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Section */}
          {!selectedChoice ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                  {currentScenario.challengeQuestion}
                </h4>
              </div>

              <div className="space-y-3">
                {currentScenario.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    className="w-full text-left p-4 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-xl transition group flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                        {choice.title}
                      </h5>
                      <span className="text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition">
                        Transmit Command →
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {choice.actionSummary}
                    </p>
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <span className="text-amber-400 mr-1 font-semibold">TRADEOFF:</span>
                      {choice.technicalTradeoff}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Outcome & Educational Debriefing */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div
                className={`p-5 rounded-xl border ${
                  selectedChoice.isHistoricalChoice
                    ? 'bg-emerald-950/30 border-emerald-500/50'
                    : 'bg-amber-950/30 border-amber-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {selectedChoice.isHistoricalChoice ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                    <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                      COMMAND TRANSMISSION RESULT
                    </span>
                  </div>

                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    Accuracy Score: {selectedChoice.historicalAccuracyScore}%
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white mb-2">
                  {selectedChoice.outcomeHeadline}
                </h4>

                <p className="text-sm text-slate-200 leading-relaxed mb-3">
                  {selectedChoice.outcomeText}
                </p>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-cyan-200">
                  <span className="text-amber-400 font-semibold mr-1">SCIENTIFIC LESSON:</span>
                  {selectedChoice.lessonLearned}
                </div>
              </div>

              {/* Historical Context Debrief */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 leading-relaxed">
                <span className="text-slate-400 font-mono uppercase block mb-1 font-semibold">
                  HISTORICAL NASA FLIGHT DEBRIEF
                </span>
                {currentScenario.historicalDebrief}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetScenario}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Strategy</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>EDUCATIONAL MISSION SIMULATOR</span>
          <span>NASA JPL FLIGHT OPERATIONS LOG ARCHIVE</span>
        </div>
      </div>
    </div>
  );
};
