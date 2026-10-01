import React, { useState, useEffect, useRef } from 'react';
import { Mission } from '../../types/mission';
import { askMissionGuide, MissionGuideResponse } from '../../services/geminiService';
import { X, Sparkles, Send, Bot, User, Globe, AlertCircle, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface AIMissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMission?: Mission | null;
  initialPersona?: 'guide' | 'talk_to_mission';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isSimulation?: boolean;
}

export const AIMissionGuideModal: React.FC<AIMissionGuideModalProps> = ({
  isOpen,
  onClose,
  initialMission,
  initialPersona = 'guide',
}) => {
  const [persona, setPersona] = useState<'guide' | 'talk_to_mission'>(initialPersona);
  const [language, setLanguage] = useState<'en' | 'bn' | 'simple_en'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync persona if initialMission / initialPersona changed
  useEffect(() => {
    if (initialPersona) {
      setPersona(initialPersona);
    }
  }, [initialPersona]);

  // Seed welcome message when opened
  useEffect(() => {
    if (!isOpen) return;

    const missionName = initialMission?.name || 'Solar System Hardware';
    let welcomeText = '';

    if (language === 'bn') {
      welcomeText = `নমস্কার! আমি মিশন ইকো এআই গাইড। আপনি বর্তমানে ${missionName} সংক্রান্ত তথ্য বা মানবজাতির ফেলে আসা মহাকাশ প্রযুক্তি নিয়ে যেকোনো প্রশ্ন করতে পারেন।`;
    } else if (persona === 'talk_to_mission' && initialMission) {
      welcomeText = `Telemetry linked. You are communicating directly with the simulated voice of ${initialMission.name} (${initialMission.callsign}). I am currently resting at ${initialMission.location.regionName}. What would you like to ask me about my journey?`;
    } else {
      welcomeText = `Welcome to the Mission Echo AI Guide. I am your NASA Space Apps archival assistant. Ask me anything about ${missionName}, how humanity's space hardware operated, why missions ended, or what relics remain on the Moon and Mars.`;
    }

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: welcomeText,
        timestamp: 'Telemetry Sync: 00:00',
        isSimulation: persona === 'talk_to_mission',
      },
    ]);
  }, [isOpen, initialMission, persona, language]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    soundManager.playHotspotClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response: MissionGuideResponse = await askMissionGuide({
        prompt: textToSend,
        context: {
          location: initialMission?.location.regionName || 'Solar System',
          missionName: initialMission?.name,
          target: initialMission?.destination || 'General',
          status: initialMission?.status,
        },
        persona: persona,
        language: language,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulation: persona === 'talk_to_mission',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Signal interrupted across the Deep Space Network. Please query again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    ...(initialMission?.id === 'opportunity'
      ? [
          'Why did your mission end in 2018?',
          'What did the hematite blueberries prove?',
          'What was your favorite sol on Mars?',
        ]
      : initialMission?.id === 'insight'
      ? [
          'How did you detect over 1,300 marsquakes?',
          'Why did dust stop your mission?',
          'What did you discover about Mars’ core?',
        ]
      : initialMission?.id === 'apollo11'
      ? [
          'What hardware remains at Tranquility Base?',
          'Does the laser retroreflector still work?',
        ]
      : [
          'Why do solar panels fail on Mars?',
          'What remains on the Moon from Apollo?',
          'কিভাবে অপরচুনিটি রোভার মঙ্গলে পানি খুঁজে পায়?',
        ]),
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden"
    >
      <div className="relative w-full max-w-3xl h-[88vh] bg-slate-950 border border-cyan-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/80 border border-cyan-500/50 rounded-lg text-cyan-400">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>GEMINI AI MISSION GUIDE</span>
              </div>
              <h2 id="ai-guide-title" className="text-lg font-bold text-white font-heading">
                {persona === 'talk_to_mission' && initialMission
                  ? `Talk to ${initialMission.name}`
                  : 'AI Space Exploration Guide'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close AI Mission Guide"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona & Language Bar (Segmented Controls) */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Persona selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-mono text-[11px] mr-1">VOICE:</span>
            <button
              onClick={() => setPersona('guide')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                persona === 'guide'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              NASA Flight Historian
            </button>
            {initialMission && (
              <button
                onClick={() => setPersona('talk_to_mission')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                  persona === 'talk_to_mission'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>Talk to {initialMission.callsign || 'Craft'}</span>
              </button>
            )}
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            {(['en', 'bn', 'simple_en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  language === lang
                    ? 'bg-slate-800 text-white border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'bn' ? 'বাংলা' : 'Simple EN'}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-xs'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-bl-xs'
                }`}
              >
                {msg.isSimulation && (
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Simulated Historical First-Person Telemetry</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-2 text-right">
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-3 bg-slate-900/50 rounded-xl border border-slate-800 w-fit animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Decoding deep-space telemetry signal...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Prompts Bar */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-mono text-[11px] shrink-0">SUGGESTED:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-md text-slate-300 hover:text-white shrink-0 transition text-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={
              persona === 'talk_to_mission' && initialMission
                ? `Ask ${initialMission.callsign} a question...`
                : 'Ask about missions, hardware, why missions ended, or science...'
            }
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            aria-label="Send message"
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
