import React, { useState } from 'react';
import { Faculty } from '../types';
import { generateInvitationImage } from '../utils/imageGenerator';
import { updateFacultyStatus } from '../utils/db';
import { VoiceController } from './VoiceController';
import { BtcAiAssistant } from './BtcAiAssistant';
import { InvitationChatbotVideo } from './InvitationChatbotVideo';
import { Download, Share2, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface InvitationCardProps {
  faculty: Faculty;
  onOpenShareModal: () => void;
  onBack: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  faculty,
  onOpenShareModal,
  onBack,
  onShowToast,
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const handleDownloadImage = async () => {
    try {
      setIsGeneratingImage(true);
      const blob = await generateInvitationImage(faculty);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BIT-C_2K26_Invitation_${faculty.name.replace(/\s+/g, '_')}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setIsGeneratingImage(false);
      onShowToast('✓ Image Generated', 'Invitation image downloaded successfully', 'success');
    } catch (err: any) {
      setIsGeneratingImage(false);
      onShowToast('✕ Image Error', err.message, 'error');
    }
  };

  const handleDirectWhatsAppClick = async () => {
    // 1. Format & normalize phone number saved in Developer Mode
    let rawPhone = faculty.whatsappNumber ? faculty.whatsappNumber.replace(/\D/g, '') : '';
    if (rawPhone.length === 10) rawPhone = '91' + rawPhone;
    if (rawPhone.length === 11 && rawPhone.startsWith('0')) rawPhone = '91' + rawPhone.slice(1);

    if (!rawPhone || rawPhone.length < 10) {
      onShowToast(
        'WhatsApp Configuration Required',
        'WhatsApp number not configured for this faculty. Please add a valid phone number in Developer Mode.',
        'error'
      );
      onOpenShareModal();
      return;
    }

    const encodedText = encodeURIComponent(faculty.invitationMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${rawPhone}&text=${encodedText}`;

    setIsGeneratingImage(true);
    try {
      // 2. Generate Futuristic PNG Blob
      const blob = await generateInvitationImage(faculty);
      const fileName = `BIT-C_2K26_Invitation_${faculty.name.replace(/\s+/g, '_')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // 3. Mobile Web Share API: Attach futuristic image file + text directly in WhatsApp!
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        setIsGeneratingImage(false);
        await navigator.share({
          title: `B!T-C 2K26 Invitation - ${faculty.name}`,
          text: faculty.invitationMessage,
          files: [file],
        });
        updateFacultyStatus(faculty.id, 'share_prepared');
        onShowToast('✓ Shared via WhatsApp', 'WhatsApp launched with Futuristic Image + Text', 'success');
        onOpenShareModal();
        return;
      }

      // 4. Desktop Fallback: Copy futuristic image to system clipboard + download PNG
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        }
      } catch (clipErr) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.log('Image prep notice:', e);
    } finally {
      setIsGeneratingImage(false);
    }

    // 5. Open direct WhatsApp conversation for saved phone number
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    updateFacultyStatus(faculty.id, 'share_prepared');
    onShowToast(
      '✓ WhatsApp Chat Opened!',
      `Direct chat launched for ${faculty.name} (${rawPhone}). Message pre-filled & Futuristic Image copied to clipboard (press Ctrl+V to attach)!`,
      'info'
    );
    
    // Open dispatch hub modal for management
    onOpenShareModal();
  };

  const handleSpeakAi = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onShowToast('✕ Speech Unsupported', 'Voice invitation system is not supported by this browser', 'info');
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(faculty.invitationMessage);
      utterance.rate = 0.82; // Slow and clear speech rate for easy understanding
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Zira') ||
            v.name.includes('Karen') ||
            v.name.includes('Daniel'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsAiSpeaking(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-cyber-dark p-4 sm:p-6 lg:p-10 flex flex-col items-center justify-center">
      {/* Container */}
      <div className="relative max-w-3xl w-full space-y-6">
        {/* Animated Robot Chatbot Video */}
        <InvitationChatbotVideo isInvitationRevealed={true} />

        {/* Back Button & Header Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 font-mono text-xs text-gray-400 hover:text-cyan-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>BACK TO FACULTY LIST</span>
          </button>

          <span className="font-mono text-xs text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-950/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            OFFICIAL DIGITAL INVITATION
          </span>
        </div>

        {/* Main Holographic Elegant Invitation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative p-6 sm:p-10 rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0c1326] via-[#080d1a] to-[#040711] shadow-[0_0_60px_rgba(0,240,255,0.25)] text-center space-y-8 clip-corner overflow-hidden"
        >
          {/* Subtle Ambient Scanline Overlay */}
          <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-40" />

          {/* Department Header */}
          <div className="space-y-2 relative z-10">
            <p className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase">
              Department of Computer Science and Engineering
            </p>

            {/* B!T-C 2K26 Title */}
            <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-pink-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.7)] py-2">
              B!T-C 2K26
            </h1>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-pink-400 uppercase">
              EXCLUSIVE INVITATION
            </h2>
          </div>

          {/* Faculty Biometric Photo Frame */}
          <div className="relative inline-block z-10 my-4">
            <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.4)] mx-auto">
              {faculty.photo ? (
                <img
                  src={faculty.photo}
                  alt={faculty.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-cyan-400 font-display text-5xl font-black">
                  {faculty.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Holographic corner accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-pink-500" />
          </div>

          {/* Faculty Name */}
          <div className="relative z-10 space-y-1">
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {faculty.name}
            </h3>
            <p className="font-mono text-sm font-bold text-cyan-400">
              {faculty.designation || 'Faculty Member'}
            </p>
          </div>

          {/* Developer-Written Invitation Message */}
          <div className="relative z-10 p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="font-mono text-[11px] text-cyan-400 font-semibold flex items-center space-x-1">
                <span>💬 Message prepared by the developer</span>
              </span>
              <span className="font-mono text-[10px] text-gray-500">FORMAT PRESERVED</span>
            </div>

            <p className="font-sans text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-wrap">
              {faculty.invitationMessage}
            </p>
          </div>

          {/* Cute AI Assistant */}
          <div className="relative z-10 pt-2">
            <BtcAiAssistant onSpeak={handleSpeakAi} isSpeaking={isAiSpeaking} />
          </div>

          {/* Voice Controller */}
          <div className="relative z-10 flex justify-center">
            <VoiceController
              textToSpeak={faculty.invitationMessage}
              autoPlay={true}
              onSpeechStateChange={setIsAiSpeaking}
            />
          </div>

          {/* Share & Download Action Hub */}
          <div className="relative z-10 pt-6 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              <span>{isGeneratingImage ? 'GENERATING IMAGE...' : 'DOWNLOAD INVITATION IMAGE'}</span>
            </button>

            <button
              onClick={handleDirectWhatsAppClick}
              disabled={isGeneratingImage}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3.5 px-8 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-mono text-sm font-black shadow-[0_0_25px_rgba(0,255,102,0.5)] transition active:scale-95 cursor-pointer"
            >
              <Send className="h-5 w-5" />
              <span>🚀 SHARE ON WHATSAPP</span>
            </button>
          </div>

          {/* Official BIT-C Logo in Circular Frame (Centered before footer) */}
          <div className="relative z-10 flex flex-col items-center justify-center pt-2">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-400 shadow-[0_0_35px_rgba(255,215,0,0.6)] group hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-[#040711] flex items-center justify-center overflow-hidden border-2 border-amber-400/60">
                <img
                  src="/jsdRlogo.png"
                  alt="BIT-C Computer Science and Engineering Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 font-mono text-xs text-center">
            <p className="font-bold text-cyan-400 tracking-wider">B!T-C 2K26 SYSTEM</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
