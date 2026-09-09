'use client';

import React, { useState } from 'react';
import { RoutePlan } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RefreshCw, Navigation, AlertTriangle, ShieldCheck, Search, Filter } from 'lucide-react';

interface LiveRoutesTableProps {
  routes: RoutePlan[];
  onRerouteAffected: () => void;
  isRerouting?: boolean;
}

export const LiveRoutesTable: React.FC<LiveRoutesTableProps> = ({
  routes,
  onRerouteAffected,
  isRerouting = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const filteredRoutes = routes.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicleId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk =
      riskFilter === 'ALL' || r.riskLevel.toUpperCase() === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (risk: string) => {
    if (risk === 'High') {
      return <Badge variant="rose" dot>High Risk</Badge>;
    }
    if (risk === 'Medium') {
      return <Badge variant="amber" dot>Medium</Badge>;
    }
    return <Badge variant="green" dot>Low Risk</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Re-route') {
      return <Badge variant="rose">🔴 Re-route</Badge>;
    }
    if (status === 'Traffic') {
      return <Badge variant="amber">🟡 Traffic</Badge>;
    }
    if (status === 'Optimized') {
      return <Badge variant="purple">⚛ Optimized</Badge>;
    }
    return <Badge variant="green">🟢 Active</Badge>;
  };

  const hasHighRisk = routes.some((r) => r.riskLevel === 'High' || r.status === 'Re-route');

  return (
    <div className="space-y-4">
      {/* Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-100/90 border border-border shadow-glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Live Route Control Center</h3>
            <p className="text-xs text-text-secondary">
              Real-time route feasibility monitoring and automated QAOA bypass execution.
            </p>
          </div>
        </div>

        <Button
          variant={hasHighRisk ? 'primary' : 'secondary'}
          size="md"
          onClick={onRerouteAffected}
          isLoading={isRerouting}
          className="shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-route affected vehicles</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by vehicle ID or route..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-50 border border-border text-xs text-slate-100 focus:border-cyan-400 outline-none placeholder:text-slate-600"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
          <span className="text-text-muted text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Risk:
          </span>
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                riskFilter === lvl
                  ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 font-bold'
                  : 'bg-surface-50 border-border text-text-secondary hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Routes Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface-50/60 font-mono text-[11px] text-text-muted uppercase">
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Route Path & Transit Corridor</th>
                <th className="py-3 px-4 text-center">Stops</th>
                <th className="py-3 px-4">Distance / Energy</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredRoutes.map((route) => (
                <tr
                  key={route.id}
                  className="hover:bg-surface-200/50 transition-colors font-sans text-slate-200"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                    {route.vehicleId}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-100">{route.name}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{route.description}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    {route.stopsCount}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="text-white block">{route.totalDistanceKm} km</span>
                    <span className="text-text-muted text-[10px]">{route.fuelOrEnergyUsage}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-200">
                    {route.etaFormatted}
                  </td>
                  <td className="py-3.5 px-4">
                    {getRiskBadge(route.riskLevel)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(route.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
