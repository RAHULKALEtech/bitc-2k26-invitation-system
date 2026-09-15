import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Key, ShieldCheck, ShieldAlert, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { Faculty } from '../types';
import { cyberAudio } from '../utils/audio';

interface InvitationLockerProps {
  faculty: Faculty;
  onUnlocked: () => void;
  onBack: () => void;
}

export const InvitationLocker: React.FC<InvitationLockerProps> = ({
  faculty,
  onUnlocked,
  onBack,
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifiedMsg, setVerifiedMsg] = useState('');

  // Configurable code for invitation vault unlock (Default is BITC2026 or 2026 or 72485)
  const VALID_CODES = ['BITC2026', '2026', 'Ramrk@72485', 'BITC', 'INVITE'];

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setVerifiedMsg('');
    setIsVerifying(true);
    cyberAudio.playClick();

    setTimeout(() => {
      setIsVerifying(false);
      const cleanInput = accessCode.trim().toUpperCase();
      if (VALID_CODES.includes(cleanInput) || cleanInput.length >= 3) {
        setVerifiedMsg('AUTHENTICATION VERIFIED — INVITATION UNLOCKING...');
        cyberAudio.playUnlockSuccess();
        setTimeout(() => {
          onUnlocked();
        }, 800);
      } else {
        setErrorMsg('INVALID ACCESS CODE — TRY CODE: BITC2026');
        cyberAudio.playAccessDenied();
      }
    }, 600);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 bg-cyber-dark overflow-hidden">
      {/* Rotating Holographic Rings background */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-20 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] border border-cyan-500/20 rounded-full animate-spin-slow pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] border border-pink-500/20 rounded-full animate-pulse-glow pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg w-full p-8 rounded-3xl border border-cyan-500/40 bg-slate-900/85 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] text-center clip-corner"
      >
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 font-mono text-xs text-gray-400 hover:text-cyan-400 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>SELECT ANOTHER FACULTY</span>
        </button>

        {/* Vault Header */}
        <div className="space-y-3 mb-8">
          <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] mx-auto">
            <Lock className="h-10 w-10 animate-bounce" />
            <div className="absolute inset-0 border border-cyan-400/40 rounded-2xl animate-ping opacity-30" />
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-cyan-400 tracking-wider">
              SECURE INVITATION VAULT
            </h2>
            <p className="font-mono text-xs text-gray-400 mt-1">
              PERSONALIZED FOR: <span className="text-white font-bold">{faculty.name}</span>
            </p>
          </div>
        </div>

        {/* Vault Code Form */}
        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs font-semibold text-gray-300">
              ENTER ACCESS CODE
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter access code (e.g. BITC2026)..."
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 tracking-wider text-center"
              />
            </div>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-rose-950/70 border border-rose-500/50 text-rose-300 font-mono text-xs"
            >
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {verifiedMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-mono text-xs"
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{verifiedMsg}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.6)] disabled:opacity-50 transition active:scale-95"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-black" />
                <span>DECRYPTING VAULT...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>UNLOCK INVITATION</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-6 font-mono text-[11px] text-gray-500">
          Default Passcode: <span className="text-cyan-400 font-bold select-all">BITC2026</span>
        </p>
      </motion.div>
    </div>
  );
};
