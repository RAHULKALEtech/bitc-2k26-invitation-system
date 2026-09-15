import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Pause, Play, AlertCircle, Sparkles } from 'lucide-react';

interface VoiceControllerProps {
  textToSpeak: string;
  autoPlay?: boolean;
  onSpeechStateChange?: (speaking: boolean) => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  textToSpeak,
  autoPlay = true,
  onSpeechStateChange,
}) => {
  const [isSupported, setIsSupported] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const handlePlay = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }
    window.speechSynthesis.cancel(); // Reset previous speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      onSpeechStateChange?.(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      onSpeechStateChange?.(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      onSpeechStateChange?.(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [textToSpeak, onSpeechStateChange]);

  // Auto-initialize voice command system upon invitation reveal
  useEffect(() => {
    if (autoPlay && isSupported) {
      const timer = setTimeout(() => {
        handlePlay();
      }, 500);

      return () => {
        clearTimeout(timer);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [autoPlay, isSupported, handlePlay]);

  const handlePause = () => {
    if (!isSupported) return;
    if (window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        onSpeechStateChange?.(true);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
        onSpeechStateChange?.(false);
      }
    }
  };

  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    onSpeechStateChange?.(false);
  };

  if (!isSupported) {
    return (
      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
        <span>Voice invitation system is not supported by this browser.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border border-cyan-500/40 bg-slate-900/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)] font-mono text-xs w-full max-w-xl">
      <div className="flex items-center space-x-2 text-cyan-300">
        <div className="relative">
          <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          )}
        </div>
        <span className="font-semibold">
          {isPlaying
            ? isPaused
              ? 'VOICE PAUSED'
              : 'VOICE SYSTEM INITIALIZED & PLAYING'
            : 'VOICE SYSTEM READY'}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition shadow-[0_0_10px_rgba(0,240,255,0.3)]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>REPLAY INVITATION</span>
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold transition"
            >
              <Pause className="h-3.5 w-3.5 fill-current" />
              <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>
            <button
              onClick={handleStop}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-300 hover:bg-rose-900 transition"
            >
              <VolumeX className="h-3.5 w-3.5" />
              <span>MUTE</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

