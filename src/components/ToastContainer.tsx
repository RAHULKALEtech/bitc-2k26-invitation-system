import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const getIcon = () => {
            switch (toast.type) {
              case 'success':
                return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
              case 'error':
                return <XCircle className="h-5 w-5 text-rose-400 shrink-0" />;
              case 'warning':
                return <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />;
              default:
                return <Info className="h-5 w-5 text-cyan-400 shrink-0" />;
            }
          };

          const getBorderClass = () => {
            switch (toast.type) {
              case 'success':
                return 'border-emerald-500/50 bg-slate-900/90 shadow-[0_0_20px_rgba(0,255,102,0.25)]';
              case 'error':
                return 'border-rose-500/50 bg-slate-900/90 shadow-[0_0_20px_rgba(255,0,127,0.25)]';
              case 'warning':
                return 'border-amber-500/50 bg-slate-900/90 shadow-[0_0_20px_rgba(245,158,11,0.25)]';
              default:
                return 'border-cyan-500/50 bg-slate-900/90 shadow-[0_0_20px_rgba(0,240,255,0.25)]';
            }
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md flex items-start justify-between space-x-3 clip-corner ${getBorderClass()}`}
            >
              <div className="flex items-start space-x-3">
                {getIcon()}
                <div>
                  <h5 className="font-mono text-xs font-bold text-white tracking-wide">
                    {toast.title}
                  </h5>
                  {toast.message && (
                    <p className="font-sans text-xs text-gray-300 mt-0.5">
                      {toast.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-gray-400 hover:text-white p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
