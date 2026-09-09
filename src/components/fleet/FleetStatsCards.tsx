'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Truck, Gauge, Zap, CheckCircle2 } from 'lucide-react';

interface FleetStatsCardsProps {
  total: number;
  active: number;
  idle: number;
  service: number;
  avgLoad: number;
  evCount: number;
  evPercentage: number;
}

export const FleetStatsCards: React.FC<FleetStatsCardsProps> = ({
  total = 15,
  active = 12,
  idle = 2,
  service = 1,
  avgLoad = 78,
  evCount = 5,
  evPercentage = 33,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <Card glow className="p-4 bg-gradient-to-b from-cyan-500/10 to-transparent">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-mono uppercase">Total Fleet</span>
          <div className="p-1.5 rounded-lg bg-surface-200 border border-border">
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-white">{total}</div>
        <p className="text-[11px] text-cyan-300 mt-2 font-mono">
          {active} active • {idle} idle • {service} in service
        </p>
      </Card>

      <Card glow className="p-4 bg-gradient-to-b from-blue-500/10 to-transparent">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-mono uppercase">Average Load</span>
          <div className="p-1.5 rounded-lg bg-surface-200 border border-border">
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-white">{avgLoad}%</div>
        <p className="text-[11px] text-emerald-400 mt-2 font-mono">
          Healthy payload utilization index
        </p>
      </Card>

      <Card glow className="p-4 bg-gradient-to-b from-emerald-500/10 to-transparent">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-mono uppercase">Zero-Emission EV Vehicles</span>
          <div className="p-1.5 rounded-lg bg-surface-200 border border-border">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-white">{evCount}</div>
        <p className="text-[11px] text-emerald-300 mt-2 font-mono">
          {evPercentage}% of active delivery fleet
        </p>
      </Card>
    </div>
  );
};
