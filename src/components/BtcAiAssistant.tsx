import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageSquare, Volume2 } from 'lucide-react';

interface BtcAiAssistantProps {
  onSpeak: () => void;
  isSpeaking: boolean;
}

export const BtcAiAssistant: React.FC<BtcAiAssistantProps> = ({ onSpeak, isSpeaking }) => {
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(0);

  const SPEECH_PROMPTS = [
    'Hello! 👋 I have a special invitation prepared for you.',
    'This invitation message has been personally written by the developer.',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.15)] flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-left"
    >
      {/* Cute Holographic AI Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-950 to-pink-950 border border-cyan-400/50 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
          <Bot className="h-8 w-8 animate-bounce" />
        </div>
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-black">
          <Sparkles className="h-2.5 w-2.5" />
        </div>
      </div>

      {/* Speech Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-display text-sm font-bold text-cyan-400">
            B!T-C AI Assistant
          </h4>
          <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
            ONLINE
          </span>
        </div>
        <p className="font-sans text-xs text-gray-200 leading-relaxed italic">
          "{SPEECH_PROMPTS[activeSpeechIndex]}"
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={() => setActiveSpeechIndex((prev) => (prev === 0 ? 1 : 0))}
          className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 hover:text-cyan-400 text-xs font-mono transition"
          title="Toggle Assistant Note"
        >
          <MessageSquare className="h-4 w-4" />
        </button>

        <button
          onClick={onSpeak}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border text-xs font-mono font-bold transition ${
            isSpeaking
              ? 'border-pink-500 bg-pink-950/60 text-pink-300 shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60'
          }`}
        >
          <Volume2 className="h-4 w-4 text-cyan-400" />
          <span>{isSpeaking ? 'SPEAKING...' : 'VOICE INVITATION'}</span>
        </button>
      </div>
    </motion.div>
  );
};
