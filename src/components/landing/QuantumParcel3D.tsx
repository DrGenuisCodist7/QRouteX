'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Sparkles } from 'lucide-react';

interface QuantumParcel3DProps {
  onClick: () => void;
  isOpening: boolean;
}

export const QuantumParcel3D: React.FC<QuantumParcel3DProps> = ({ onClick, isOpening }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const x = (e.clientX - centerX) / (window.innerWidth / 2);
          const y = (e.clientY - centerY) / (window.innerHeight / 2);
          setMousePos({
            x: Math.max(-1, Math.min(1, x)),
            y: Math.max(-1, Math.min(1, y)),
          });
        }
        rafRef.current = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const rotY = mousePos.x * 20;
  const rotX = -mousePos.y * 20;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none group will-change-transform"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: 1200 }}
    >
      {/* Ambient Quantum Superposition Rings */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: isOpening ? [1, 2.5] : isHovered ? [1.1, 1.15, 1.1] : [1, 1.05, 1],
          opacity: isOpening ? [0.8, 1, 0] : isHovered ? 0.9 : 0.6,
        }}
        transition={{
          rotate: { duration: 16, repeat: Infinity, ease: 'linear' },
          scale: { duration: isOpening ? 0.7 : 3, repeat: isOpening ? 0 : Infinity, ease: 'easeInOut' },
          opacity: { duration: isOpening ? 0.7 : 2 },
        }}
        className="absolute w-80 h-80 rounded-full border border-cyan-400/30 shadow-[0_0_50px_rgba(39,217,255,0.25)] pointer-events-none"
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          scale: isOpening ? [1, 3] : isHovered ? [1.15, 1.2, 1.15] : [1.05, 1.1, 1.05],
          opacity: isOpening ? [0.6, 1, 0] : 0.4,
        }}
        transition={{
          rotate: { duration: 22, repeat: Infinity, ease: 'linear' },
          scale: { duration: isOpening ? 0.7 : 4, repeat: isOpening ? 0 : Infinity, ease: 'easeInOut' },
        }}
        className="absolute w-96 h-96 rounded-full border border-dashed border-purple-500/30 pointer-events-none"
      />

      {/* 3D Parcel Box Container */}
      <motion.div
        animate={
          isOpening
            ? {
                scale: [1, 1.35, 2.8],
                y: [0, -30, -100],
                rotateX: [rotX, 0],
                rotateY: [rotY, 0],
                opacity: [1, 0.9, 0],
              }
            : {
                y: [-5, 5, -5],
              }
        }
        transition={
          isOpening
            ? { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
            : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX - 18}deg) rotateY(${rotY + 32}deg)`,
          transition: isOpening ? 'none' : 'transform 0.15s ease-out',
        }}
        className="relative w-48 h-48 sm:w-56 sm:h-56 my-8 will-change-transform"
      >
        {/* FRONT FACE */}
        <div
          style={{
            transform: 'translateZ(96px)',
            backgroundImage: 'linear-gradient(135deg, #1c2e40 0%, #102133 100%)',
          }}
          className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 shadow-2xl flex flex-col justify-between p-4 overflow-hidden backface-hidden"
        >
          {/* Glowing Quantum Tape Horizontal */}
          <div className="absolute top-1/2 left-0 right-0 h-7 -translate-y-1/2 bg-gradient-to-r from-cyan-500/30 via-cyan-400/60 to-purple-500/30 border-y border-cyan-300/60 shadow-[0_0_15px_rgba(39,217,255,0.4)] flex items-center justify-center">
            <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-100 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3 h-3 text-cyan-200" />
              QRouteX Quantum OS Sealed
            </span>
          </div>

          {/* Top Brand Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-black text-xs text-slate-950 shadow-glow">
                Q
              </div>
              <span className="text-xs font-bold text-slate-100 tracking-wider">QRouteX</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
              #QRX-96Q
            </span>
          </div>

          {/* Bottom Shipping Label */}
          <div className="z-10 bg-slate-900/90 border border-slate-700/70 rounded-lg p-2 flex items-center gap-2.5">
            <QrCode className="w-8 h-8 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white truncate">QAOA EXPRESS PARCEL</p>
              <p className="text-[8px] font-mono text-cyan-300 truncate">LAT: 17.3850 • LON: 78.4867</p>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          style={{
            transform: 'rotateY(180deg) translateZ(96px)',
            backgroundImage: 'linear-gradient(135deg, #0e1e2d 0%, #07131e 100%)',
          }}
          className="absolute inset-0 rounded-2xl border-2 border-slate-700/60 flex items-center justify-center p-4 backface-hidden"
        >
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-200 border border-cyan-500/30 mx-auto mb-2 flex items-center justify-center">
              <span className="text-cyan-400 font-mono text-lg font-bold">⚛</span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">QUBO ROUTING MATRIX</p>
            <p className="text-[8px] font-mono text-emerald-400">96 QUBITS FEASIBLE</p>
          </div>
        </div>

        {/* RIGHT FACE */}
        <div
          style={{
            transform: 'rotateY(90deg) translateZ(96px)',
            backgroundImage: 'linear-gradient(135deg, #132739 0%, #0a1926 100%)',
          }}
          className="absolute inset-0 rounded-2xl border-2 border-cyan-500/30 flex flex-col justify-between p-4 backface-hidden"
        >
          <div className="h-full border border-dashed border-cyan-500/30 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[9px] font-mono text-slate-400">SIDE TELEMETRY</span>
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-cyan-950 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-cyan-400 rounded-full shadow-glow" />
              </div>
              <p className="text-[8px] font-mono text-cyan-300">ENTANGLEMENT: 91.4%</p>
            </div>
          </div>
        </div>

        {/* LEFT FACE */}
        <div
          style={{
            transform: 'rotateY(-90deg) translateZ(96px)',
            backgroundImage: 'linear-gradient(135deg, #15293d 0%, #0b1c2b 100%)',
          }}
          className="absolute inset-0 rounded-2xl border-2 border-slate-700/60 flex items-center justify-center p-4 backface-hidden"
        >
          <div className="text-center font-mono text-slate-400 text-[10px]">
            <p className="text-cyan-400 font-bold mb-1">QRouteX</p>
            <p className="text-[8px]">ADAPTIVE LAST-MILE</p>
          </div>
        </div>

        {/* TOP FACE */}
        <div
          style={{
            transform: 'rotateX(90deg) translateZ(96px)',
            backgroundImage: 'linear-gradient(135deg, #22374d 0%, #142536 100%)',
          }}
          className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 p-4 flex items-center justify-center backface-hidden"
        >
          <div className="w-8 h-full bg-cyan-400/40 border-x border-cyan-300/60 shadow-glow flex items-center justify-center">
            <span className="text-slate-900 font-black text-xs">Q</span>
          </div>
        </div>

        {/* BOTTOM FACE */}
        <div
          style={{
            transform: 'rotateX(-90deg) translateZ(96px)',
            backgroundColor: '#050f18',
          }}
          className="absolute inset-0 rounded-2xl border border-slate-900 backface-hidden"
        />
      </motion.div>

      {/* Floating Ground Reflection */}
      <motion.div
        animate={{
          scale: isHovered ? [1.1, 1.2, 1.1] : [0.95, 1.05, 0.95],
          opacity: isHovered ? [0.5, 0.7, 0.5] : [0.3, 0.45, 0.3],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-48 h-8 rounded-full bg-cyan-400/20 blur-xl -mt-4 pointer-events-none"
      />

      {/* Subtle Button Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100/90 border border-cyan-500/40 shadow-glow group-hover:border-cyan-400 group-hover:bg-cyan-950/40 transition-all duration-200"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-xs font-semibold text-cyan-200 tracking-wide">
          Click the parcel to enter
        </span>
      </motion.div>
    </div>
  );
};
