import { AnalyticsSummary } from '@/types';

export const INITIAL_ANALYTICS: AnalyticsSummary = {
  distanceSavedPct: 14.8,
  fuelSavedCurrencyEstimate: '₹2,340 / day',
  fuelSavedPct: 11.2,
  co2ReducedPct: 18.4,
  co2SavedKg: 226,
  deliverySlaPct: 91.4,
  fleetUtilizationPct: 86.2,
  routeFeasibilityPct: 97.8,
  sustainabilityScore: 82.5,
  hourlyEfficiency: [
    { hour: '06:00', classicalCost: 120, quantumCost: 104, deliveries: 12 },
    { hour: '08:00', classicalCost: 260, quantumCost: 215, deliveries: 38 },
    { hour: '10:00', classicalCost: 480, quantumCost: 395, deliveries: 64 },
    { hour: '12:00', classicalCost: 610, quantumCost: 512, deliveries: 55 },
    { hour: '14:00', classicalCost: 520, quantumCost: 430, deliveries: 42 },
    { hour: '16:00', classicalCost: 430, quantumCost: 362, deliveries: 30 },
    { hour: '18:00', classicalCost: 290, quantumCost: 248, deliveries: 18 },
    { hour: '20:00', classicalCost: 140, quantumCost: 118, deliveries: 7 },
  ],
  powertrainDistribution: [
    { name: 'Electric (EV)', count: 7, percentage: 46.7, color: '#27d9ff' },
    { name: 'Clean Diesel (BS-VI)', count: 5, percentage: 33.3, color: '#3b82f6' },
    { name: 'Hybrid Electric', count: 2, percentage: 13.3, color: '#a970ff' },
    { name: 'Cargo E-Bike', count: 1, percentage: 6.7, color: '#37d67a' },
  ],
};
