'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Atom, Cpu, CheckCircle2, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export const QUBOFormulaCard: React.FC = () => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>
            <Atom className="w-4 h-4 text-purple-400" />
            <span>QUBO Problem Formulation</span>
          </CardTitle>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">
            Ising Hamiltonian
          </span>
        </CardHeader>

        <div className="space-y-3 font-sans text-xs text-text-secondary leading-relaxed">
          <p>
            QRouteX maps the NP-hard Capacitated Vehicle Routing Problem (CVRP) with Time Windows onto a
            Quadratic Unconstrained Binary Optimization (QUBO) Hamiltonian:
          </p>

          {/* Glowing Math Formula */}
          <div className="p-4 rounded-xl bg-surface-50 border border-cyan-500/30 shadow-glow text-center my-3">
            <code className="text-base sm:text-lg font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 tracking-wider">
              C = αD + βT + γF + δL + εP + ζE
            </code>
          </div>

          {/* Parameter Variables Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-surface-50 border border-border">
              <b className="text-cyan-300">αD</b>
              <span className="text-text-muted block text-[10px]">Distance Index</span>
            </div>
            <div className="p-2 rounded-lg bg-surface-50 border border-border">
              <b className="text-blue-300">βT</b>
              <span className="text-text-muted block text-[10px]">Transit Duration</span>
            </div>
            <div className="p-2 rounded-lg bg-surface-50 border border-border">
              <b className="text-amber-300">γF</b>
              <span className="text-text-muted block text-[10px]">Fuel & Energy</span>
            </div>
            <div className="p-2 rounded-lg bg-surface-50 border border-border">
              <b className="text-rose-300">δL</b>
              <span className="text-text-muted block text-[10px]">Late SLA Penalty</span>
            </div>
            <div className="p-2 rounded-lg bg-surface-50 border border-border">
              <b className="text-purple-300">εP</b>
              <span className="text-text-muted block text-[10px]">Priority Weight</span>
            </div>
            <div className="p-2 rounded-lg bg-surface-50 border border-border">
              <b className="text-emerald-300">ζE</b>
              <span className="text-text-muted block text-[10px]">CO₂ Emissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Constraints Box */}
      <div className="mt-4 p-3 rounded-xl bg-surface-50 border border-border/80 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-100 font-bold mb-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Encoded Hard Constraints:</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-text-muted list-disc list-inside">
          <li>Vehicle payload limit (w_i ≤ C_max)</li>
          <li>Customer single-visit constraint (∑ x_ij = 1)</li>
          <li>Time window adherence (t_arr ∈ [a_i, b_i])</li>
          <li>Depot start & return loop continuity</li>
        </ul>
      </div>
    </Card>
  );
};
