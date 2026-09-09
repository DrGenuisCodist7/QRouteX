'use client';

import React, { useState } from 'react';
import { Vehicle } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Truck, Search, Filter, BatteryCharging, Fuel, UserCheck, Eye } from 'lucide-react';
import { VehicleDetailModal } from './VehicleDetailModal';

interface FleetMonitoringTableProps {
  vehicles: Vehicle[];
}

export const FleetMonitoringTable: React.FC<FleetMonitoringTableProps> = ({ vehicles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'ACTIVE' | 'IDLE' | 'SERVICE' | 'EV'>('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filtered = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.id.toLowerCase().includes(q) ||
      v.driver.name.toLowerCase().includes(q) ||
      v.registration.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterType === 'ALL') return true;
    if (filterType === 'EV') return v.isEV;
    if (filterType === 'ACTIVE') return v.status === 'active' || v.status === 'traffic';
    if (filterType === 'IDLE') return v.status === 'idle' || v.status === 'break';
    if (filterType === 'SERVICE') return v.status === 'service' || v.status === 'reroute';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="green" dot>Active</Badge>;
      case 'traffic':
        return <Badge variant="amber" dot>Traffic</Badge>;
      case 'break':
        return <Badge variant="muted" dot>Break</Badge>;
      case 'reroute':
        return <Badge variant="rose" dot>Re-route</Badge>;
      case 'service':
        return <Badge variant="rose">Service</Badge>;
      case 'idle':
        return <Badge variant="outline">Idle</Badge>;
      default:
        return <Badge variant="muted">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by vehicle ID, driver, reg no..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-50 border border-border text-xs text-slate-100 focus:border-cyan-400 outline-none placeholder:text-slate-600"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
          {(['ALL', 'ACTIVE', 'IDLE', 'SERVICE', 'EV'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                filterType === tab
                  ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 font-bold shadow-sm'
                  : 'bg-surface-50 border-border text-text-secondary hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Monitoring Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface-50/60 font-mono text-[11px] text-text-muted uppercase">
                <th className="py-3 px-4">Vehicle ID</th>
                <th className="py-3 px-4">Powertrain / Type</th>
                <th className="py-3 px-4">Payload Load</th>
                <th className="py-3 px-4">Energy / Battery</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className="hover:bg-surface-200/50 transition-colors font-sans text-slate-200 cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-surface-200 flex items-center justify-center text-xs">
                        {v.isEV ? '⚡' : '🚚'}
                      </span>
                      <div>
                        <span>{v.id}</span>
                        <span className="block text-[10px] font-normal text-text-muted">
                          {v.registration}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-100">{v.type}</span>
                    <span className="block text-[10px] text-text-muted">
                      {v.isEV ? 'Zero-Emission EV' : 'Internal Combustion'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-28 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span>{v.loadPercentage}%</span>
                        <span className="text-text-muted">{v.currentLoadKg} kg</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-50 rounded-full overflow-hidden border border-border/50">
                        <div
                          className={`h-full rounded-full ${
                            v.loadPercentage > 80 ? 'bg-amber-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${v.loadPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="flex items-center gap-1.5 font-bold text-slate-100">
                      {v.isEV ? (
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Fuel className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {v.energyLevelPct}%
                    </span>
                    <span className="text-[10px] text-text-muted">{v.energyType}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-100 block">{v.driver.name}</span>
                    <span className="text-[10px] text-text-muted">
                      ★ {v.driver.rating} • {v.driver.phone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(v.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVehicle(v);
                      }}
                      className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-border text-cyan-300 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
};
