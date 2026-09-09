'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const DriverStatusList: React.FC = () => {
  const drivers = [
    {
      name: 'Arjun Kumar',
      vehicle: 'V-07 (EV Van)',
      deliveries: 14,
      status: 'ON ROUTE',
      variant: 'cyan' as const,
      rating: 4.9,
    },
    {
      name: 'Rahul Sharma',
      vehicle: 'V-03 (Truck)',
      deliveries: 21,
      status: 'ON ROUTE',
      variant: 'cyan' as const,
      rating: 4.7,
    },
    {
      name: 'Priya Reddy',
      vehicle: 'V-11 (EV Van)',
      deliveries: 9,
      status: 'BREAK',
      variant: 'amber' as const,
      rating: 4.95,
    },
    {
      name: 'Vikram Singh',
      vehicle: 'V-04 (Truck)',
      deliveries: 17,
      status: 'ON ROUTE',
      variant: 'cyan' as const,
      rating: 4.8,
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Driver Status</span>
        </CardTitle>
        <span className="text-[10px] font-mono text-cyan-400">Live Roster</span>
      </CardHeader>

      <div className="space-y-2.5">
        {drivers.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50/80 border border-border/50 hover:bg-surface-200/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-200 border border-border flex items-center justify-center font-bold text-xs text-cyan-300">
                {d.name.split(' ')[0][0]}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100 leading-tight">
                  {d.name} • <span className="font-mono text-cyan-300">{d.vehicle.split(' ')[0]}</span>
                </p>
                <p className="text-[10px] text-text-muted">
                  {d.deliveries} deliveries today • ★ {d.rating}
                </p>
              </div>
            </div>

            <Badge variant={d.variant} dot size="sm">
              {d.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
