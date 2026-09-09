'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  ShieldCheck,
  MapPin,
  Mail,
  Key,
  Edit3,
  LogOut,
  Lock,
  Sparkles,
  Server,
} from 'lucide-react';

interface ProfileOverviewProps {
  user: UserProfile;
  onLogout: () => void;
  onEditProfile: () => void;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  user,
  onLogout,
  onEditProfile,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-sans">
      {/* Main Profile Card (Left 2 cols) */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-0 overflow-hidden relative">
          {/* Cover Art */}
          <div className="h-32 bg-gradient-to-r from-cyan-600/30 via-blue-700/30 to-purple-800/30 relative border-b border-border/70 overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(39, 217, 255, 0.4) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(39, 217, 255, 0.4) 1px, transparent 1px)
                `,
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          {/* User Info Bar */}
          <div className="px-6 pb-6 pt-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 border-4 border-surface-100 flex items-center justify-center font-black text-3xl text-slate-950 shadow-2xl shrink-0">
                {user.avatar || 'A'}
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <Badge variant="green" dot size="sm">Online</Badge>
                </div>
                <p className="text-xs text-cyan-300 font-mono">{user.role}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{user.title}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={onEditProfile} className="self-start sm:self-auto text-xs">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit profile</span>
            </Button>
          </div>

          {/* Operational Metrics Sub-row */}
          <div className="grid grid-cols-3 divide-x divide-border/60 border-t border-border/80 bg-surface-50/70 p-4 text-center">
            <div>
              <span className="text-2xl font-black text-white font-mono">15</span>
              <span className="block text-[10px] text-text-muted uppercase">Fleet Vehicles</span>
            </div>
            <div>
              <span className="text-2xl font-black text-cyan-300 font-mono">248</span>
              <span className="block text-[10px] text-text-muted uppercase">Today&apos;s Orders</span>
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-400 font-mono">91.4%</span>
              <span className="block text-[10px] text-text-muted uppercase">On-Time SLA Rate</span>
            </div>
          </div>
        </Card>

        {/* Account Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle>
              <User className="w-4 h-4 text-cyan-400" />
              <span>Account Credentials & Operations Scope</span>
            </CardTitle>
            <span className="text-[10px] font-mono text-cyan-300">Level 4 Admin</span>
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 border border-border/50">
              <span className="text-text-muted flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" /> Full Operator Name
              </span>
              <b className="text-white">{user.name}</b>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 border border-border/50">
              <span className="text-text-muted flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Authorized Email
              </span>
              <b className="text-cyan-300 font-mono">{user.email}</b>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 border border-border/50">
              <span className="text-text-muted flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Operating Control Region
              </span>
              <b className="text-white">{user.region}</b>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 border border-border/50">
              <span className="text-text-muted flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 2FA Hardware Protection
              </span>
              <span className="font-mono text-emerald-400 font-bold">Enabled & Verified</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column: Session & Security Actions */}
      <div className="space-y-4">
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>
                <Lock className="w-4 h-4 text-purple-400" />
                <span>Session & Security</span>
              </CardTitle>
              <span className="text-[10px] font-mono text-emerald-400">Active</span>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-50 border border-border flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-white block">Secure Dashboard Session</b>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Your QRouteX control center session token is active and encrypted client-side.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-50 border border-border flex items-start gap-2.5">
                <Server className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-white block">Quantum Cloud Integration</b>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Ready for IBM Quantum / AWS Braket REST API keys.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/80 space-y-2">
            <Button
              variant="danger"
              size="md"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out of session</span>
            </Button>
            <p className="text-[10px] text-center text-text-muted leading-tight">
              Logging out returns you to the secure 3D entry portal.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
