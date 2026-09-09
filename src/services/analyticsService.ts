import { AnalyticsSummary } from '@/types';
import { INITIAL_ANALYTICS } from '@/data/demoAnalytics';

export const analyticsService = {
  getAnalyticsSummary: (): AnalyticsSummary => {
    return { ...INITIAL_ANALYTICS };
  },

  calculateFleetSavings: (totalKm: number) => {
    const staticFuelCostINR = totalKm * 16.5;
    const qaoaFuelCostINR = totalKm * 14.65;
    const savingsINR = staticFuelCostINR - qaoaFuelCostINR;
    const co2SavedKg = Math.round(totalKm * 0.176);

    return {
      staticFuelCostINR: Math.round(staticFuelCostINR),
      qaoaFuelCostINR: Math.round(qaoaFuelCostINR),
      savingsINR: Math.round(savingsINR),
      co2SavedKg,
    };
  },
};
