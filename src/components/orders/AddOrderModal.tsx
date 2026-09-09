'use client';

import React, { useState } from 'react';
import { DeliveryOrder, OrderPriority, Vehicle } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PackagePlus, Clock, MapPin, Building, AlertCircle } from 'lucide-react';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onAddOrder: (order: Omit<DeliveryOrder, 'id' | 'trackingCode' | 'deadlineIso' | 'slaRisk'>) => void;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onAddOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerType, setCustomerType] = useState<DeliveryOrder['customerType']>('Hospital');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState<OrderPriority>('HIGH');
  const [timeWindow, setTimeWindow] = useState('11:00 – 13:00');
  const [assignedVehicleId, setAssignedVehicleId] = useState(vehicles[0]?.id || 'V-07');
  const [weightKg, setWeightKg] = useState('15.5');
  const [packagesCount, setPackagesCount] = useState('2');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !address) return;

    onAddOrder({
      customerName,
      customerType,
      address,
      coordinates: [17.4125 + (Math.random() - 0.5) * 0.05, 78.4380 + (Math.random() - 0.5) * 0.05],
      priority,
      timeWindow,
      assignedVehicleId,
      state: 'Assigned',
      weightKg: parseFloat(weightKg) || 10,
      packagesCount: parseInt(packagesCount) || 1,
      notes,
    });

    onClose();
    setCustomerName('');
    setAddress('');
    setNotes('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <span className="flex items-center gap-2 text-cyan-400">
          <PackagePlus className="w-5 h-5" />
          Dispatch New Delivery Order
        </span>
      }
      subtitle="Encode order constraints for quantum optimization and route assignment."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 font-sans text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Customer / Facility Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Care Hospital Medical Center"
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Customer Category</label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none"
            >
              <option value="Hospital">Hospital / Emergency Healthcare</option>
              <option value="Pharmacy">Pharmacy / Lab</option>
              <option value="Retail Hub">Retail Hub / SuperCenter</option>
              <option value="Enterprise">Enterprise Tech Park</option>
              <option value="Residential">Residential Doorstep</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Delivery Destination Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Road No 2, Jubilee Hills, Hyderabad"
            className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none font-bold"
            >
              <option value="URGENT">🔴 URGENT (Highest SLA)</option>
              <option value="HIGH">🟡 HIGH Priority</option>
              <option value="NORMAL">🟢 NORMAL Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Delivery Time Window</label>
            <input
              type="text"
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
              placeholder="10:00 – 12:00"
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Assign Initial Vehicle</label>
            <select
              value={assignedVehicleId}
              onChange={(e) => setAssignedVehicleId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none font-mono"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} ({v.type} • {v.driver.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Package Count</label>
            <input
              type="number"
              value={packagesCount}
              onChange={(e) => setPackagesCount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Special Handling Instructions / Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Fragile cold-chain vial container. Handle with extreme care."
            className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            <span>Add & Optimize Order</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
