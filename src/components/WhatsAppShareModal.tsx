import React, { useState } from 'react';
import { Faculty } from '../types';
import { generateInvitationImage } from '../utils/imageGenerator';
import { updateFacultyStatus } from '../utils/db';
import { 
  X, Share2, Download, ExternalLink, Copy, Check, MessageSquare, 
  CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon, Send
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

  // Validate and normalize Indian / International WhatsApp number
  const getNormalizedPhone = (rawPhone: string | undefined): string | null => {
    if (!rawPhone || !rawPhone.trim()) return null;
    const digits = rawPhone.replace(/\D/g, '');
    
    // 10-digit Indian mobile number -> prepend '91'
    if (digits.length === 10) {
      return `91${digits}`;
    }
    // 11-digit starting with '0' -> replace '0' with '91'
    if (digits.length === 11 && digits.startsWith('0')) {
      return `91${digits.slice(1)}`;
    }
    // 12-digit starting with '91'
    if (digits.length === 12 && digits.startsWith('91')) {
      return digits;
    }
    // General valid international format (10-15 digits)
    if (digits.length >= 10 && digits.length <= 15) {
      return digits;
    }
    return null;
  };

  // Format direct WhatsApp launch API link
  const getWhatsAppUrl = (): string | null => {
    const phone = getNormalizedPhone(faculty.whatsappNumber);
    if (!phone) return null;
    const encodedText = encodeURIComponent(faculty.invitationMessage);
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
  };

  // Automated 1-Click WhatsApp Share (Phone search + Pre-filled text + Image copied to Clipboard)
  const handleInstantWhatsAppShare = async () => {
    const normalizedPhone = getNormalizedPhone(faculty.whatsappNumber);
    if (!normalizedPhone) {
      onShowToast(
        'WhatsApp Configuration Error',
        'WhatsApp number not configured for this faculty. Please add it in Developer Mode.',
        'error'
      );
      return;
    }

    const encodedText = encodeURIComponent(faculty.invitationMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${normalizedPhone}&text=${encodedText}`;

    setIsGenerating(true);
    try {
      // Generate Futuristic PNG Image Blob
      const blob = await generateInvitationImage(faculty);
      const fileName = `BIT-C_2K26_Invitation_${faculty.name.replace(/\s+/g, '_')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Automatically copy image to Clipboard for instant Paste inside WhatsApp
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        }
      } catch (clipErr) {
        // Fallback: auto download image file
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }

      // Check Mobile Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        setIsGenerating(false);
        await navigator.share({
          title: `B!T-C 2K26 Invitation - ${faculty.name}`,
          text: faculty.invitationMessage,
          files: [file],
        });
        setPrepared(true);
        updateFacultyStatus(faculty.id, 'share_prepared');
        onStatusUpdated();
        onShowToast('✓ WhatsApp Launched', 'Shared image + text via WhatsApp', 'success');
        return;
      }
    } catch (err) {
      console.warn('Image auto-copy notice:', err);
    } finally {
      setIsGenerating(false);
    }

    // Launch WhatsApp directly targeting the recipient's phone number with text prefilled
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setPrepared(true);
    updateFacultyStatus(faculty.id, 'share_prepared');
    onStatusUpdated();
    onShowToast(
      '✓ WhatsApp Chat Launched!',
      `Direct chat opened for ${faculty.name} (${normalizedPhone}). Message pre-filled & Futuristic Image copied to clipboard (Press Ctrl+V or Paste)!`,
      'info'
    );
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
      onShowToast('✓ Image Downloaded', 'Futuristic invitation image saved to downloads', 'success');
    } catch (err: any) {
      setIsGenerating(false);
      onShowToast('✕ Image Error', err.message, 'error');
    }
  };

  // Copy Message to clipboard
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(faculty.invitationMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('✓ Copied', 'Developer message copied to clipboard', 'info');
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
            DISPATCHING TO: <span className="text-white font-bold">{faculty.name}</span> ({faculty.whatsappNumber || 'No number configured'})
          </p>
        </div>

        {/* Status Indicator */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="font-mono text-xs text-gray-400">CURRENT STATUS:</span>
          {faculty.invitationStatus === 'sent' ? (
            <span className="flex items-center space-x-1 font-mono text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>✓ INVITATION SENT</span>
            </span>
          ) : prepared ? (
            <span className="flex items-center space-x-1 font-mono text-xs text-sky-400 font-bold">
              <Share2 className="h-4 w-4" />
              <span>✓ SHARE PREPARED</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 font-mono text-xs text-amber-400 font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>⌛ INVITATION REMAINING</span>
            </span>
          )}
        </div>

        {/* Dispatch Step Guide */}
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2 font-mono text-xs text-cyan-200">
          <p className="font-bold flex items-center space-x-1">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>AUTOMATED 1-CLICK DISPATCH:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-gray-300">
            <li>Click <strong>🚀 SHARE ON WHATSAPP (AUTO CONTACT)</strong> below.</li>
            <li>WhatsApp opens <strong>DIRECTLY</strong> to target contact chat: <span className="text-emerald-400 font-bold">{faculty.whatsappNumber}</span>.</li>
            <li>Invitation message is <strong>PRE-FILLED</strong> automatically.</li>
            <li>Futuristic image is <strong>COPIED TO CLIPBOARD</strong> (press <strong>Ctrl+V</strong> or Paste to attach image).</li>
          </ol>
        </div>

        {/* Primary Action Button: 1-Click AUTOMATED WHATSAPP SHARE */}
        <button
          onClick={handleInstantWhatsAppShare}
          disabled={isGenerating}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-mono text-sm font-black shadow-[0_0_25px_rgba(0,255,102,0.5)] transition flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
        >
          <Send className="h-5 w-5 text-black" />
          <span>{isGenerating ? 'PREPARING DISPATCH...' : '🚀 SHARE ON WHATSAPP (AUTO CONTACT)'}</span>
        </button>

        {/* Secondary Utility Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>

        {/* Explicit Mark as Sent Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-gray-400">
            Did you dispatch the invitation on WhatsApp?
          </p>
          <button
            onClick={handleMarkAsSent}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/50 font-mono text-xs font-bold transition"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>✓ MARK AS SENT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
