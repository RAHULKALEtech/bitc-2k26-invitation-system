import React, { useState, useEffect } from 'react';
import { Faculty } from '../types';
import { X, Upload, Trash2, Save, User, Phone, FileText, Camera } from 'lucide-react';

interface FacultyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faculty: Faculty) => void;
  editingFaculty?: Faculty | null;
}

export const FacultyFormModal: React.FC<FacultyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingFaculty,
}) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [invitationMessage, setInvitationMessage] = useState('');
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    if (editingFaculty) {
      setName(editingFaculty.name);
      setDesignation(editingFaculty.designation || '');
      setWhatsappNumber(editingFaculty.whatsappNumber);
      setInvitationMessage(editingFaculty.invitationMessage);
      setPhoto(editingFaculty.photo || '');
    } else {
      setName('');
      setDesignation('Assistant Professor');
      setWhatsappNumber('');
      setPhoto('');
      setInvitationMessage(
        `Dear Sir/Madam,\n\nWe are delighted to invite you to the B!T-C 2K26 Department Forum.\nWe would be greatly honoured by your presence as our esteemed guest.\n\nRegards,\nDepartment of Computer Science and Engineering`
      );
    }
  }, [editingFaculty, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsappNumber.trim() || !invitationMessage.trim()) return;

    // Clean phone number format
    let cleanPhone = whatsappNumber.replace(/[^0-9+]/g, '');
    if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('91') && cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    const newFaculty: Faculty = {
      id: editingFaculty ? editingFaculty.id : `fac-${Date.now()}`,
      name: name.trim(),
      designation: designation.trim() || 'Faculty Member',
      whatsappNumber: cleanPhone,
      invitationMessage,
      photo,
      invitationStatus: editingFaculty ? editingFaculty.invitationStatus : 'remaining',
      createdAt: editingFaculty ? editingFaculty.createdAt : new Date().toISOString(),
      sentAt: editingFaculty ? editingFaculty.sentAt : undefined,
    };

    onSave(newFaculty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-cyan-500/40 bg-slate-900 shadow-[0_0_50px_rgba(0,240,255,0.2)] clip-corner">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-cyan-400 p-1"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <h3 className="font-display text-2xl font-bold text-cyan-400">
            {editingFaculty ? 'EDIT FACULTY RECORD' : 'ADD NEW FACULTY'}
          </h3>
          <p className="font-mono text-xs text-gray-400">
            Enter details & write personalized invitation message for B!T-C 2K26.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Section */}
          <div className="space-y-2">
            <label className="block font-mono text-xs font-semibold text-gray-300">
              FACULTY PHOTO
            </label>
            <div className="flex items-center space-x-4">
              {photo ? (
                <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-cyan-500/50">
                  <img src={photo} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhoto('')}
                    className="absolute top-1 right-1 bg-rose-600/90 text-white p-1 rounded-full hover:bg-rose-500"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-cyan-500/40 bg-slate-950 text-cyan-400">
                  <Camera className="h-8 w-8 opacity-60" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 font-mono text-xs cursor-pointer transition">
                  <Upload className="h-4 w-4" />
                  <span>{photo ? 'REPLACE PHOTO' : 'UPLOAD FACULTY PHOTO'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="font-mono text-[11px] text-gray-500">
                  PNG, JPG or WebP (square recommended)
                </p>
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="block font-mono text-xs font-semibold text-gray-300">
              FACULTY NAME *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. ABC XYZ"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-sans text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Designation Field */}
          <div className="space-y-2">
            <label className="block font-mono text-xs font-semibold text-gray-300">
              FACULTY DESIGNATION / ROLE *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Head of Department & Professor, Assistant Professor..."
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-sans text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <label className="block font-mono text-xs font-semibold text-gray-300">
              WHATSAPP NUMBER *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 9876543210"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Multiline Invitation Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-xs font-semibold text-gray-300">
                PERSONALIZED INVITATION MESSAGE *
              </label>
              <span className="font-mono text-[11px] text-cyan-400">Preserves Exact Line Breaks</span>
            </div>
            <textarea
              value={invitationMessage}
              onChange={(e) => setInvitationMessage(e.target.value)}
              rows={6}
              required
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-gray-200 font-sans text-sm leading-relaxed placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition"
              placeholder="Write complete personalized invitation message here..."
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-gray-300 hover:bg-slate-700 font-mono text-xs transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition"
            >
              <Save className="h-4 w-4" />
              <span>SAVE FACULTY RECORD</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
