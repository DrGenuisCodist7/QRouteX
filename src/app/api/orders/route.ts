import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const priority = searchParams.get('priority')?.toUpperCase();
    const state = searchParams.get('state');

    let orders = db.getOrders();

    if (search) {
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search) ||
          o.customerName.toLowerCase().includes(search) ||
          o.address.toLowerCase().includes(search) ||
          o.trackingCode.toLowerCase().includes(search)
      );
    }

    if (priority && priority !== 'ALL') {
      orders = orders.filter((o) => o.priority === priority);
    }

    if (state && state !== 'ALL') {
      orders = orders.filter((o) => o.state.toLowerCase() === state.toLowerCase());
    }

    return NextResponse.json({ success: true, data: orders, count: orders.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.address) {
      return NextResponse.json(
        { success: false, error: 'Customer Name and Address are required.' },
        { status: 400 }
      );
    }

    const createdOrder = db.createOrder({
      customerName: body.customerName,
      customerType: body.customerType || 'Retail Hub',
      address: body.address,
      coordinates: body.coordinates || [17.4125 + (Math.random() - 0.5) * 0.05, 78.4380 + (Math.random() - 0.5) * 0.05],
      priority: body.priority || 'HIGH',
      timeWindow: body.timeWindow || '11:00 – 13:00',
      assignedVehicleId: body.assignedVehicleId || 'V-07',
      state: body.state || 'Assigned',
      weightKg: Number(body.weightKg) || 10,
      packagesCount: Number(body.packagesCount) || 1,
      notes: body.notes || '',
    });

    return NextResponse.json({ success: true, data: createdOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
