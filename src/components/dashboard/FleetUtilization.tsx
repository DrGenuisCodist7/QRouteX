'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Truck, TrendingUp, CheckCircle2 } from 'lucide-react';

export const FleetUtilization: React.FC = () => {
  const metrics = [
    { label: 'Capacity Utilization', value: 78, color: 'from-cyan-400 to-blue-500' },
    { label: 'Route Efficiency', value: 86, color: 'from-blue-500 to-purple-500' },
    { label: 'On-Time Performance (SLA)', value: 91, color: 'from-emerald-400 to-cyan-400' },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <Truck className="w-4 h-4 text-cyan-400" />
          <span>Fleet Utilization</span>
        </CardTitle>
        <span className="text-[10px] font-mono text-emerald-400">12 active</span>
      </CardHeader>

      <div className="space-y-4 pt-1">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">{m.label}</span>
              <span className="font-bold text-white font-mono">{m.value}%</span>
            </div>
            <div className="h-2 w-full bg-surface-50 rounded-full overflow-hidden p-0.5 border border-border/60">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-1000 shadow-glow`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
