'use client';

import React, { useState } from 'react';
import { DeliveryOrder, Vehicle, OrderState } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Package,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  Building2,
  Edit3,
  Trash2,
  CheckCircle2,
  MoreVertical,
} from 'lucide-react';
import { AddOrderModal } from './AddOrderModal';
import { EditOrderModal } from './EditOrderModal';

interface OrderPriorityQueueProps {
  orders: DeliveryOrder[];
  vehicles: Vehicle[];
  onAddOrder: (order: Omit<DeliveryOrder, 'id' | 'trackingCode' | 'deadlineIso' | 'slaRisk'>) => void;
  onUpdateOrder: (id: string, updates: Partial<DeliveryOrder>) => void;
  onDeleteOrder: (id: string) => void;
}

export const OrderPriorityQueue: React.FC<OrderPriorityQueueProps> = ({
  orders,
  vehicles,
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'URGENT' | 'HIGH' | 'NORMAL'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<DeliveryOrder | null>(null);

  const filtered = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.trackingCode.toLowerCase().includes(q);

    const matchesPriority =
      priorityFilter === 'ALL' || o.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="rose" dot>URGENT</Badge>;
      case 'HIGH':
        return <Badge variant="amber" dot>HIGH</Badge>;
      case 'NORMAL':
        return <Badge variant="green" dot>NORMAL</Badge>;
      default:
        return <Badge variant="muted">{priority}</Badge>;
    }
  };

  const getStateBadge = (state: string) => {
    switch (state) {
      case 'Out for delivery':
        return <Badge variant="cyan">Out for Delivery</Badge>;
      case 'Assigned':
        return <Badge variant="blue">Assigned</Badge>;
      case 'Queued':
        return <Badge variant="muted">Queued</Badge>;
      case 'Delivered':
        return <Badge variant="green">Delivered</Badge>;
      case 'Delayed':
        return <Badge variant="rose">Delayed</Badge>;
      default:
        return <Badge variant="muted">{state}</Badge>;
    }
  };

  const handleQuickStatusChange = (orderId: string, newState: OrderState) => {
    onUpdateOrder(orderId, { state: newState });
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-100/90 border border-border shadow-glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center font-bold text-purple-400 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Customizable Order Priority Queue</h3>
            <p className="text-xs text-text-secondary">
              Real-time order creation, priority customization, vehicle re-assignment, and database synchronization.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Order</span>
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer, address, tracking..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-50 border border-border text-xs text-slate-100 focus:border-cyan-400 outline-none placeholder:text-slate-600"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
          <span className="text-text-muted text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Priority:
          </span>
          {(['ALL', 'URGENT', 'HIGH', 'NORMAL'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setPriorityFilter(lvl)}
              className={`px-3 py-1 rounded-lg border transition-colors ${
                priorityFilter === lvl
                  ? 'bg-purple-950/80 border-purple-500/40 text-purple-300 font-bold'
                  : 'bg-surface-50 border-border text-text-secondary hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Order Queue Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface-50/60 font-mono text-[11px] text-text-muted uppercase">
                <th className="py-3 px-4">Order ID / Tracking</th>
                <th className="py-3 px-4">Customer & Destination</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Time Window (SLA)</th>
                <th className="py-3 px-4">Assigned Vehicle</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-surface-200/50 transition-colors font-sans text-slate-200"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                    <span>{order.id}</span>
                    <span className="block text-[10px] font-normal text-text-muted">
                      {order.trackingCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {order.customerName}
                    </p>
                    <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {order.address}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    {getPriorityBadge(order.priority)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-200">
                    <span className="flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {order.timeWindow}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-300">
                    {order.assignedVehicleId}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="text-white block">{order.weightKg} kg</span>
                    <span className="text-text-muted text-[10px]">{order.packagesCount} units</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.state}
                      onChange={(e) => handleQuickStatusChange(order.id, e.target.value as any)}
                      className="bg-surface-50 border border-border rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:border-cyan-400 outline-none cursor-pointer"
                    >
                      <option value="Queued">Queued</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingOrder(order)}
                        className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-border text-cyan-300 hover:text-white transition-colors"
                        title="Customize / Edit Order"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete order ${order.id}?`)) {
                            onDeleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-800/50 text-rose-300 hover:text-white transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Order Modal */}
      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        vehicles={vehicles}
        onAddOrder={onAddOrder}
      />

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          isOpen={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          vehicles={vehicles}
          onSaveOrder={onUpdateOrder}
        />
      )}
    </div>
  );
};
