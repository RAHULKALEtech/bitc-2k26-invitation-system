import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, Volume2, VolumeX, Sparkles, Play } from 'lucide-react';

interface FullscreenIntroVideoProps {
  onComplete: () => void;
  videoSrc?: string;
}

export const FullscreenIntroVideo: React.FC<FullscreenIntroVideoProps> = ({
  onComplete,
  videoSrc = '/jsdR25_5.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setHasStarted(true);
      }).catch((err) => {
        console.warn('Autoplay with sound prevented, attempting muted play:', err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
          setHasStarted(true);
        }
      });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 w-full h-full bg-black flex items-center justify-center overflow-hidden select-none"
    >
      {/* Background Cyber Grid Lines */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 pointer-events-none z-10" />

      {/* Full-Screen Video Tag with GPU Clarity Filters */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        preload="auto"
        muted={isMuted}
        controls={false}
        onEnded={onComplete}
        className="w-full h-full object-contain sm:object-cover transition-all duration-300 shadow-[0_0_120px_rgba(0,240,255,0.5)]"
        style={{
          filter: 'contrast(1.18) brightness(1.08) saturate(1.15)',
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src="/jsdR25_5.mp4" type="video/mp4" />
        <source src="/jsdR25 (5).mp4" type="video/mp4" />
        <source src="/jsdR500.mp4" type="video/mp4" />
      </video>

      {/* Top Banner Tag */}
      <div className="absolute top-6 left-6 z-20 flex items-center space-x-2 px-4 py-2 rounded-xl border border-cyan-500/40 bg-slate-900/80 backdrop-blur-md text-cyan-300 font-mono text-xs shadow-[0_0_20px_rgba(0,240,255,0.3)]">
        <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
        <span>B!T-C 2K26 — REVEAL SEQUENCE INITIALIZED</span>
      </div>

      {/* Control Buttons: Skip Video & Mute Toggle */}
      <div className="absolute top-6 right-6 z-20 flex items-center space-x-3">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-gray-300 hover:text-cyan-400 font-mono text-xs backdrop-blur-md transition"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
        </button>

        <button
          onClick={onComplete}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-cyan-400 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)] backdrop-blur-md transition active:scale-95"
        >
          <FastForward className="h-4 w-4 text-cyan-400" />
          <span>SKIP INTRO VIDEO</span>
        </button>
      </div>

      {/* Bottom Progress Aura */}
      <div className="absolute bottom-6 inset-x-6 z-20 flex justify-between items-center font-mono text-xs text-gray-400">
        <span className="text-cyan-400">● CINEMATIC INTRO PLAYING</span>
        <span className="text-gray-500">PRESS SKIP ANYTIME TO REVEAL INVITATION</span>
      </div>
    </motion.div>
  );
};
