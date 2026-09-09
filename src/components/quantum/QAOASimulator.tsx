'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QAOARunMetrics } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Atom, Cpu, Sparkles, CheckCircle2, TrendingDown, Info, Settings2, Server } from 'lucide-react';
import { IBMQuantumSettingsModal } from './IBMQuantumSettingsModal';

interface QAOASimulatorProps {
  metrics: QAOARunMetrics;
  isOptimizing: boolean;
  onRunOptimization: () => void;
  ibmToken?: string;
  backendName?: string;
  shots?: number;
  onUpdateIbmConfig?: (token: string, backend: string, shots: number) => void;
  lastJobDetails?: any;
}

export const QAOASimulator: React.FC<QAOASimulatorProps> = ({
  metrics,
  isOptimizing,
  onRunOptimization,
  ibmToken = '',
  backendName = 'ibm_brisbane',
  shots = 2048,
  onUpdateIbmConfig,
  lastJobDetails,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Card glow className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>
            <Atom className="w-4 h-4 text-cyan-400" />
            <span>Quantum Optimization Engine (QAOA)</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-200/80 hover:bg-surface-300 border border-border text-[11px] text-purple-300 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>IBM Qiskit Config</span>
            </button>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {ibmToken ? 'IBM QPU Ready' : 'QAOA Circuit Active'}
            </span>
          </div>
        </CardHeader>

        {/* Backend Info Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 border border-border text-xs mb-3 font-mono">
          <div className="flex items-center gap-2 text-text-secondary">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span>Target Backend:</span>
            <b className="text-white">{backendName}</b>
          </div>
          <span className="text-cyan-300 text-[11px]">{shots} Shots / p=3</span>
        </div>

        {/* Big Score Gauge */}
        <div className="text-center py-4 my-2 rounded-2xl bg-surface-50 border border-border">
          <motion.div
            key={metrics.solutionQualityPct}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 font-mono tracking-tight"
          >
            {metrics.solutionQualityPct}%
          </motion.div>
          <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-widest">
            Solution Feasibility Quality
          </p>

          {/* Progress Bar */}
          <div className="w-3/4 mx-auto mt-4 h-2.5 bg-surface-200 rounded-full overflow-hidden p-0.5 border border-border/80">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-glow"
              animate={{ width: `${metrics.solutionQualityPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-surface-50 border border-border">
            <span className="text-text-muted block text-[9px] uppercase">Qubits Represented</span>
            <b className="text-cyan-300 text-sm">{metrics.qubitsRepresented} Qubits</b>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-50 border border-border">
            <span className="text-text-muted block text-[9px] uppercase">Feasible Assignments</span>
            <b className="text-emerald-300 text-sm">{metrics.feasibleAssignments} Permutations</b>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-50 border border-border">
            <span className="text-text-muted block text-[9px] uppercase">Iterations</span>
            <b className="text-purple-300 text-sm">{metrics.iterations} Runs</b>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-50 border border-border">
            <span className="text-text-muted block text-[9px] uppercase">Best Objective Cost</span>
            <b className="text-amber-300 text-sm">{metrics.bestObjective}</b>
          </div>
        </div>

        {lastJobDetails?.circuitDepth && (
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono p-2.5 rounded-xl bg-surface-50/70 border border-border mb-3">
            <div>
              <span className="text-text-muted block text-[9px]">Circuit Depth</span>
              <b className="text-cyan-300">{lastJobDetails.circuitDepth} Gates</b>
            </div>
            <div>
              <span className="text-text-muted block text-[9px]">CNOT/CZ Couplings</span>
              <b className="text-purple-300">{lastJobDetails.cnotCount || 96} Gates</b>
            </div>
            <div>
              <span className="text-text-muted block text-[9px]">Execution ID</span>
              <b className="text-slate-200 truncate block">{lastJobDetails.jobId?.substring(0, 12)}...</b>
            </div>
          </div>
        )}
      </div>

      {/* Button & Disclaimers */}
      <div className="space-y-3 pt-2">
        <Button
          variant="quantum"
          size="lg"
          onClick={onRunOptimization}
          isLoading={isOptimizing}
          className="w-full text-sm font-bold shadow-glow-purple"
        >
          <Atom className="w-4 h-4" />
          <span>{isOptimizing ? 'Executing QAOA Circuit on Backend...' : 'Run QAOA Optimization'}</span>
        </Button>

        {/* Disclaimer Box */}
        <div className="p-3 rounded-xl bg-surface-50/80 border border-border text-[11px] text-text-muted flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Quantum Infrastructure:</span>{' '}
            {ibmToken
              ? `Connected to IBM Quantum Runtime (${backendName}). Dispatches variational Ising Hamiltonian parameter circuits.`
              : 'Running on high-performance classical QAOA variational emulator. Click "IBM Qiskit Config" to connect live IBM Quantum Eagle 127Q hardware.'}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <IBMQuantumSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          ibmToken={ibmToken}
          backendName={backendName}
          shots={shots}
          onSave={(token, backend, s) => {
            if (onUpdateIbmConfig) onUpdateIbmConfig(token, backend, s);
          }}
        />
      )}
    </Card>
  );
};
