'use client';

import React from 'react';
import {
  LayoutDashboard,
  Navigation,
  Truck,
  Package,
  Atom,
  BarChart3,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { NavigationPage } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: NavigationPage;
  onSelectPage: (page: NavigationPage) => void;
  onLogout: () => void;
  isOptimizing?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  onLogout,
  isOptimizing = false,
}) => {
  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'routes', label: 'Live Routes', icon: <Navigation className="w-5 h-5" /> },
    { id: 'fleet', label: 'Fleet', icon: <Truck className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-5 h-5" />, badge: '8' },
    {
      id: 'quantum',
      label: 'Quantum Optimizer',
      icon: <Atom className={cn('w-5 h-5', isOptimizing && 'animate-spin text-purple-400')} />,
      badge: 'QAOA',
    },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 shrink-0 bg-surface-50/95 backdrop-blur-xl border-r border-border flex flex-col justify-between p-4 hidden md:flex h-screen sticky top-0 z-30">
      <div>
        {/* Brand */}
        <div
          onClick={() => onSelectPage('dashboard')}
          className="flex items-center gap-3 px-3 py-3 mb-6 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center font-black text-xl text-slate-950 shadow-glow group-hover:scale-105 transition-transform">
            Q
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
              QRouteX
            </span>
            <span className="block text-[9px] font-mono tracking-widest text-text-muted uppercase">
              Quantum Logistics OS
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent text-white border border-cyan-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : 'text-text-secondary hover:text-slate-100 hover:bg-surface-200/60 border border-transparent'
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full',
                      item.id === 'quantum'
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & Logout */}
      <div className="space-y-3 pt-4 border-t border-border/80">
        {/* System Health Widget */}
        <div className="p-3 rounded-xl bg-surface-100/70 border border-border text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#37d67a] animate-pulse" />
            <span>System Operational</span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
            Classical AI + QAOA engine online
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-300/80 hover:text-rose-200 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
};
