'use client';

import React from 'react';
import { Vehicle } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Truck, BatteryCharging, Fuel, UserCheck, Package, Clock, ShieldAlert, Sparkles } from 'lucide-react';

interface VehiclePopupProps {
  vehicle: Vehicle;
  onClose?: () => void;
}

export const VehiclePopupContent: React.FC<VehiclePopupProps> = ({ vehicle }) => {
  const getStatusBadge = () => {
    switch (vehicle.status) {
      case 'active':
        return <Badge variant="cyan" dot>ON ROUTE</Badge>;
      case 'traffic':
        return <Badge variant="amber" dot>TRAFFIC</Badge>;
      case 'break':
        return <Badge variant="muted" dot>BREAK</Badge>;
      case 'reroute':
        return <Badge variant="rose" dot>RE-ROUTE</Badge>;
      case 'service':
        return <Badge variant="rose">SERVICE</Badge>;
      case 'idle':
        return <Badge variant="outline">STANDBY</Badge>;
      default:
        return <Badge variant="muted">{vehicle.status}</Badge>;
    }
  };

  return (
    <div className="p-1 min-w-[240px] max-w-[280px] font-sans text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/80 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-surface-200 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-300">
            {vehicle.id}
          </div>
          <div>
            <span className="text-xs font-bold text-white block leading-tight">
              {vehicle.registration}
            </span>
            <span className="text-[9px] font-mono text-text-muted">
              {vehicle.type}
            </span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Driver & Orders */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between bg-surface-50/80 p-2 rounded-lg border border-border/50">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-200 font-medium">{vehicle.driver.name}</span>
          </div>
          <span className="text-[10px] font-mono text-amber-300">★ {vehicle.driver.rating}</span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="p-1.5 rounded-lg bg-surface-50/60 border border-border/40">
            <span className="text-text-muted block text-[9px] uppercase">Payload Load</span>
            <span className="font-bold text-slate-100">{vehicle.loadPercentage}%</span>
            <span className="text-[9px] text-text-muted ml-1">({vehicle.currentLoadKg} kg)</span>
          </div>

          <div className="p-1.5 rounded-lg bg-surface-50/60 border border-border/40">
            <span className="text-text-muted block text-[9px] uppercase">
              {vehicle.isEV ? 'Battery SOC' : 'Fuel Level'}
            </span>
            <span className="font-bold text-cyan-300 flex items-center gap-1">
              {vehicle.isEV ? (
                <BatteryCharging className="w-3 h-3 text-emerald-400 inline" />
              ) : (
                <Fuel className="w-3 h-3 text-amber-400 inline" />
              )}
              {vehicle.energyLevelPct}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-text-secondary border-t border-border/60">
          <span className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-slate-400" />
            {vehicle.ordersCount} deliveries
          </span>
          <span className="flex items-center gap-1 font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            ETA: {vehicle.eta}
          </span>
        </div>
      </div>
    </div>
  );
};
