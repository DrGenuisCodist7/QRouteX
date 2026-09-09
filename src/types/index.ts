export type NavigationPage = 
  | 'dashboard'
  | 'routes'
  | 'fleet'
  | 'orders'
  | 'quantum'
  | 'analytics'
  | 'profile';

export type UserRole = 'admin' | 'dispatcher' | 'fleet_manager' | 'operator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  avatar: string;
  region: string;
  twoFactorEnabled: boolean;
  activeSince: string;
  lastLogin: string;
  apiTokensCount: number;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  expiresAt: number;
}

export type VehicleStatus = 'active' | 'traffic' | 'break' | 'reroute' | 'service' | 'idle';
export type VehicleType = 'Truck' | 'Van' | 'Electric Van' | 'Cargo Bike';

export interface VehicleDriver {
  name: string;
  phone: string;
  rating: number;
  avatarUrl?: string;
  deliveriesCompletedToday: number;
}

export interface Vehicle {
  id: string; // e.g. "V-07"
  registration: string;
  type: VehicleType;
  driver: VehicleDriver;
  status: VehicleStatus;
  isEV: boolean;
  energyType: 'EV Battery' | 'Diesel' | 'Hybrid';
  energyLevelPct: number;
  currentLoadKg: number;
  maxCapacityKg: number;
  loadPercentage: number;
  ordersCount: number;
  currentCoordinates: [number, number]; // [lat, lng]
  assignedRouteId: string;
  eta: string;
  speedKmh: number;
  co2PerKmGrams: number;
  healthScorePct: number;
}

export type OrderPriority = 'URGENT' | 'HIGH' | 'NORMAL';
export type OrderState = 'Out for delivery' | 'Assigned' | 'Queued' | 'Delivered' | 'Delayed';

export interface DeliveryOrder {
  id: string; // e.g. "#438"
  trackingCode: string;
  customerName: string;
  customerType: 'Hospital' | 'Retail Hub' | 'Residential' | 'Enterprise' | 'Pharmacy';
  address: string;
  coordinates: [number, number];
  priority: OrderPriority;
  timeWindow: string;
  assignedVehicleId: string;
  state: OrderState;
  weightKg: number;
  packagesCount: number;
  deadlineIso: string;
  slaRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  notes?: string;
}

export type RouteStrategyType = 'fastest' | 'cheapest' | 'greenest' | 'balanced_quantum';

export interface RoutePlan {
  id: string;
  name: string;
  strategy: RouteStrategyType;
  badgeLabel: string;
  vehicleId: string;
  totalDistanceKm: number;
  etaFormatted: string;
  durationMinutes: number;
  fuelOrEnergyUsage: string;
  co2Kg: number;
  stopsCount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Traffic' | 'Re-route' | 'Optimized';
  waypoints: [number, number][];
  description: string;
}

export interface DisruptionEvent {
  id: string;
  title: string;
  description: string;
  coordinates: [number, number];
  radiusMeters: number;
  severity: 'Minor' | 'Moderate' | 'Critical';
  affectedRouteIds: string[];
  affectedVehicleIds: string[];
  createdAtIso: string;
  active: boolean;
}

export interface QuantumObjectiveWeights {
  alphaDistance: number; // α: Distance weight (0-100)
  betaTime: number;      // β: Delivery time weight (0-100)
  gammaFuel: number;     // γ: Fuel & cost weight (0-100)
  deltaLate: number;     // δ: Late SLA penalty (0-100)
  epsilonPriority: number; // ε: Urgent priority penalty (0-100)
  zetaEmissions: number; // ζ: CO2 emissions weight (0-100)
}

export interface QAOARunMetrics {
  status: 'idle' | 'running' | 'completed';
  progressPct: number;
  qubitsRepresented: number;
  feasibleAssignments: number;
  iterations: number;
  bestObjective: number;
  solutionQualityPct: number;
  classicalBaselineCost: number;
  quantumOptimizedCost: number;
  energyConvergence: { step: number; energy: number; feasibility: number }[];
  lastRunTimestamp?: string;
}

export interface AnalyticsSummary {
  distanceSavedPct: number;
  fuelSavedCurrencyEstimate: string;
  fuelSavedPct: number;
  co2ReducedPct: number;
  co2SavedKg: number;
  deliverySlaPct: number;
  fleetUtilizationPct: number;
  routeFeasibilityPct: number;
  sustainabilityScore: number;
  hourlyEfficiency: {
    hour: string;
    classicalCost: number;
    quantumCost: number;
    deliveries: number;
  }[];
  powertrainDistribution: {
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

export interface UserGeolocationState {
  coords: {
    lat: number;
    lng: number;
    accuracyMeters: number;
    heading?: number | null;
    speed?: number | null;
  } | null;
  status: 'idle' | 'prompt' | 'granted' | 'denied' | 'unavailable' | 'demo';
  error: string | null;
  isRealLocation: boolean;
  cityName?: string;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'quantum';
  title?: string;
  message: string;
  duration?: number;
}
