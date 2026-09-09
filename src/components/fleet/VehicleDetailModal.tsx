'use client';

import React from 'react';
import { Vehicle } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Truck,
  BatteryCharging,
  Fuel,
  UserCheck,
  Package,
  Activity,
  Gauge,
  Navigation,
  CheckCircle2,
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-200 border border-cyan-500/40 flex items-center justify-center font-black text-cyan-300">
            {vehicle.id}
          </div>
          <div>
            <span className="text-base font-bold text-white block">
              Vehicle Telemetry: {vehicle.registration}
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              {vehicle.type} • Status: {vehicle.status.toUpperCase()}
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-4 font-sans">
        {/* Top KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-surface-50 border border-border">
            <span className="text-[10px] font-mono uppercase text-text-muted block">
              {vehicle.isEV ? 'Battery SOC' : 'Fuel Level'}
            </span>
            <div className="text-xl font-black text-cyan-300 flex items-center gap-1.5 mt-1 font-mono">
              {vehicle.isEV ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
              ) : (
                <Fuel className="w-4 h-4 text-amber-400" />
              )}
              {vehicle.energyLevelPct}%
            </div>
            <span className="text-[10px] text-text-muted">{vehicle.energyType}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-50 border border-border">
            <span className="text-[10px] font-mono uppercase text-text-muted block">
              Payload Capacity
            </span>
            <div className="text-xl font-black text-white mt-1 font-mono">
              {vehicle.loadPercentage}%
            </div>
            <span className="text-[10px] text-text-muted">
              {vehicle.currentLoadKg} / {vehicle.maxCapacityKg} kg
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-50 border border-border">
            <span className="text-[10px] font-mono uppercase text-text-muted block">
              Assigned Orders
            </span>
            <div className="text-xl font-black text-purple-300 mt-1 font-mono">
              {vehicle.ordersCount}
            </div>
            <span className="text-[10px] text-text-muted">Active in Queue</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-50 border border-border">
            <span className="text-[10px] font-mono uppercase text-text-muted block">
              Hardware Health
            </span>
            <div className="text-xl font-black text-emerald-400 mt-1 font-mono">
              {vehicle.healthScorePct}%
            </div>
            <span className="text-[10px] text-text-muted">Diagnostic Index</span>
          </div>
        </div>

        {/* Driver Card & Route info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-surface-50 border border-border">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                Driver Profile
              </span>
              <span className="text-xs font-mono text-amber-300">★ {vehicle.driver.rating}</span>
            </div>
            <div className="space-y-1.5 text-xs text-text-secondary">
              <p>Name: <b className="text-white">{vehicle.driver.name}</b></p>
              <p>Emergency Contact: <b className="text-white font-mono">{vehicle.driver.phone}</b></p>
              <p>Completed Deliveries Today: <b className="text-emerald-400 font-mono">{vehicle.driver.deliveriesCompletedToday}</b></p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-50 border border-border">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-purple-400" />
                Live Telematics
              </span>
              <span className="text-xs font-mono text-cyan-300">{vehicle.speedKmh} km/h</span>
            </div>
            <div className="space-y-1.5 text-xs text-text-secondary">
              <p>Current Transit Speed: <b className="text-white font-mono">{vehicle.speedKmh} km/h</b></p>
              <p>Target Stop ETA: <b className="text-cyan-300 font-mono">{vehicle.eta}</b></p>
              <p>Carbon Index: <b className="text-emerald-400 font-mono">{vehicle.co2PerKmGrams} g/km CO₂</b></p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose} size="sm">
            Close Inspector
          </Button>
        </div>
      </div>
    </Modal>
  );
};
