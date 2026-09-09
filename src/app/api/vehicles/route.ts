import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter')?.toLowerCase();
    const search = searchParams.get('search')?.toLowerCase();

    let vehicles = db.getVehicles();

    if (search) {
      vehicles = vehicles.filter(
        (v) =>
          v.id.toLowerCase().includes(search) ||
          v.driver.name.toLowerCase().includes(search) ||
          v.registration.toLowerCase().includes(search)
      );
    }

    if (filter === 'ev') {
      vehicles = vehicles.filter((v) => v.isEV);
    } else if (filter === 'active') {
      vehicles = vehicles.filter((v) => v.status === 'active' || v.status === 'traffic');
    } else if (filter === 'idle') {
      vehicles = vehicles.filter((v) => v.status === 'idle' || v.status === 'break');
    } else if (filter === 'service') {
      vehicles = vehicles.filter((v) => v.status === 'service' || v.status === 'reroute');
    }

    return NextResponse.json({ success: true, data: vehicles, count: vehicles.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
