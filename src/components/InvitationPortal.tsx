import React, { useState } from 'react';
import { Faculty } from '../types';
import { InvitationLocker } from './InvitationLocker';
import { FullscreenIntroVideo } from './FullscreenIntroVideo';
import { UnlockAnimation } from './UnlockAnimation';
import { InvitationCard } from './InvitationCard';
import { WhatsAppShareModal } from './WhatsAppShareModal';
import { Search, Mail, User, ChevronRight, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';

interface InvitationPortalProps {
  facultyList: Faculty[];
  onBack: () => void;
  onRefreshData: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const InvitationPortal: React.FC<InvitationPortalProps> = ({
  facultyList,
  onBack,
  onRefreshData,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [portalStage, setPortalStage] = useState<'selector' | 'locker' | 'intro_video' | 'animation' | 'invitation'>('selector');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.whatsappNumber.includes(searchQuery)
  );

  const handleSelectFaculty = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setPortalStage('locker');
  };

  const handleUnlocked = () => {
    setPortalStage('intro_video');
  };

  const handleIntroVideoComplete = () => {
    setPortalStage('animation');
  };

  const handleAnimationComplete = () => {
    setPortalStage('invitation');
  };

  return (
    <div>
      {portalStage === 'selector' && (
        <div className="min-h-[calc(100vh-65px)] bg-cyber-dark p-4 sm:p-6 lg:p-10 flex flex-col items-center justify-center">
          <div className="max-w-xl w-full space-y-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-1.5 font-mono text-xs text-gray-400 hover:text-cyan-400 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>RETURN TO LANDING PAGE</span>
            </button>

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-950/80 border border-pink-500/50 text-pink-400 shadow-[0_0_20px_rgba(255,0,127,0.3)] mx-auto">
                <Mail className="h-8 w-8" />
              </div>
              <h2 className="font-display text-3xl font-black text-pink-400">
                FACULTY INVITATION PORTAL
              </h2>
              <p className="font-mono text-xs text-gray-400">
                Search & select a faculty member to open their personalized invitation.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ENTER FACULTY NAME..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-pink-500/40 text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 shadow-[0_0_20px_rgba(255,0,127,0.15)]"
              />
            </div>

            {/* Faculty List Selection */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredFaculty.length > 0 ? (
                filteredFaculty.map((faculty) => (
                  <div
                    key={faculty.id}
                    onClick={() => handleSelectFaculty(faculty)}
                    className="group flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-pink-500/60 hover:bg-slate-900/90 cursor-pointer transition-all clip-corner"
                  >
                    <div className="flex items-center space-x-3">
                      {faculty.photo ? (
                        <img
                          src={faculty.photo}
                          alt={faculty.name}
                          className="h-12 w-12 rounded-xl object-cover border border-pink-500/30"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-pink-400 font-display font-bold">
                          {faculty.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-sans text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                          {faculty.name}
                        </h4>
                        <p className="font-mono text-xs text-gray-400">
                          {faculty.whatsappNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-400 group-hover:text-pink-400">
                      <span className="font-mono text-xs hidden sm:inline">UNLOCK</span>
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center font-mono text-xs text-gray-500 border border-dashed border-slate-800 rounded-xl">
                  NO FACULTY RECORDS FOUND MATCHING "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {portalStage === 'locker' && selectedFaculty && (
        <InvitationLocker
          faculty={selectedFaculty}
          onUnlocked={handleUnlocked}
          onBack={() => setPortalStage('selector')}
        />
      )}

      {portalStage === 'intro_video' && (
        <FullscreenIntroVideo onComplete={handleIntroVideoComplete} />
      )}

      {portalStage === 'animation' && (
        <UnlockAnimation onComplete={handleAnimationComplete} />
      )}

      {portalStage === 'invitation' && selectedFaculty && (
        <InvitationCard
          faculty={selectedFaculty}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onBack={() => setPortalStage('selector')}
          onShowToast={onShowToast}
        />
      )}

      {selectedFaculty && (
        <WhatsAppShareModal
          isOpen={isShareModalOpen}
          faculty={selectedFaculty}
          onClose={() => setIsShareModalOpen(false)}
          onStatusUpdated={onRefreshData}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
