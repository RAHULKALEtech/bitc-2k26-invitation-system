import React from 'react';
import { Faculty } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  faculty: Faculty | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  faculty,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !faculty) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-6 rounded-2xl border border-rose-500/40 bg-slate-900 shadow-[0_0_40px_rgba(255,0,127,0.3)] clip-corner">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-rose-400">
              DELETE FACULTY?
            </h3>
            <p className="font-mono text-xs text-gray-300 mt-2">
              Are you sure you want to permanently remove:
            </p>
            <p className="font-sans text-base font-bold text-white mt-1 underline decoration-rose-500/50">
              {faculty.name}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-gray-300 font-mono text-xs hover:bg-slate-700"
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(255,0,127,0.4)]"
            >
              <Trash2 className="h-4 w-4" />
              <span>PERMANENTLY DELETE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
