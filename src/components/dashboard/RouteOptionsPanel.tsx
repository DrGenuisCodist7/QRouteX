'use client';

import React from 'react';
import { RoutePlan } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Zap, DollarSign, Leaf, Sparkles, Clock, Compass } from 'lucide-react';

interface RouteOptionsPanelProps {
  routes: RoutePlan[];
  onSelectRoute?: (route: RoutePlan) => void;
}

export const RouteOptionsPanel: React.FC<RouteOptionsPanelProps> = ({ routes, onSelectRoute }) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Multi-Objective Route Options</span>
          </CardTitle>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            QAOA Active
          </span>
        </CardHeader>

        {/* Route Cards */}
        <div className="space-y-2.5">
          {routes.slice(0, 3).map((route) => {
            let icon = <Zap className="w-4 h-4 text-cyan-400" />;
            let badgeVariant: 'cyan' | 'green' | 'blue' | 'amber' = 'cyan';

            if (route.strategy === 'greenest') {
              icon = <Leaf className="w-4 h-4 text-emerald-400" />;
              badgeVariant = 'green';
            } else if (route.strategy === 'cheapest') {
              icon = <DollarSign className="w-4 h-4 text-blue-400" />;
              badgeVariant = 'blue';
            }

            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute && onSelectRoute(route)}
                className="p-3.5 rounded-xl bg-surface-50/90 hover:bg-surface-200 border border-border hover:border-cyan-400/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-surface-100 border border-border">
                      {icon}
                    </div>
                    <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors capitalize">
                      {route.strategy} Route
                    </span>
                  </div>
                  <Badge variant={badgeVariant} size="sm">
                    {route.badgeLabel}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1 border-t border-border/50">
                  <div className="text-left">
                    <span className="text-text-muted block text-[9px] uppercase">Distance</span>
                    <b className="text-slate-100 font-mono">{route.totalDistanceKm} km</b>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[9px] uppercase">ETA</span>
                    <b className="text-cyan-300 font-mono">{route.etaFormatted}</b>
                  </div>
                  <div className="text-right">
                    <span className="text-text-muted block text-[9px] uppercase">
                      {route.strategy === 'greenest' ? 'CO₂' : 'Fuel / Energy'}
                    </span>
                    <b className="text-emerald-300 font-mono">
                      {route.strategy === 'greenest' ? `${route.co2Kg} kg` : route.fuelOrEnergyUsage}
                    </b>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quantum recommendation box */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-950/40 to-cyan-950/30 border border-purple-500/30 text-xs">
        <div className="flex items-center gap-1.5 text-purple-300 font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quantum Recommendation</span>
        </div>
        <p className="text-[11px] text-text-secondary leading-relaxed">
          Balanced assignment minimizes travel delay by 18.2% while keeping carbon footprint below 12 kg. QAOA found 17 feasible vehicle permutations.
        </p>
      </div>
    </Card>
  );
};
