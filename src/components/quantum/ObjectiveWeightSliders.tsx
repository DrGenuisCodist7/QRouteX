'use client';

import React from 'react';
import { QuantumObjectiveWeights } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Sliders, RefreshCw } from 'lucide-react';
import { DEFAULT_QUANTUM_WEIGHTS } from '@/services/quantumService';

interface ObjectiveWeightSlidersProps {
  weights: QuantumObjectiveWeights;
  onChangeWeights: (updated: Partial<QuantumObjectiveWeights>) => void;
}

export const ObjectiveWeightSliders: React.FC<ObjectiveWeightSlidersProps> = ({
  weights,
  onChangeWeights,
}) => {
  const items = [
    {
      key: 'alphaDistance' as const,
      label: 'α — Minimize Distance',
      value: weights.alphaDistance,
      color: 'accent-cyan-400',
    },
    {
      key: 'betaTime' as const,
      label: 'β — Minimize Transit Time',
      value: weights.betaTime,
      color: 'accent-blue-400',
    },
    {
      key: 'gammaFuel' as const,
      label: 'γ — Minimize Fuel & Cost',
      value: weights.gammaFuel,
      color: 'accent-amber-400',
    },
    {
      key: 'deltaLate' as const,
      label: 'δ — SLA Tardiness Penalty',
      value: weights.deltaLate,
      color: 'accent-rose-400',
    },
    {
      key: 'epsilonPriority' as const,
      label: 'ε — Urgent Order Priority Multiplier',
      value: weights.epsilonPriority,
      color: 'accent-purple-400',
    },
    {
      key: 'zetaEmissions' as const,
      label: 'ζ — Carbon Emission Reduction',
      value: weights.zetaEmissions,
      color: 'accent-emerald-400',
    },
  ];

  const total =
    weights.alphaDistance +
    weights.betaTime +
    weights.gammaFuel +
    weights.deltaLate +
    weights.epsilonPriority +
    weights.zetaEmissions;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Interactive Weight Tuning</span>
        </CardTitle>
        <button
          onClick={() => onChangeWeights(DEFAULT_QUANTUM_WEIGHTS)}
          className="text-[10px] font-mono text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Reset Defaults
        </button>
      </CardHeader>

      <div className="space-y-4 pt-1 font-sans text-xs">
        {items.map((item) => (
          <div key={item.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 font-medium">{item.label}</span>
              <span className="font-mono font-bold text-cyan-300">{item.value}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={item.value}
              onChange={(e) =>
                onChangeWeights({ [item.key]: parseInt(e.target.value) || 0 })
              }
              className={`w-full h-1.5 bg-surface-50 rounded-lg appearance-none cursor-pointer ${item.color}`}
            />
          </div>
        ))}

        <div className="pt-2 border-t border-border/80 flex items-center justify-between text-xs font-mono">
          <span className="text-text-muted">Aggregate Objective Sum:</span>
          <span className={`font-bold ${total === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {total}% {total === 100 ? '(Normalized)' : '(Auto-normalized)'}
          </span>
        </div>
      </div>
    </Card>
  );
};
