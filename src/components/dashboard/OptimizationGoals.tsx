'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Target, Clock, DollarSign, Leaf, Star } from 'lucide-react';

export const OptimizationGoals: React.FC = () => {
  const goals = [
    {
      label: 'Minimize Delivery Time',
      weight: '30%',
      icon: <Clock className="w-3.5 h-3.5 text-cyan-400" />,
      bg: 'bg-cyan-950/40 border-cyan-500/30',
    },
    {
      label: 'Reduce Fuel & Energy Cost',
      weight: '20%',
      icon: <DollarSign className="w-3.5 h-3.5 text-blue-400" />,
      bg: 'bg-blue-950/40 border-blue-500/30',
    },
    {
      label: 'Reduce CO₂ Emissions',
      weight: '20%',
      icon: <Leaf className="w-3.5 h-3.5 text-emerald-400" />,
      bg: 'bg-emerald-950/40 border-emerald-500/30',
    },
    {
      label: 'Prioritize Urgent Deliveries',
      weight: '30%',
      icon: <Star className="w-3.5 h-3.5 text-purple-400" />,
      bg: 'bg-purple-950/40 border-purple-500/30',
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <Target className="w-4 h-4 text-purple-400" />
          <span>Optimization Goals</span>
        </CardTitle>
        <span className="text-[10px] font-mono text-text-muted">QUBO Weights</span>
      </CardHeader>

      <div className="space-y-2">
        {goals.map((g) => (
          <div
            key={g.label}
            className={`flex items-center justify-between p-2.5 rounded-xl border ${g.bg} text-xs`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-surface-100/80 border border-border">
                {g.icon}
              </div>
              <span className="text-slate-200 font-medium">{g.label}</span>
            </div>
            <span className="font-mono font-bold text-white bg-surface-100 px-2 py-0.5 rounded border border-border">
              {g.weight}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
