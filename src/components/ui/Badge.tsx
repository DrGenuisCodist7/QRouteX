'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'green' | 'blue' | 'purple' | 'amber' | 'rose' | 'muted' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'sm',
  dot = false,
  className,
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    muted: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    outline: 'bg-transparent text-slate-300 border-slate-600',
  };

  const dotColors = {
    cyan: 'bg-cyan-400 shadow-[0_0_8px_#27d9ff]',
    green: 'bg-emerald-400 shadow-[0_0_8px_#37d67a]',
    blue: 'bg-blue-400 shadow-[0_0_8px_#3b82f6]',
    purple: 'bg-purple-400 shadow-[0_0_8px_#a970ff]',
    amber: 'bg-amber-400 shadow-[0_0_8px_#ffd166]',
    rose: 'bg-rose-400 shadow-[0_0_8px_#ff5d6c]',
    muted: 'bg-slate-400',
    outline: 'bg-slate-300',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border font-mono uppercase transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full inline-block shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};
