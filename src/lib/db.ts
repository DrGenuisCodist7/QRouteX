import fs from 'fs';
import path from 'path';
import { Vehicle, DeliveryOrder, RoutePlan, DisruptionEvent, AnalyticsSummary } from '@/types';
import { INITIAL_VEHICLES } from '@/data/demoVehicles';
import { INITIAL_ORDERS } from '@/data/demoOrders';
import { INITIAL_ROUTES, CENTRAL_DEPOT_COORDS } from '@/data/demoRoutes';
import { INITIAL_ANALYTICS } from '@/data/demoAnalytics';

interface DatabaseSchema {
  vehicles: Vehicle[];
  orders: DeliveryOrder[];
  routes: RoutePlan[];
  disruptions: DisruptionEvent[];
  analytics: AnalyticsSummary;
  quantumRuns: Array<{
    id: string;
    timestamp: string;
    weights: any;
    result: any;
    backend: string;
  }>;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'qroutex_db.json');

// In-memory fallback for serverless/edge environments where filesystem is ephemeral or read-only
let inMemoryDb: DatabaseSchema | null = null;

function getDefaultDb(): DatabaseSchema {
  return {
    vehicles: INITIAL_VEHICLES,
    orders: INITIAL_ORDERS,
    routes: INITIAL_ROUTES,
    disruptions: [],
    analytics: INITIAL_ANALYTICS,
    quantumRuns: [],
  };
}

function ensureDb(): DatabaseSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  try {
    if (!fs.existsSync(DB_DIR)) {
      try {
        fs.mkdirSync(DB_DIR, { recursive: true });
      } catch {}
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(content) as DatabaseSchema;
      return inMemoryDb;
    }

    const initialDb = getDefaultDb();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    } catch {}
    inMemoryDb = initialDb;
    return initialDb;
  } catch (err) {
    console.warn('Filesystem read failed, using in-memory store:', err);
    inMemoryDb = inMemoryDb || getDefaultDb();
    return inMemoryDb;
  }
}

function writeDb(data: DatabaseSchema): void {
  inMemoryDb = data;
  try {
    if (!fs.existsSync(DB_DIR)) {
      try {
        fs.mkdirSync(DB_DIR, { recursive: true });
      } catch {}
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Graceful fallback on read-only environments like Vercel Lambda
  }
}

export const db = {
  // Orders CRUD
  getOrders: (): DeliveryOrder[] => {
    const data = ensureDb();
    return data.orders || [];
  },

  getOrderById: (id: string): DeliveryOrder | undefined => {
    const data = ensureDb();
    return data.orders.find((o) => o.id === id);
  },

  createOrder: (
    newOrderData: Omit<DeliveryOrder, 'id' | 'trackingCode' | 'deadlineIso' | 'slaRisk'>
  ): DeliveryOrder => {
    const data = ensureDb();
    const randomNum = Math.floor(Math.random() * 800) + 520;
    const id = `#${randomNum}`;
    const prefix = newOrderData.customerType ? newOrderData.customerType.substring(0, 3).toUpperCase() : 'GEN';
    const trackingCode = `QRX-${prefix}-${Math.floor(Math.random() * 9000) + 1000}`;

    const newOrder: DeliveryOrder = {
      ...newOrderData,
      id,
      trackingCode,
      deadlineIso: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      slaRisk: newOrderData.priority === 'URGENT' ? 'HIGH' : newOrderData.priority === 'HIGH' ? 'MEDIUM' : 'LOW',
    };

    data.orders = [newOrder, ...data.orders];

    // Increment orders count for assigned vehicle if present
    if (newOrder.assignedVehicleId) {
      const v = data.vehicles.find((veh) => veh.id === newOrder.assignedVehicleId);
      if (v) {
        v.ordersCount = (v.ordersCount || 0) + 1;
        v.currentLoadKg = Math.min(v.maxCapacityKg, v.currentLoadKg + (newOrder.weightKg || 5));
        v.loadPercentage = Math.round((v.currentLoadKg / (v.maxCapacityKg || 1000)) * 100);
      }
    }

    writeDb(data);
    return newOrder;
  },

  updateOrder: (id: string, updates: Partial<DeliveryOrder>): DeliveryOrder | null => {
    const data = ensureDb();
    const index = data.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    const oldOrder = data.orders[index];
    const updatedOrder = { ...oldOrder, ...updates };

    // If vehicle assignment changed, update load
    if (updates.assignedVehicleId && updates.assignedVehicleId !== oldOrder.assignedVehicleId) {
      const oldV = data.vehicles.find((v) => v.id === oldOrder.assignedVehicleId);
      if (oldV && oldV.ordersCount > 0) {
        oldV.ordersCount--;
        oldV.currentLoadKg = Math.max(0, oldV.currentLoadKg - oldOrder.weightKg);
        oldV.loadPercentage = Math.round((oldV.currentLoadKg / oldV.maxCapacityKg) * 100);
      }
      const newV = data.vehicles.find((v) => v.id === updates.assignedVehicleId);
      if (newV) {
        newV.ordersCount++;
        newV.currentLoadKg = Math.min(newV.maxCapacityKg, newV.currentLoadKg + updatedOrder.weightKg);
        newV.loadPercentage = Math.round((newV.currentLoadKg / newV.maxCapacityKg) * 100);
      }
    }

    data.orders[index] = updatedOrder;
    writeDb(data);
    return updatedOrder;
  },

  deleteOrder: (id: string): boolean => {
    const data = ensureDb();
    const orderToDelete = data.orders.find((o) => o.id === id);
    if (!orderToDelete) return false;

    if (orderToDelete.assignedVehicleId) {
      const v = data.vehicles.find((veh) => veh.id === orderToDelete.assignedVehicleId);
      if (v && v.ordersCount > 0) {
        v.ordersCount--;
        v.currentLoadKg = Math.max(0, v.currentLoadKg - orderToDelete.weightKg);
        v.loadPercentage = Math.round((v.currentLoadKg / v.maxCapacityKg) * 100);
      }
    }

    data.orders = data.orders.filter((o) => o.id !== id);
    writeDb(data);
    return true;
  },

  // Vehicles
  getVehicles: (): Vehicle[] => {
    const data = ensureDb();
    return data.vehicles || [];
  },

  updateVehicle: (id: string, updates: Partial<Vehicle>): Vehicle | null => {
    const data = ensureDb();
    const idx = data.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return null;

    data.vehicles[idx] = { ...data.vehicles[idx], ...updates };
    writeDb(data);
    return data.vehicles[idx];
  },

  // Routes & Disruptions
  getRoutes: (): RoutePlan[] => {
    const data = ensureDb();
    return data.routes || [];
  },

  getDisruptions: (): DisruptionEvent[] => {
    const data = ensureDb();
    return data.disruptions || [];
  },

  simulateDisruption: (): DisruptionEvent => {
    const data = ensureDb();
    const latOffset = (Math.random() - 0.5) * 0.04;
    const lngOffset = (Math.random() - 0.5) * 0.04;
    const disruptionCoords: [number, number] = [17.3920 + latOffset, 78.4740 + lngOffset];

    const disruption: DisruptionEvent = {
      id: `disp_${Date.now()}`,
      title: 'Major Roadworks & Gridlock Disruption',
      description: 'Water pipeline burst and arterial road closure detected by traffic radar.',
      coordinates: disruptionCoords,
      radiusMeters: 750,
      severity: 'Critical',
      affectedRouteIds: ['route-v11', 'route-v03'],
      affectedVehicleIds: ['V-11', 'V-03'],
      createdAtIso: new Date().toISOString(),
      active: true,
    };

    data.disruptions = [disruption, ...(data.disruptions || [])];

    data.routes = data.routes.map((r) => {
      if (disruption.affectedRouteIds.includes(r.id)) {
        return {
          ...r,
          riskLevel: 'High',
          status: 'Re-route',
          etaFormatted: `${parseInt(r.etaFormatted.split('h')[0] || '2') + 1}h 45m (Delayed)`,
        };
      }
      return r;
    });

    writeDb(data);
    return disruption;
  },

  rerouteVehicles: (): { updatedRoutesCount: number; message: string } => {
    const data = ensureDb();
    const affectedCount = data.routes.filter((r) => r.status === 'Re-route' || r.riskLevel === 'High').length;

    data.routes = data.routes.map((r) => {
      if (r.status === 'Re-route' || r.riskLevel === 'High') {
        return {
          ...r,
          riskLevel: 'Low',
          status: 'Optimized',
          badgeLabel: 'QAOA Detour Optimal',
          etaFormatted: r.strategy === 'greenest' ? '2h 12m' : '2h 04m',
          description: 'Autonomous detour applied via Outer Express Corridor. Congestion avoided.',
        };
      }
      return r;
    });

    data.disruptions = (data.disruptions || []).map((d) => ({ ...d, active: false }));
    writeDb(data);

    return {
      updatedRoutesCount: affectedCount || 2,
      message: 'Autonomous quantum-classical reroute applied. 2 vehicles reassigned to bypass arterial choke points.',
    };
  },

  // Analytics
  getAnalytics: (): AnalyticsSummary => {
    const data = ensureDb();
    return data.analytics || INITIAL_ANALYTICS;
  },

  // Save Quantum Job Run
  saveQuantumJob: (job: { weights: any; result: any; backend: string }) => {
    const data = ensureDb();
    const jobRecord = {
      id: `qjob_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...job,
    };
    data.quantumRuns = [jobRecord, ...(data.quantumRuns || [])];
    writeDb(data);
    return jobRecord;
  },
};
