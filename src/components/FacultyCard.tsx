import React from 'react';
import { Faculty } from '../types';
import { User, Phone, Calendar, Clock, Edit2, Trash2, Eye, CheckCircle2, AlertCircle, Share2 } from 'lucide-react';

interface FacultyCardProps {
  faculty: Faculty;
  onEdit: (faculty: Faculty) => void;
  onDelete: (faculty: Faculty) => void;
  onPreview: (faculty: Faculty) => void;
}

export const FacultyCard: React.FC<FacultyCardProps> = ({
  faculty,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const getStatusBadge = () => {
    switch (faculty.invitationStatus) {
      case 'sent':
        return (
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-mono text-xs shadow-[0_0_10px_rgba(0,255,102,0.2)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>SENT</span>
          </div>
        );
      case 'share_prepared':
        return (
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-500/50 text-sky-400 font-mono text-xs shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <Share2 className="h-3.5 w-3.5" />
            <span>SHARE PREPARED</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-400 font-mono text-xs">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>REMAINING</span>
          </div>
        );
    }
  };

  return (
    <div className="relative group flex flex-col justify-between p-5 rounded-xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-md hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all clip-corner">
      {/* Top Section: Photo & Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {faculty.photo ? (
              <img
                src={faculty.photo}
                alt={faculty.name}
                className="h-14 w-14 rounded-xl object-cover border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 border border-cyan-500/30 text-cyan-400 font-display text-xl font-bold">
                {faculty.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-sans text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {faculty.name}
              </h4>
              {faculty.designation && (
                <p className="font-mono text-xs text-cyan-400 font-semibold">
                  {faculty.designation}
                </p>
              )}
              <div className="flex items-center space-x-1 font-mono text-xs text-gray-400 mt-1">
                <Phone className="h-3 w-3 text-cyan-400" />
                <span>{faculty.whatsappNumber}</span>
              </div>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Message Snippet */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <p className="font-mono text-xs text-gray-400 line-clamp-3 whitespace-pre-wrap">
            {faculty.invitationMessage}
          </p>
        </div>

        {/* Date Timestamps */}
        <div className="flex items-center justify-between font-mono text-[11px] text-gray-500">
          <span className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Added: {new Date(faculty.createdAt).toLocaleDateString()}</span>
          </span>
          {faculty.sentAt && (
            <span className="flex items-center space-x-1 text-emerald-400">
              <Clock className="h-3 w-3" />
              <span>Sent: {new Date(faculty.sentAt).toLocaleDateString()}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2">
        <button
          onClick={() => onPreview(faculty)}
          className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 font-mono text-xs transition"
          title="Preview Invitation"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>VIEW</span>
        </button>

        <button
          onClick={() => onEdit(faculty)}
          className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded bg-slate-800/80 border border-slate-700 text-gray-200 hover:bg-slate-700 font-mono text-xs transition"
          title="Edit Details"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>EDIT</span>
        </button>

        <button
          onClick={() => onDelete(faculty)}
          className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 font-mono text-xs transition"
          title="Delete Faculty"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>DEL</span>
        </button>
      </div>
    </div>
  );
};
