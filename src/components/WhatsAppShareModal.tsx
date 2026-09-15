import React, { useState } from 'react';
import { Faculty } from '../types';
import { generateInvitationImage } from '../utils/imageGenerator';
import { updateFacultyStatus } from '../utils/db';
import { 
  X, Share2, Download, ExternalLink, Copy, Check, MessageSquare, 
  CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  faculty: Faculty;
  onClose: () => void;
  onStatusUpdated: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  faculty,
  onClose,
  onStatusUpdated,
  onShowToast,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [prepared, setPrepared] = useState(faculty.invitationStatus !== 'remaining');

  if (!isOpen) return null;

  // Format WhatsApp deep link URL
  const getWhatsAppUrl = () => {
    let phone = faculty.whatsappNumber.replace(/[^0-9]/g, '');
    if (!phone.startsWith('91') && phone.length === 10) {
      phone = '91' + phone;
    }
    const encodedText = encodeURIComponent(faculty.invitationMessage);
    return `https://web.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
  };

  // Download Invitation Image
  const handleDownloadImage = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateInvitationImage(faculty);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BIT-C_2K26_Invitation_${faculty.name.replace(/\s+/g, '_')}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setIsGenerating(false);
      onShowToast('✓ Image Generated & Downloaded', 'Invitation image saved to your downloads', 'success');
    } catch (err: any) {
      setIsGenerating(false);
      onShowToast('⚠ Image Error', err.message, 'error');
    }
  };

  // Open WhatsApp Web
  const handleOpenWhatsApp = () => {
    window.open(getWhatsAppUrl(), '_blank');
    setPrepared(true);
    updateFacultyStatus(faculty.id, 'share_prepared');
    onStatusUpdated();
    onShowToast('✓ WhatsApp Web Opened', 'Targeted chat opened with pre-filled message', 'info');
  };

  // Copy Message to clipboard
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(faculty.invitationMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('✓ Copied', 'Developer message copied to clipboard', 'info');
  };

  // Web Share API Native Sharing (Mobile/Tablet)
  const handleNativeShare = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateInvitationImage(faculty);
      const file = new File([blob], `Invitation_${faculty.name}.png`, { type: 'image/png' });
      setIsGenerating(false);

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `B!T-C 2K26 Invitation - ${faculty.name}`,
          text: faculty.invitationMessage,
          files: [file],
        });
        setPrepared(true);
        updateFacultyStatus(faculty.id, 'share_prepared');
        onStatusUpdated();
      } else {
        // Fall back to desktop WhatsApp Web
        handleOpenWhatsApp();
      }
    } catch (err: any) {
      setIsGenerating(false);
      handleOpenWhatsApp();
    }
  };

  // Explicit Mark As Sent confirmation
  const handleMarkAsSent = async () => {
    await updateFacultyStatus(faculty.id, 'sent');
    onStatusUpdated();
    onShowToast('✓ Marked as Sent', `${faculty.name}'s invitation marked as SENT`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-emerald-500/40 bg-slate-900 shadow-[0_0_50px_rgba(0,255,102,0.2)] clip-corner space-y-6">
        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
            <h3 className="font-display text-2xl font-bold text-emerald-400">
              WHATSAPP DISPATCH HUB
            </h3>
          </div>
          <p className="font-mono text-xs text-gray-400">
            DISPATCHING TO: <span className="text-white font-bold">{faculty.name}</span> ({faculty.whatsappNumber})
          </p>
        </div>

        {/* Status Indicator */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="font-mono text-xs text-gray-400">CURRENT STATUS:</span>
          {faculty.invitationStatus === 'sent' ? (
            <span className="flex items-center space-x-1 font-mono text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>🟢 INVITATION SENT</span>
            </span>
          ) : prepared ? (
            <span className="flex items-center space-x-1 font-mono text-xs text-sky-400 font-bold">
              <Share2 className="h-4 w-4" />
              <span>🔵 SHARE PREPARED</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 font-mono text-xs text-amber-400 font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>🟡 INVITATION REMAINING</span>
            </span>
          )}
        </div>

        {/* Desktop Instruction Fallback Panel */}
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2 font-mono text-xs text-cyan-200">
          <p className="font-bold flex items-center space-x-1">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>DESKTOP / WHATSAPP DISPATCH STEPS:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-gray-300">
            <li>Generate & download the official invitation PNG image.</li>
            <li>Click <strong>OPEN WHATSAPP WEB</strong> to launch faculty chat with message pre-filled.</li>
            <li>Attach downloaded image and click WhatsApp's <strong>SEND</strong> button.</li>
            <li>Click <strong>✓ MARK AS SENT</strong> below to record sent status!</li>
          </ol>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-1.5 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold transition"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>{isGenerating ? 'BUILDING...' : 'DOWNLOAD PNG'}</span>
          </button>

          <button
            onClick={handleCopyMessage}
            className="flex items-center justify-center space-x-1.5 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 font-mono text-xs font-semibold transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
            <span>{copied ? 'COPIED!' : 'COPY MESSAGE'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center space-x-1.5 py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,255,102,0.4)] transition"
          >
            <ExternalLink className="h-4 w-4" />
            <span>OPEN WHATSAPP</span>
          </button>
        </div>

        {/* Explicit Mark as Sent Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-gray-400">
            Did you dispatch the invitation on WhatsApp?
          </p>
          <button
            onClick={handleMarkAsSent}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,255,102,0.5)] transition"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>✓ MARK AS SENT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
