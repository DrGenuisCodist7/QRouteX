'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Shield, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoginCardProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onSuccess, onBackToLanding }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin@qroutex.ai');
  const [password, setPassword] = useState('qroutex');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cleanUser = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    if (
      (cleanUser === 'admin@qroutex.ai' || cleanUser === 'admin') &&
      cleanPass === 'qroutex'
    ) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('qroutexLoggedIn', '1');
        localStorage.setItem(
          'qroutex_auth_session',
          JSON.stringify({
            user: {
              id: 'usr_admin_01',
              name: 'Admin User',
              email: 'admin@qroutex.ai',
              role: 'Fleet Operations Administrator',
              title: 'Principal Logistics Systems Lead',
              avatar: 'A',
              region: 'Hyderabad Control Center (HQ)',
              twoFactorEnabled: true,
              activeSince: 'March 2025',
              lastLogin: 'Today, 08:15 IST',
              apiTokensCount: 3,
            },
            token: `qrx_jwt_${Date.now()}_session`,
            expiresAt: Date.now() + 86400000,
          })
        );
      }
      setTimeout(() => {
        setIsLoading(false);
        onSuccess();
      }, 450);
    } else {
      setIsLoading(false);
      setError('Invalid credentials. Use the demo credentials shown below.');
    }
  };

  const handleAutofill = (user: string, pass: string) => {
    setUsernameOrEmail(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-radial from-cyan-500/20 via-blue-700/10 to-transparent rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(39, 217, 255, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(39, 217, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-surface-100/90 backdrop-blur-2xl border border-border-highlight shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_40px_rgba(39,217,255,0.15)]"
      >
        {/* Back Button */}
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-cyan-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to parcel
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center font-black text-2xl text-slate-950 shadow-glow">
            Q
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">QRouteX</h2>
            <p className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              QUANTUM LOGISTICS OS
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-100">Welcome back</h3>
          <p className="text-xs text-text-secondary mt-1">
            Sign in to manage your intelligent delivery fleet.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email / User ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="admin@qroutex.ai"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-50 border border-border focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-50 border border-border focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-text-muted py-1">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Secure session access
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Fleet system online
            </span>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 text-center"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            <span>Sign in to dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div className="mt-6 pt-5 border-t border-border/80">
          <p className="text-[11px] text-center text-text-muted mb-2.5 flex items-center justify-center gap-1.5">
            <KeyRound className="w-3 h-3 text-cyan-400" />
            Quick Demo Autofill
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleAutofill('admin@qroutex.ai', 'qroutex')}
              className="px-3 py-1.5 rounded-lg bg-surface-200/70 hover:bg-surface-300 border border-border text-[11px] font-mono text-cyan-300 transition-colors"
            >
              admin@qroutex.ai
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('admin', 'qroutex')}
              className="px-3 py-1.5 rounded-lg bg-surface-200/70 hover:bg-surface-300 border border-border text-[11px] font-mono text-slate-300 transition-colors"
            >
              admin / qroutex
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
