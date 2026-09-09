'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MapPin, ShieldCheck, Compass } from 'lucide-react';

interface LocationPromptModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onUseDemo: () => void;
  onDismiss: () => void;
}

export const LocationPromptModal: React.FC<LocationPromptModalProps> = ({
  isOpen,
  onAllow,
  onUseDemo,
  onDismiss,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onDismiss}
      maxWidth="md"
      title={
        <span className="flex items-center gap-2 text-cyan-400">
          <Compass className="w-5 h-5" />
          Location Intelligence
        </span>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-surface-50 border border-border flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-1">
              Center Fleet Map on Your Location
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              QRouteX can use your device&apos;s current browser location to center the live operator map.
              Your precise coordinates remain strictly on your client device and are never sent or stored on any server.
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Zero Server Tracking: Real GPS is used exclusively within your browser session.</span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <Button
            variant="primary"
            onClick={onAllow}
            className="w-full flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Allow Location</span>
          </Button>

          <Button
            variant="outline"
            onClick={onUseDemo}
            className="w-full"
          >
            <span>Use Demo Location (Hyderabad)</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
