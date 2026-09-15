import React from 'react';
import { Shield, Mail, Volume2, VolumeX, Eye, Sparkles, Terminal } from 'lucide-react';
import { AppMode, AppSettings } from '../types';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  settings: AppSettings;
  onToggleAudio: () => void;
  onToggleMotion: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  settings,
  onToggleAudio,
  onToggleMotion,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#040711]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand logo & Title */}
        <div 
          onClick={() => onSelectMode('landing')}
          className="flex cursor-pointer items-center space-x-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-lg font-black tracking-wider text-cyan-400">
                B!T-C 2K26
              </span>
              <span className="rounded border border-cyan-500/30 bg-cyan-950/60 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
                v2.6
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Department of Computer Science & Engineering
            </p>
          </div>
        </div>

        {/* Quick Nav Switches */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {currentMode !== 'landing' && (
            <button
              onClick={() => onSelectMode('landing')}
              className="px-3 py-1.5 rounded text-xs font-mono text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/30 transition-all"
            >
              HOME
            </button>
          )}

          <button
            onClick={() => onSelectMode(currentMode === 'developer_dashboard' ? 'landing' : 'developer_login')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
              currentMode === 'developer_dashboard' || currentMode === 'developer_login'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                : 'bg-gray-900/60 text-gray-300 border-gray-800 hover:border-cyan-500/30 hover:text-cyan-300'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">DEVELOPER MODE</span>
            <span className="sm:hidden">DEV</span>
          </button>

          <button
            onClick={() => onSelectMode('invitation_mode')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
              currentMode === 'invitation_mode'
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 shadow-[0_0_10px_rgba(255,0,127,0.25)]'
                : 'bg-gray-900/60 text-gray-300 border-gray-800 hover:border-pink-500/30 hover:text-pink-300'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">INVITATION MODE</span>
            <span className="sm:hidden">INVITE</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleAudio}
            title={settings.muteAudio ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition"
          >
            {settings.muteAudio ? (
              <VolumeX className="h-4 w-4 text-rose-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-cyan-400" />
            )}
          </button>

          {/* Motion Toggle */}
          <button
            onClick={onToggleMotion}
            title={settings.reduceMotion ? 'Enable Full Animations' : 'Reduce Motion'}
            className={`p-2 rounded-lg border text-xs font-mono transition ${
              settings.reduceMotion
                ? 'border-yellow-500/50 bg-yellow-950/40 text-yellow-400'
                : 'border-slate-800 bg-slate-900/60 text-gray-400 hover:text-cyan-400'
            }`}
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
