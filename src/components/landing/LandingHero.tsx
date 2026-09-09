'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantumParcel3D } from './QuantumParcel3D';
import { ShieldCheck, Cpu, Zap, Activity } from 'lucide-react';

interface LandingHeroProps {
  onEnter: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnter }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 750);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-10 overflow-hidden bg-background">
      {/* Background Logistics Grid & Ambient Wavefront */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial Quantum Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-radial from-cyan-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl opacity-70" />

        {/* Perspective Grid Floor */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(39, 217, 255, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(39, 217, 255, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            transform: 'perspective(600px) rotateX(45deg) translateY(-20px)',
            transformOrigin: 'center center',
          }}
        />

        {/* Faint Glowing Route Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <motion.path
            d="M 100 200 Q 450 50 800 350 T 1400 500"
            fill="none"
            stroke="#27d9ff"
            strokeWidth="1.5"
            strokeDasharray="8 8"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M 200 700 Q 600 400 1100 650 T 1600 200"
            fill="none"
            stroke="#a970ff"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            animate={{ strokeDashoffset: [100, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </div>

      {/* Top Header Branding */}
      <header className="relative z-10 w-full max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center font-black text-xl text-slate-950 shadow-glow">
            Q
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              QRouteX
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                v1.0 OS
              </span>
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
              Quantum Logistics OS
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#37d67a]" />
            QAOA Engine Online
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Adaptive Dispatch
          </span>
        </div>
      </header>

      {/* Center 3D Interactive Showcase */}
      <main className="relative z-10 my-auto flex flex-col items-center text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-100/90 border border-border-highlight text-cyan-300 text-xs font-mono mb-4 shadow-glass"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          Hybrid Classical–Quantum Vehicle Routing Optimization
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight leading-[1.1]"
        >
          Adaptive routing.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            Smarter deliveries.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-sm sm:text-base text-text-secondary mt-3 max-w-xl leading-relaxed"
        >
          Autonomous last-mile routing powered by combinatorial QUBO formulation and dynamic road feasibility intelligence.
        </motion.p>

        {/* 3D Interactive Floating Parcel */}
        <div className="mt-4 sm:mt-6">
          <QuantumParcel3D onClick={handleClick} isOpening={isOpening} />
        </div>
      </main>

      {/* Footer System Features */}
      <footer className="relative z-10 w-full max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div className="p-3 rounded-xl bg-surface-100/60 border border-border/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-200">Real-Time Routing</span>
          </div>
          <p className="text-[11px] text-text-muted">Dynamic congestion bypass & live GPS</p>
        </div>

        <div className="p-3 rounded-xl bg-surface-100/60 border border-border/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-200">QAOA Optimization</span>
          </div>
          <p className="text-[11px] text-text-muted">QUBO multi-objective formulation</p>
        </div>

        <div className="p-3 rounded-xl bg-surface-100/60 border border-border/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-200">−18.4% Emissions</span>
          </div>
          <p className="text-[11px] text-text-muted">Greenest path & EV fleet prioritization</p>
        </div>

        <div className="p-3 rounded-xl bg-surface-100/60 border border-border/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-200">Enterprise Security</span>
          </div>
          <p className="text-[11px] text-text-muted">Zero-leak browser location privacy</p>
        </div>
      </footer>

      {/* Opening Flash Transition Wave */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="fixed inset-0 z-50 pointer-events-none bg-gradient-radial from-cyan-400/40 via-blue-600/30 to-slate-950 backdrop-blur-2xl flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-2xl bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-glow-lg"
              >
                <span className="text-2xl font-black text-cyan-300">Q</span>
              </motion.div>
              <p className="text-sm font-mono tracking-widest text-cyan-200 uppercase font-bold">
                Initializing QRouteX Command OS...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
