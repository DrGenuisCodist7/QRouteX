'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Vehicle,
  DeliveryOrder,
  RoutePlan,
  DisruptionEvent,
  QAOARunMetrics,
  QuantumObjectiveWeights,
} from '@/types';
import { fleetService } from '@/services/fleetService';
import { orderService } from '@/services/orderService';
import { routeService } from '@/services/routeService';
import { quantumOptimizerService, DEFAULT_QUANTUM_WEIGHTS } from '@/services/quantumService';

export function useFleetState() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => fleetService.getAllVehicles());
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => orderService.getAllOrders());
  const [routes, setRoutes] = useState<RoutePlan[]>(() => routeService.getAllRoutes());
  const [disruptions, setDisruptions] = useState<DisruptionEvent[]>(() => routeService.getActiveDisruptions());
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [quantumWeights, setQuantumWeights] = useState<QuantumObjectiveWeights>(DEFAULT_QUANTUM_WEIGHTS);
  const [quantumMetrics, setQuantumMetrics] = useState<QAOARunMetrics>({
    status: 'idle',
    progressPct: 78,
    qubitsRepresented: 96,
    feasibleAssignments: 17,
    iterations: 128,
    bestObjective: 0.214,
    solutionQualityPct: 78.0,
    classicalBaselineCost: 1.84,
    quantumOptimizedCost: 1.28,
    energyConvergence: [
      { step: 1, energy: 0.42, feasibility: 72 },
      { step: 4, energy: 0.35, feasibility: 76 },
      { step: 8, energy: 0.28, feasibility: 81 },
      { step: 12, energy: 0.23, feasibility: 89 },
      { step: 16, energy: 0.214, feasibility: 94 },
    ],
  });
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Synchronize initial data from backend database on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [ordersRes, vehiclesRes, routesRes] = await Promise.allSettled([
          fetch('/api/orders').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/vehicles').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/routes').then((r) => (r.ok ? r.json() : null)),
        ]);

        if (!isMounted) return;

        if (ordersRes.status === 'fulfilled' && ordersRes.value) {
          const list = ordersRes.value.data || ordersRes.value.orders;
          if (Array.isArray(list) && list.length > 0) {
            setOrders(list);
          }
        }
        if (vehiclesRes.status === 'fulfilled' && vehiclesRes.value) {
          const list = vehiclesRes.value.data || vehiclesRes.value.vehicles;
          if (Array.isArray(list) && list.length > 0) {
            setVehicles(list);
          }
        }
        if (routesRes.status === 'fulfilled' && routesRes.value) {
          const rList = routesRes.value.data?.routes || routesRes.value.routes;
          const dList = routesRes.value.data?.disruptions || routesRes.value.disruptions;
          if (Array.isArray(rList) && rList.length > 0) {
            setRoutes(rList);
          }
          if (Array.isArray(dList)) {
            setDisruptions(dList);
          }
        }
      } catch (err) {
        console.warn('Initial API sync notice (using local fallback state):', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const simulateDisruption = useCallback(async () => {
    try {
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate_disruption' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.disruptions) setDisruptions(data.disruptions);
        if (data.routes) setRoutes(data.routes);
        if (data.vehicles) setVehicles(data.vehicles);
        return data.disruption;
      }
    } catch (e) {
      console.warn('API route call fallback to service:', e);
    }
    const newDisruption = routeService.simulateDisruption();
    setDisruptions(routeService.getActiveDisruptions());
    setRoutes(routeService.getAllRoutes());
    setVehicles(fleetService.getAllVehicles());
    return newDisruption;
  }, []);

  const rerouteAffectedVehicles = useCallback(async () => {
    try {
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reroute_affected' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.disruptions) setDisruptions(data.disruptions);
        if (data.routes) setRoutes(data.routes);
        if (data.vehicles) setVehicles(data.vehicles);
        return data;
      }
    } catch (e) {
      console.warn('API route call fallback to service:', e);
    }
    const res = routeService.rerouteAffectedVehicles();
    setDisruptions(routeService.getActiveDisruptions());
    setRoutes(routeService.getAllRoutes());
    setVehicles(fleetService.getAllVehicles());
    return res;
  }, []);

  const runQAOAOptimization = useCallback(async () => {
    setIsOptimizing(true);
    try {
      const ibmToken = typeof window !== 'undefined' ? localStorage.getItem('qroutex_ibm_quantum_token') || '' : '';
      const ibmBackend = typeof window !== 'undefined' ? localStorage.getItem('qroutex_ibm_quantum_backend') || 'ibm_brisbane' : 'ibm_brisbane';
      
      const res = await fetch('/api/quantum/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weights: quantumWeights,
          ibmToken: ibmToken || undefined,
          backendName: ibmBackend,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const metrics = json.data || json.metrics;
        if (metrics) {
          setQuantumMetrics(metrics);
          setIsOptimizing(false);
          return metrics;
        }
      }
    } catch (e) {
      console.warn('API quantum optimize fallback:', e);
    }

    const result = await quantumOptimizerService.runQAOASimulation(quantumWeights, (state) => {
      setQuantumMetrics(state);
    });
    setIsOptimizing(false);
    return result;
  }, [quantumWeights]);

  const addOrder = useCallback(async (newOrder: Omit<DeliveryOrder, 'id' | 'trackingCode' | 'deadlineIso' | 'slaRisk'>) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const json = await res.json();
        const created = json.data || json.order;
        if (created) {
          setOrders((prev) => [created, ...prev.filter((o) => o.id !== created.id)]);
          return created;
        }
      }
    } catch (e) {
      console.warn('API add order fallback:', e);
    }
    const created = orderService.addOrder(newOrder);
    setOrders((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateOrder = useCallback(async (id: string, updates: Partial<DeliveryOrder>) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        const updated = json.data || json.order;
        if (updated) {
          setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
          return updated;
        }
      }
    } catch (e) {
      console.warn('API update order fallback:', e);
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    // Optimistic delete
    setOrders((prev) => prev.filter((o) => o.id !== id));

    try {
      await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('API delete order fallback:', e);
    }
  }, []);

  const updateWeights = useCallback((weights: Partial<QuantumObjectiveWeights>) => {
    setQuantumWeights((prev) => ({ ...prev, ...weights }));
  }, []);

  return {
    vehicles,
    orders,
    routes,
    disruptions,
    selectedVehicle,
    setSelectedVehicle,
    quantumWeights,
    setQuantumWeights: updateWeights,
    quantumMetrics,
    isOptimizing,
    simulateDisruption,
    rerouteAffectedVehicles,
    runQAOAOptimization,
    addOrder,
    updateOrder,
    deleteOrder,
  };
}
