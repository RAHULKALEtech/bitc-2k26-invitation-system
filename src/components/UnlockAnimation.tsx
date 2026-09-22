import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, Cpu, Scan, Sparkles, Terminal, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface UnlockAnimationProps {
  onComplete: () => void;
  videoSrc?: string;
}

export const UnlockAnimation: React.FC<UnlockAnimationProps> = ({
  onComplete,
  videoSrc = '/jsdR10000.mp4',
}) => {
  const [stage, setStage] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const STAGES = [
    { id: 1, text: 'SYSTEM BOOT...', icon: Cpu },
    { id: 2, text: 'CYBER GRID INIT...', icon: Terminal },
    { id: 3, text: 'SECURITY BEAM SCAN...', icon: Scan },
    { id: 4, text: 'HOLOGRAPHIC PARTICLES...', icon: Sparkles },
    { id: 5, text: 'MATERIALIZING CARD...', icon: Sparkles },
    { id: 6, text: 'FACULTY BIOMETRICS...', icon: CheckCircle2 },
    { id: 7, text: 'REVEALING TITLE...', icon: Terminal },
    { id: 8, text: 'ACTIVATING BTC AI...', icon: Sparkles },
  ];

  useEffect(() => {
    cyberAudio.playScanBeam();

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play().then(() => {
        setIsMuted(false);
      }).catch((err) => {
        console.warn('Unmuted video play prevented by browser policy, falling back to muted:', err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const currentStageInfo = STAGES[stage - 1] || STAGES[7];
  const IconComponent = currentStageInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center p-4 bg-black overflow-hidden select-none">
      {/* Background Video (100% Opacity + Audio) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        preload="auto"
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500"
        style={{
          filter: 'brightness(1) contrast(1.05)',
          transform: 'translateZ(0)',
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src="/jsdR10000.mp4" type="video/mp4" />
        <source src="/jsdR500.mp4" type="video/mp4" />
        <source src="/jsdR25_5.mp4" type="video/mp4" />
      </video>

      {/* Subtle Scanline Beam */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff] animate-scanline pointer-events-none z-10" />

      {/* Top Right Controls: Mute/Unmute Audio */}
      <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
        <button
          onClick={toggleMute}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-950/80 text-cyan-300 font-mono text-xs backdrop-blur-md hover:bg-slate-900 transition shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95 cursor-pointer"
          title={isMuted ? 'Unmute Video Audio' : 'Mute Video Audio'}
        >
          {isMuted ? (
            <>
              <VolumeX className="h-4 w-4 text-rose-400" />
              <span className="text-rose-400 font-bold">UNMUTE AUDIO</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>AUDIO ON</span>
            </>
          )}
        </button>
      </div>

      {/* Small Compact Animation Container */}
      <div className="relative z-20 max-w-[320px] w-full text-center space-y-4 p-5 rounded-2xl border border-cyan-500/50 bg-slate-950/75 backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.3)] mb-6 sm:mb-0">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.6)]">
            <IconComponent className="h-5 w-5 animate-pulse" />
          </div>

          <div className="text-left flex-1 min-w-0">
            <span className="block text-[10px] font-mono text-cyan-400 tracking-wider">
              DECRYPTION {stage} / 8
            </span>
            <AnimatePresence mode="wait">
              <motion.p
                key={stage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="font-mono text-xs font-bold text-white truncate"
              >
                {currentStageInfo.text}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-900 border border-slate-700/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.9)]"
            style={{ width: `${(stage / 8) * 100}%` }}
          />
        </div>

        {/* Skip Button */}
        <div className="pt-1 flex justify-center">
          <button
            onClick={onComplete}
            className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-mono text-[11px] transition active:scale-95 cursor-pointer"
          >
            <FastForward className="h-3.5 w-3.5 text-cyan-400" />
            <span>SKIP ANIMATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
