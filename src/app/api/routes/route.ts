import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const routes = db.getRoutes();
    const disruptions = db.getDisruptions();
    return NextResponse.json({ success: true, routes, disruptions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'simulate_disruption') {
      const disruption = db.simulateDisruption();
      const updatedRoutes = db.getRoutes();
      return NextResponse.json({
        success: true,
        disruption,
        routes: updatedRoutes,
        message: 'Road disruption detected. Traffic matrix updated.',
      });
    }

    if (action === 'reroute_affected') {
      const result = db.rerouteVehicles();
      const updatedRoutes = db.getRoutes();
      return NextResponse.json({
        success: true,
        routes: updatedRoutes,
        message: result.message,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
