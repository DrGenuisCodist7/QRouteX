'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Atom, Key, Server, Cpu, CheckCircle2, Shield, ExternalLink } from 'lucide-react';

interface IBMQuantumSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ibmToken: string;
  backendName: string;
  shots: number;
  onSave: (token: string, backend: string, shots: number) => void;
}

export const IBMQuantumSettingsModal: React.FC<IBMQuantumSettingsModalProps> = ({
  isOpen,
  onClose,
  ibmToken: initialToken,
  backendName: initialBackend,
  shots: initialShots,
  onSave,
}) => {
  const [token, setToken] = useState(initialToken);
  const [backend, setBackend] = useState(initialBackend);
  const [shotsCount, setShotsCount] = useState(initialShots);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(token, backend, shotsCount);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <span className="flex items-center gap-2 text-purple-400">
          <Atom className="w-5 h-5" />
          IBM Quantum Platform & Qiskit Integration
        </span>
      }
      subtitle="Connect live IBM Quantum processors (QPUs) to execute QAOA routing Hamiltonians."
    >
      <form onSubmit={handleSave} className="space-y-4 pt-2 font-sans text-xs">
        {/* Token Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-slate-300 font-medium">IBM Quantum API Token</label>
            <a
              href="https://quantum.ibm.com/account"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              Get IBM Token <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="relative">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste IBM Quantum API Token (e.g. 64-character hex)"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-50 border border-border text-slate-100 font-mono text-xs focus:border-purple-400 outline-none"
            />
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            Your token is stored locally in your browser and used to authenticate Qiskit Runtime requests.
          </p>
        </div>

        {/* Backend Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Target QPU Processor / Backend</label>
            <select
              value={backend}
              onChange={(e) => setBackend(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 font-mono text-xs focus:border-purple-400 outline-none"
            >
              <option value="ibm_brisbane">ibm_brisbane (127 Qubits, Eagle r3)</option>
              <option value="ibm_kyoto">ibm_kyoto (127 Qubits, Eagle r3)</option>
              <option value="ibm_sherbrooke">ibm_sherbrooke (127 Qubits)</option>
              <option value="ibmq_qasm_simulator">ibmq_qasm_simulator (Cloud Simulator)</option>
              <option value="simulator_statevector">simulator_statevector (Local Statevector)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Quantum Measurement Shots</label>
            <select
              value={shotsCount}
              onChange={(e) => setShotsCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 font-mono text-xs focus:border-purple-400 outline-none"
            >
              <option value="1024">1,024 Shots (Fast Sample)</option>
              <option value="2048">2,048 Shots (Optimal Accuracy)</option>
              <option value="4096">4,096 Shots (Deep Transpiled Sample)</option>
              <option value="8192">8,192 Shots (Ultra-High Resolution)</option>
            </select>
          </div>
        </div>

        {/* Info Callout */}
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Qiskit Runtime Primitives (Sampler v2 / Estimator v2)</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            When token is configured, QRouteX automatically transpiles the vehicle routing QUBO into a 2-qubit Pauli $ZZ(\theta)$ coupling circuit and dispatches variational parameters via IBM Quantum REST endpoints.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="quantum" size="sm">
            <span>Save & Apply IBM Qiskit Backend</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
