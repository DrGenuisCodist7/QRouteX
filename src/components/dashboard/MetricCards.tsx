'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, PackageCheck, Route, Fuel, Leaf, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface MetricCardsProps {
  activeVehicles: number;
  totalVehicles: number;
  deliveriesToday: number;
  totalDistanceKm: number;
  fuelCostINR: number;
  co2SavedKg: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  activeVehicles = 12,
  totalVehicles = 15,
  deliveriesToday = 248,
  totalDistanceKm = 1284,
  fuelCostINR = 18600,
  co2SavedKg = 226,
}) => {
  const metrics = [
    {
      id: 'vehicles',
      label: 'Vehicles Active',
      value: `${activeVehicles} / ${totalVehicles}`,
      subtext: '▲ 2 available on standby',
      trend: 'up',
      icon: <Truck className="w-4 h-4 text-cyan-400" />,
      accentColor: 'from-cyan-500/20 to-transparent',
      borderColor: 'hover:border-cyan-500/40',
    },
    {
      id: 'deliveries',
      label: 'Deliveries Today',
      value: `${deliveriesToday}`,
      subtext: '91.4% on-time SLA',
      trend: 'up',
      icon: <PackageCheck className="w-4 h-4 text-emerald-400" />,
      accentColor: 'from-emerald-500/20 to-transparent',
      borderColor: 'hover:border-emerald-500/40',
    },
    {
      id: 'distance',
      label: 'Total Distance',
      value: `${totalDistanceKm.toLocaleString()} km`,
      subtext: '↓ 14.8% QAOA optimized',
      trend: 'down',
      icon: <Route className="w-4 h-4 text-blue-400" />,
      accentColor: 'from-blue-500/20 to-transparent',
      borderColor: 'hover:border-blue-500/40',
    },
    {
      id: 'fuel',
      label: 'Fuel & Energy Cost',
      value: `₹${(fuelCostINR / 1000).toFixed(1)}K`,
      subtext: '↓ 11.2% vs static routing',
      trend: 'down',
      icon: <Fuel className="w-4 h-4 text-amber-400" />,
      accentColor: 'from-amber-500/20 to-transparent',
      borderColor: 'hover:border-amber-500/40',
    },
    {
      id: 'emissions',
      label: 'CO₂ Reduced',
      value: `${co2SavedKg} kg`,
      subtext: '↓ 18.4% greener footprint',
      trend: 'down',
      icon: <Leaf className="w-4 h-4 text-emerald-400" />,
      accentColor: 'from-emerald-500/20 to-transparent',
      borderColor: 'hover:border-emerald-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
      {metrics.map((m, idx) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.06 }}
        >
          <Card
            glow
            className={`relative overflow-hidden p-4 bg-gradient-to-b ${m.accentColor} ${m.borderColor} transition-all`}
          >
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">
                {m.label}
              </span>
              <div className="p-1.5 rounded-lg bg-surface-200/80 border border-border">
                {m.icon}
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {m.value}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-300 mt-2">
              {m.trend === 'up' ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{m.subtext}</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
