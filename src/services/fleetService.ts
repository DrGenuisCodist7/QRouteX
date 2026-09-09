import { Vehicle, VehicleStatus } from '@/types';
import { INITIAL_VEHICLES } from '@/data/demoVehicles';

let vehiclesState: Vehicle[] = [...INITIAL_VEHICLES];

export const fleetService = {
  getAllVehicles: (): Vehicle[] => {
    return [...vehiclesState];
  },

  getVehicleById: (id: string): Vehicle | undefined => {
    return vehiclesState.find((v) => v.id === id);
  },

  updateVehicleStatus: (id: string, status: VehicleStatus): Vehicle | null => {
    const idx = vehiclesState.findIndex((v) => v.id === id);
    if (idx !== -1) {
      vehiclesState[idx] = {
        ...vehiclesState[idx],
        status,
      };
      return vehiclesState[idx];
    }
    return null;
  },

  filterVehicles: (
    filter: 'all' | 'active' | 'idle' | 'service' | 'ev',
    searchQuery: string = ''
  ): Vehicle[] => {
    const q = searchQuery.toLowerCase().trim();
    return vehiclesState.filter((v) => {
      const matchesSearch =
        !q ||
        v.id.toLowerCase().includes(q) ||
        v.driver.name.toLowerCase().includes(q) ||
        v.registration.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filter === 'all') return true;
      if (filter === 'ev') return v.isEV;
      if (filter === 'active') return v.status === 'active' || v.status === 'traffic';
      if (filter === 'idle') return v.status === 'idle' || v.status === 'break';
      if (filter === 'service') return v.status === 'service' || v.status === 'reroute';
      return true;
    });
  },

  getFleetStats: () => {
    const total = vehiclesState.length;
    const active = vehiclesState.filter((v) => v.status === 'active' || v.status === 'traffic').length;
    const idle = vehiclesState.filter((v) => v.status === 'idle' || v.status === 'break').length;
    const service = vehiclesState.filter((v) => v.status === 'service' || v.status === 'reroute').length;
    const evCount = vehiclesState.filter((v) => v.isEV).length;
    const avgLoad = Math.round(
      vehiclesState.reduce((acc, v) => acc + v.loadPercentage, 0) / (total || 1)
    );

    return {
      total,
      active,
      idle,
      service,
      evCount,
      evPercentage: Math.round((evCount / (total || 1)) * 100),
      avgLoad,
    };
  },
};
