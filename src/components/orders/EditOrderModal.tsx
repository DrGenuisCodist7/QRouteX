'use client';

import React, { useState, useEffect } from 'react';
import { DeliveryOrder, OrderPriority, OrderState, Vehicle } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Edit3, Clock, MapPin, Building, Package } from 'lucide-react';

interface EditOrderModalProps {
  order: DeliveryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSaveOrder: (id: string, updates: Partial<DeliveryOrder>) => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  vehicles,
  onSaveOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerType, setCustomerType] = useState<DeliveryOrder['customerType']>('Hospital');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState<OrderPriority>('HIGH');
  const [timeWindow, setTimeWindow] = useState('');
  const [assignedVehicleId, setAssignedVehicleId] = useState('V-07');
  const [state, setState] = useState<OrderState>('Assigned');
  const [weightKg, setWeightKg] = useState('15');
  const [packagesCount, setPackagesCount] = useState('1');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName);
      setCustomerType(order.customerType);
      setAddress(order.address);
      setPriority(order.priority);
      setTimeWindow(order.timeWindow);
      setAssignedVehicleId(order.assignedVehicleId);
      setState(order.state);
      setWeightKg(order.weightKg.toString());
      setPackagesCount(order.packagesCount.toString());
      setNotes(order.notes || '');
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    onSaveOrder(order.id, {
      customerName,
      customerType,
      address,
      priority,
      timeWindow,
      assignedVehicleId,
      state,
      weightKg: parseFloat(weightKg) || 10,
      packagesCount: parseInt(packagesCount) || 1,
      notes,
    });

    onClose();
  };

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <span className="flex items-center gap-2 text-cyan-400">
          <Edit3 className="w-5 h-5" />
          Customize & Edit Order {order.id}
        </span>
      }
      subtitle={`Tracking ID: ${order.trackingCode}`}
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
            <label className="block text-slate-300 font-medium mb-1">Delivery State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none font-semibold text-cyan-300"
            >
              <option value="Queued">Queued (Waiting Dispatch)</option>
              <option value="Assigned">Assigned to Vehicle</option>
              <option value="Out for delivery">Out for Delivery</option>
              <option value="Delivered">Delivered Successfully</option>
              <option value="Delayed">Delayed / Traffic Reroute</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Delivery Time Window</label>
            <input
              type="text"
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Assign Fleet Vehicle</label>
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
          <label className="block text-slate-300 font-medium mb-1">Handling Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-border text-slate-100 focus:border-cyan-400 outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            <span>Save Order Changes</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
