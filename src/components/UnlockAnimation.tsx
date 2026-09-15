import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, Cpu, Scan, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface UnlockAnimationProps {
  onComplete: () => void;
}

export const UnlockAnimation: React.FC<UnlockAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(1);

  const STAGES = [
    { id: 1, text: 'STAGE 1: DIGITAL SYSTEM BOOT...', icon: Cpu },
    { id: 2, text: 'STAGE 2: INITIALIZING CYBER GRID...', icon: Terminal },
    { id: 3, text: 'STAGE 3: SCANNING SECURITY BEAM...', icon: Scan },
    { id: 4, text: 'STAGE 4: GATHERING HOLOGRAPHIC PARTICLES...', icon: Sparkles },
    { id: 5, text: 'STAGE 5: MATERIALIZING INVITATION CARD...', icon: Sparkles },
    { id: 6, text: 'STAGE 6: VERIFYING FACULTY BIOMETRIC PHOTO...', icon: CheckCircle2 },
    { id: 7, text: 'STAGE 7: REVEALING B!T-C 2K26 TITLE...', icon: Terminal },
    { id: 8, text: 'STAGE 8: ACTIVATING B!T-C AI ASSISTANT...', icon: Sparkles },
  ];

  useEffect(() => {
    cyberAudio.playScanBeam();
    const interval = setInterval(() => {
      setStage((prev) => {
        if (prev >= 8) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 8;
        }
        return prev + 1;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  const currentStageInfo = STAGES[stage - 1] || STAGES[7];
  const IconComponent = currentStageInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#040711] overflow-hidden">
      {/* Background Cyber Grid & Scanning beam */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff] animate-scanline pointer-events-none" />

      {/* Main Animation Container */}
      <div className="relative z-10 max-w-md w-full text-center space-y-8 p-8 rounded-3xl border border-cyan-500/40 bg-slate-900/80 backdrop-blur-xl clip-corner shadow-[0_0_50px_rgba(0,240,255,0.3)]">
        <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.5)] mx-auto">
          <IconComponent className="h-12 w-12 animate-pulse" />
          <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-2xl animate-ping opacity-40" />
        </div>

        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/50 text-cyan-300 font-mono text-xs">
            DECRYPTION STAGE {stage} OF 8
          </span>

          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-mono text-sm font-bold text-white tracking-wide"
            >
              {currentStageInfo.text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.8)]"
            style={{ width: `${(stage / 8) * 100}%` }}
          />
        </div>

        {/* Skip Animation Button */}
        <button
          onClick={onComplete}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-mono text-xs transition"
        >
          <FastForward className="h-4 w-4 text-cyan-400" />
          <span>SKIP ANIMATION</span>
        </button>
      </div>
    </div>
  );
};
