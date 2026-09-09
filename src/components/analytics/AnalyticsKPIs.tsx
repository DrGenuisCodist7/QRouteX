'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Route, Fuel, Leaf, ShieldCheck, Award, Zap } from 'lucide-react';
import { AnalyticsSummary } from '@/types';

interface AnalyticsKPIsProps {
  data: AnalyticsSummary;
}

export const AnalyticsKPIs: React.FC<AnalyticsKPIsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <Card glow className="p-4 bg-gradient-to-b from-cyan-500/10 to-transparent">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-mono uppercase">Distance Saved</span>
          <div className="p-1.5 rounded-lg bg-surface-200 border border-border">
            <Route className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-white">{data.distanceSavedPct}%</div>
        <p className="text-[11px] text-cyan-300 mt-2 font-mono">
          vs classical static nearest-neighbor
        </p>
      </Card>

      <Card glow className="p-4 bg-gradient-to-b from-amber-500/10 to-transparent">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-mono uppercase">Fuel & OPEX Saved</span>
          <div className="p-1.5 rounded-lg bg-surface-200 border border-border">
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-white">{data.fuelSavedPct}%</div>
        <p className="text-[11px] text-amber-300 mt-2 font-mono">
          {data.fuelSavedCurrencyEstimate} (Est.)
        </p>
      </Card>

      <Card glow className="p-4 bg-gradient-to-b from-emerald-500/10 to-transparent">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-mono uppercase">CO₂ Carbon Reduced</span>
          <div className="p-1.5 rounded-lg bg-surface-200 border border-border">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-white">{data.co2ReducedPct}%</div>
        <p className="text-[11px] text-emerald-300 mt-2 font-mono">
          {data.co2SavedKg} kg emissions avoided
        </p>
      </Card>

      <Card glow className="p-4 bg-gradient-to-b from-purple-500/10 to-transparent">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-mono uppercase">Sustainability Score</span>
          <div className="p-1.5 rounded-lg bg-surface-200 border border-border">
            <Award className="w-4 h-4 text-purple-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-white">{data.sustainabilityScore} / 100</div>
        <p className="text-[11px] text-purple-300 mt-2 font-mono">
          Tier 1 ESG Corporate Compliance
        </p>
      </Card>
    </div>
  );
};
