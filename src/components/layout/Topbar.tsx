'use client';

import React from 'react';
import { Zap, Atom, MapPin, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NavigationPage } from '@/types';

interface TopbarProps {
  currentPage: NavigationPage;
  isRealLocation: boolean;
  onSimulateDisruption: () => void;
  onOptimizeFleet: () => void;
  onOpenProfile: () => void;
  onOpenLocationPrompt: () => void;
  isOptimizing?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentPage,
  isRealLocation,
  onSimulateDisruption,
  onOptimizeFleet,
  onOpenProfile,
  onOpenLocationPrompt,
  isOptimizing = false,
}) => {
  const titles: Record<NavigationPage, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Fleet Command Dashboard',
      subtitle: 'Adaptive last-mile delivery • Hybrid classical–quantum optimization',
    },
    routes: {
      title: 'Live Route Control Center',
      subtitle: 'Multi-objective route telematics, road congestion radar & active detours',
    },
    fleet: {
      title: 'Fleet Vehicle Monitoring',
      subtitle: 'Real-time powertrain telemetry, battery SOC, payload capacity & driver health',
    },
    orders: {
      title: 'Order Priority Queue',
      subtitle: 'Dynamic SLA allocation, urgent healthcare deliveries & customer time windows',
    },
    quantum: {
      title: 'Quantum Optimization Engine',
      subtitle: 'Combinatorial QUBO formulation & QAOA variational parameter simulation',
    },
    analytics: {
      title: 'Logistics Analytics & ESG',
      subtitle: 'Route efficiency metrics, carbon footprint reduction & fuel savings analysis',
    },
    profile: {
      title: 'Operator Profile & Security',
      subtitle: 'Administrator access credentials, quantum API keys & session settings',
    },
  };

  const currentMeta = titles[currentPage] || titles.dashboard;

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/60">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {currentMeta.title}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          {currentMeta.subtitle}
        </p>
      </div>

      {/* Action Controls & Indicators */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Real Location vs Demo Pill */}
        <button
          onClick={onOpenLocationPrompt}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100/90 hover:bg-surface-200 border border-border text-xs font-mono transition-colors"
          title="Click to configure browser location access"
        >
          <MapPin
            className={`w-3.5 h-3.5 ${
              isRealLocation ? 'text-emerald-400' : 'text-amber-400'
            }`}
          />
          <span className="text-slate-200">
            {isRealLocation ? '● LIVE GPS' : '● DEMO HQ'}
          </span>
          <span className="text-[10px] text-text-muted hidden sm:inline">
            {isRealLocation ? '(Browser)' : '(Hyderabad)'}
          </span>
        </button>

        {/* Simulate Disruption Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onSimulateDisruption}
          className="text-xs font-medium"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulate disruption</span>
        </Button>

        {/* Optimize Fleet Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOptimizeFleet}
          isLoading={isOptimizing}
          className="text-xs font-semibold"
        >
          <Atom className="w-3.5 h-3.5" />
          <span>Optimize fleet</span>
        </Button>

        {/* User Chip */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-200/90 hover:bg-surface-300 border border-border-highlight text-xs font-medium text-cyan-200 transition-colors"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-[11px] text-slate-950">
            A
          </div>
          <span className="hidden sm:inline">Admin</span>
          <span className="text-slate-400 text-[10px]">▾</span>
        </button>
      </div>
    </header>
  );
};
