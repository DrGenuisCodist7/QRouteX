'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, Atom, X } from 'lucide-react';
import { ToastMessage } from '@/types';
import { cn } from '@/lib/utils';

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  const iconMap = {
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />,
    quantum: <Atom className="w-5 h-5 text-purple-400 animate-spin-slow shrink-0" />,
  };

  const borderStyles = {
    info: 'border-cyan-500/40 shadow-glow',
    success: 'border-emerald-500/40 shadow-glow-emerald',
    warning: 'border-amber-500/40 shadow-[0_0_20px_rgba(255,209,102,0.2)]',
    error: 'border-rose-500/40 shadow-[0_0_20px_rgba(255,93,108,0.25)]',
    quantum: 'border-purple-500/40 shadow-glow-purple',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-surface-100/95 backdrop-blur-xl border text-slate-100 shadow-2xl',
              borderStyles[toast.type]
            )}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-xs font-semibold text-white tracking-wide mb-0.5">
                  {toast.title}
                </p>
              )}
              <p className="text-xs text-slate-300 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
