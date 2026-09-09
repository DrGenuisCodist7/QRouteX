import { DeliveryOrder } from '@/types';
import { INITIAL_ORDERS } from '@/data/demoOrders';

let ordersState: DeliveryOrder[] = [...INITIAL_ORDERS];

export const orderService = {
  getAllOrders: (): DeliveryOrder[] => {
    return [...ordersState];
  },

  addOrder: (newOrder: Omit<DeliveryOrder, 'id' | 'trackingCode' | 'deadlineIso' | 'slaRisk'>): DeliveryOrder => {
    const randomNum = Math.floor(Math.random() * 800) + 520;
    const id = `#${randomNum}`;
    const trackingCode = `QRX-${newOrder.customerType.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const fullOrder: DeliveryOrder = {
      ...newOrder,
      id,
      trackingCode,
      deadlineIso: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      slaRisk: newOrder.priority === 'URGENT' ? 'MEDIUM' : 'LOW',
    };

    ordersState = [fullOrder, ...ordersState];
    return fullOrder;
  },

  getOrdersByVehicleId: (vehicleId: string): DeliveryOrder[] => {
    return ordersState.filter((o) => o.assignedVehicleId === vehicleId);
  },

  getOrderStats: () => {
    const total = ordersState.length;
    const urgent = ordersState.filter((o) => o.priority === 'URGENT').length;
    const high = ordersState.filter((o) => o.priority === 'HIGH').length;
    const normal = ordersState.filter((o) => o.priority === 'NORMAL').length;
    const inTransit = ordersState.filter((o) => o.state === 'Out for delivery').length;

    return {
      total,
      urgent,
      high,
      normal,
      inTransit,
      onTimeRate: 91.2,
    };
  },
};
