import React, { useState } from 'react';
import { QUIZ_QUESTIONS, EXPLORER_BADGES, QuizQuestion, ExplorerBadge } from '../../data/quizData';
import { X, Award, CheckCircle2, XCircle, RotateCcw, Sparkles, Radio } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
  onUnlockBadge: (badgeId: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds,
  onUnlockBadge,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    soundManager.playHotspotClick();
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      if (score >= 4) {
        onUnlockBadge('badge-heritage-guardian');
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-950 border border-emerald-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>EDUCATIONAL DISCOVERY QUIZ</span>
              </div>
              <h2 id="quiz-modal-title" className="text-xl font-bold text-white font-heading">
                Space Heritage & Relics Challenge
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close quiz modal"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {!quizCompleted ? (
            <div className="space-y-5">
              {/* Question Progress Tracker */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
                <span>QUESTION {currentQuestionIndex + 1} OF {QUIZ_QUESTIONS.length}</span>
                <span className="text-emerald-400 font-semibold">CURRENT SCORE: {score}</span>
              </div>

              {/* Question Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  CATEGORY: {currentQ.category}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-200 hover:bg-slate-900 hover:border-slate-700';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                    } else {
                      btnStyle = 'bg-slate-950/50 border-slate-850 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-xs text-slate-400 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && (
                        <div>
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                          ) : null}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon answering */}
              {isAnswered && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs leading-relaxed space-y-3 animate-in fade-in duration-150">
                  <div>
                    <span className="font-mono text-cyan-400 font-semibold block mb-0.5">
                      SCIENTIFIC EXPLANATION:
                    </span>
                    <span className="text-slate-300">{currentQ.explanation}</span>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-800/80">
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition flex items-center gap-1.5"
                    >
                      <span>{currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'Complete Quiz'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white font-heading">
                  Quiz Completed!
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  You scored <span className="text-emerald-400 font-bold">{score}</span> out of{' '}
                  <span className="text-white font-bold">{QUIZ_QUESTIONS.length}</span> questions.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 max-w-md mx-auto text-xs text-slate-300">
                {score >= 5 ? (
                  <span className="text-emerald-300 font-medium">
                    Outstanding mastery! You have earned the prestigious "Heritage Guardian" badge for demonstrating deep understanding of humanity’s extraterrestrial relics.
                  </span>
                ) : score >= 3 ? (
                  <span>
                    Great work! You have explored the primary stories of why machines like Opportunity and InSight ended their missions.
                  </span>
                ) : (
                  <span>
                    Keep exploring! Review the mission profiles and 3D hardware CAD models to discover more about space hardware legacy.
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg transition"
                >
                  Return to Solar System
                </button>
              </div>
            </div>
          )}

          {/* Explorer Badges Display Section */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>EXPLORER BADGES ({unlockedBadgeIds.length}/{EXPLORER_BADGES.length} UNLOCKED)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {EXPLORER_BADGES.map((badge) => {
                const isUnlocked = unlockedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                      isUnlocked
                        ? 'bg-slate-900/80 border-cyan-500/40 text-slate-200'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg border shrink-0 ${
                        isUnlocked
                          ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {badge.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>NASA SPACE APPS CHALLENGE #1 EDUCATIONAL QUIZ</span>
          <span>GROUNDED IN PEER-REVIEWED NASA DATA</span>
        </div>
      </div>
    </div>
  );
};
