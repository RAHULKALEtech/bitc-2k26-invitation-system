import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldAlert, ShieldCheck, Terminal, Loader2, ArrowLeft } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface DeveloperLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const DeveloperLogin: React.FC<DeveloperLoginProps> = ({ onSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const DEV_PASSWORD = 'Ramrk@72485';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    cyberAudio.playClick();

    setTimeout(() => {
      setIsLoading(false);
      if (password === DEV_PASSWORD) {
        setSuccessMessage('ACCESS GRANTED — WELCOME DEVELOPER');
        cyberAudio.playUnlockSuccess();
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else {
        setErrorMessage('ACCESS DENIED — INVALID ACCESS CODE');
        cyberAudio.playAccessDenied();
      }
    }, 600);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12 bg-cyber-dark overflow-hidden">
      {/* Background Matrix/Grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full p-8 rounded-2xl border border-cyan-500/40 bg-slate-900/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,240,255,0.2)] clip-corner"
      >
        {/* Top Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 font-mono text-xs text-gray-400 hover:text-cyan-400 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>BACK TO MAIN PORTAL</span>
        </button>

        {/* Security Terminal Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] mx-auto">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="font-display text-3xl font-black tracking-wider text-cyan-400">
            DEVELOPER ACCESS
          </h2>
          <div className="font-mono text-xs text-gray-400 space-y-1">
            <p className="text-emerald-400">● SYSTEM SECURE</p>
            <p>ENTER AUTHORIZATION CODE TO CONTINUE</p>
          </div>
        </div>

        {/* LoginForm */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs font-semibold text-gray-300">
              DEVELOPER PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-300 font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Feedback Toasts/Messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 font-mono text-xs"
            >
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-mono text-xs"
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-mono text-sm font-bold text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.5)] disabled:opacity-50 transition active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-black" />
                <span>SCANNING AUTHORIZATION...</span>
              </>
            ) : (
              <>
                <Terminal className="h-4 w-4" />
                <span>AUTHENTICATE DEVELOPER</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
