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
} from 'lucide-react';
import { NavigationPage } from '@/types';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  currentPage: NavigationPage;
  onSelectPage: (page: NavigationPage) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onSelectPage }) => {
  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dash', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'routes', label: 'Routes', icon: <Navigation className="w-5 h-5" /> },
    { id: 'fleet', label: 'Fleet', icon: <Truck className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-5 h-5" /> },
    { id: 'quantum', label: 'QAOA', icon: <Atom className="w-5 h-5" /> },
    { id: 'analytics', label: 'Stats', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'profile', label: 'User', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-50/95 backdrop-blur-xl border-t border-border px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectPage(item.id)}
            className={cn(
              'flex flex-col items-center justify-center p-1.5 rounded-xl transition-all',
              isActive ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {item.icon}
            <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
