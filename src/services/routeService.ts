import { DisruptionEvent, RoutePlan } from '@/types';
import { INITIAL_ROUTES } from '@/data/demoRoutes';

let routesState: RoutePlan[] = [...INITIAL_ROUTES];
let activeDisruptions: DisruptionEvent[] = [];

export const routeService = {
  getAllRoutes: (): RoutePlan[] => {
    return [...routesState];
  },

  getActiveDisruptions: (): DisruptionEvent[] => {
    return [...activeDisruptions];
  },

  simulateDisruption: (): DisruptionEvent => {
    // Generate a disruption around central transit corridors
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

    activeDisruptions = [disruption, ...activeDisruptions];

    // Mark affected routes as High risk / Re-route
    routesState = routesState.map((r) => {
      if (disruption.affectedRouteIds.includes(r.id)) {
        return {
          ...r,
          riskLevel: 'High',
          status: 'Re-route',
          etaFormatted: `${parseInt(r.etaFormatted.split('h')[0]) + 1}h ${r.etaFormatted.split('h')[1]} (Delayed)`,
        };
      }
      return r;
    });

    return disruption;
  },

  rerouteAffectedVehicles: (): { updatedRoutesCount: number; message: string } => {
    const affectedCount = routesState.filter((r) => r.status === 'Re-route' || r.riskLevel === 'High').length;

    // Reroute them to optimized bypass waypoints
    routesState = routesState.map((r) => {
      if (r.status === 'Re-route' || r.riskLevel === 'High') {
        return {
          ...r,
          riskLevel: 'Low',
          status: 'Optimized',
          badgeLabel: 'QAOA Detour Optimal',
          etaFormatted: r.strategy === 'greenest' ? '2h 15m' : '2h 05m',
          description: 'Autonomous detour applied via Outer Express Corridor. Congestion avoided.',
        };
      }
      return r;
    });

    // Clear active disruptions
    activeDisruptions = activeDisruptions.map((d) => ({ ...d, active: false }));

    return {
      updatedRoutesCount: affectedCount || 2,
      message: 'Autonomous quantum-classical reroute applied. 2 vehicles reassigned to bypass arterial choke points.',
    };
  },
};
