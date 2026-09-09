'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3, Activity } from 'lucide-react';

interface AnalyticsChartsProps {
  data: AnalyticsSummary;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {/* Top 2 Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Cost Curve: Classical vs QAOA */}
        <Card className="h-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Logistics Cost Efficiency (Hourly)</span>
            </CardTitle>
            <span className="text-[10px] font-mono text-cyan-300">Classical vs QAOA</span>
          </CardHeader>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.hourlyEfficiency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClassical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorQuantum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27d9ff" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#27d9ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#163859" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#66849c" fontSize={10} tickLine={false} />
                <YAxis stroke="#66849c" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1d31',
                    borderColor: '#1d4264',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#f0f7ff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="classicalCost"
                  name="Classical Baseline ($)"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorClassical)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="quantumCost"
                  name="QRouteX Optimized ($)"
                  stroke="#27d9ff"
                  fillOpacity={1}
                  fill="url(#colorQuantum)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hourly Deliveries Volume */}
        <Card className="h-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Delivery Throughput Volume</span>
            </CardTitle>
            <span className="text-[10px] font-mono text-purple-300">Deliveries / Hour</span>
          </CardHeader>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hourlyEfficiency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#163859" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#66849c" fontSize={10} tickLine={false} />
                <YAxis stroke="#66849c" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1d31',
                    borderColor: '#1d4264',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#f0f7ff',
                  }}
                />
                <Bar
                  dataKey="deliveries"
                  name="Completed Deliveries"
                  fill="#a970ff"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row: Powertrain Donut & Performance SLA Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Powertrain Distribution Donut */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <span>Fleet Powertrain Distribution</span>
            </CardTitle>
            <span className="text-[10px] font-mono text-emerald-400">ESG Metrics</span>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 py-2">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.powertrainDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {data.powertrainDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#071424" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b1d31',
                      borderColor: '#1d4264',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#f0f7ff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {data.powertrainDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-surface-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-200">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.count} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Performance & SLA Summary Progress Bars */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Hybrid AI Routing Impact Summary</span>
            </CardTitle>
            <span className="text-[10px] font-mono text-cyan-300">Live KPIs</span>
          </CardHeader>

          <div className="space-y-3.5 py-1 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-text-secondary">Delivery SLA Adherence</span>
                <b className="text-white font-mono">{data.deliverySlaPct}%</b>
              </div>
              <div className="h-2 w-full bg-surface-50 rounded-full overflow-hidden p-0.5 border border-border/50">
                <div className="h-full rounded-full bg-emerald-400 shadow-glow-emerald" style={{ width: `${data.deliverySlaPct}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-text-secondary">Fleet Capacity Utilization</span>
                <b className="text-white font-mono">{data.fleetUtilizationPct}%</b>
              </div>
              <div className="h-2 w-full bg-surface-50 rounded-full overflow-hidden p-0.5 border border-border/50">
                <div className="h-full rounded-full bg-cyan-400 shadow-glow" style={{ width: `${data.fleetUtilizationPct}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-text-secondary">Dynamic Route Feasibility</span>
                <b className="text-white font-mono">{data.routeFeasibilityPct}%</b>
              </div>
              <div className="h-2 w-full bg-surface-50 rounded-full overflow-hidden p-0.5 border border-border/50">
                <div className="h-full rounded-full bg-blue-400 shadow-glow" style={{ width: `${data.routeFeasibilityPct}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-text-secondary">Sustainability Compliance Index</span>
                <b className="text-white font-mono">{data.sustainabilityScore}%</b>
              </div>
              <div className="h-2 w-full bg-surface-50 rounded-full overflow-hidden p-0.5 border border-border/50">
                <div className="h-full rounded-full bg-purple-400 shadow-glow-purple" style={{ width: `${data.sustainabilityScore}%` }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
