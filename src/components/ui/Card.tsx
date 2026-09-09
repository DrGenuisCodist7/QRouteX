'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = false,
  interactive = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-surface-100/80 backdrop-blur-md border border-border rounded-2xl p-5 shadow-glass transition-all duration-200',
        glow && 'hover:border-cyan-500/40 hover:shadow-glow',
        interactive && 'cursor-pointer hover:bg-surface-200/80 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between pb-3.5 mb-4 border-b border-border/70',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn(
        'text-base font-semibold text-slate-100 tracking-tight flex items-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};
