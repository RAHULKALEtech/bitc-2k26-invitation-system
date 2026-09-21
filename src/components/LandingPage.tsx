import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Cpu, Terminal, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { AppMode } from '../types';

interface LandingPageProps {
  onSelectMode: (mode: AppMode) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectMode }) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden bg-cyber-dark select-none">
      {/* jsdR25 Background Video (ONLY on Front Landing Page) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen filter contrast-125 brightness-110 pointer-events-none transition-opacity duration-1000"
      >
        <source src="/jsdR25.mp4" type="video/mp4" />
        <source src="/jsdR25 (2).mp4" type="video/mp4" />
      </video>

      {/* Dynamic Animated Neon Color Overlays */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-25 pointer-events-none" />

      {/* Neon Glow Pulsing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-indigo-500/20 blur-[150px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-gradient-to-r from-pink-500/25 via-rose-500/15 to-purple-500/25 blur-[150px] rounded-full pointer-events-none"
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl w-full text-center space-y-10">
        {/* Department Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs sm:text-sm font-mono tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.2)]"
        >
          <Cpu className="h-4 w-4 animate-spin-slow text-cyan-400" />
          <span>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</span>
        </motion.div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-pink-500 drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]">
            B!T-C 2K26
          </h1>
          <p className="font-sans text-xl sm:text-2xl font-bold tracking-wide text-gray-200 max-w-2xl mx-auto">
            Department Forum Invitation System
          </p>
          <p className="font-mono text-sm text-gray-400 max-w-lg mx-auto">
            A next-generation futuristic portal for generating, unlocking, and managing personalized faculty invitations.
          </p>
        </motion.div>

        {/* Two Large Futuristic Interactive Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-6 max-w-4xl mx-auto">
          {/* Card 1: DEVELOPER MODE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-cyan-500/30 bg-slate-900/70 backdrop-blur-xl hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all clip-corner text-left"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Lock className="h-7 w-7" />
                </div>
                <span className="font-mono text-xs text-cyan-400/80 border border-cyan-500/20 px-2 py-1 rounded bg-cyan-950/30">
                  ADMIN ONLY
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  🔐 DEVELOPER MODE
                </h3>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Manage faculty information, personalized invitation messages, invitation images, and track real-time invitation status.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectMode('developer_login')}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all active:scale-95"
              >
                <span>ENTER DEVELOPER MODE</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: INVITATION MODE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-pink-500/30 bg-slate-900/70 backdrop-blur-xl hover:border-pink-400 hover:shadow-[0_0_30px_rgba(255,0,127,0.3)] transition-all clip-corner text-left"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-400 group-hover:scale-110 transition-transform">
                  <Mail className="h-7 w-7" />
                </div>
                <span className="font-mono text-xs text-pink-400/80 border border-pink-500/20 px-2 py-1 rounded bg-pink-950/30">
                  GUEST ACCESS
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">
                  💌 INVITATION MODE
                </h3>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Open a personalized futuristic invitation for a faculty member with cyber locker unlocking, voice assistant, and WhatsApp sharing.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectMode('invitation_mode')}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 shadow-[0_0_20px_rgba(255,0,127,0.5)] transition-all active:scale-95"
              >
                <span>OPEN INVITATION MODE</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer info tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-6 font-mono text-xs text-center space-y-1"
        >
          <div className="flex items-center justify-center space-x-1.5 font-bold text-cyan-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>B!TC 2k26 Invitation System</span>
          </div>
          <div className="text-gray-400 text-[11px]">
            Developed by Rahul Sunil kale and INVITATION Committee
          </div>
        </motion.div>
      </div>
    </div>
  );
};
