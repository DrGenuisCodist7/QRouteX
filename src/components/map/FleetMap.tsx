'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Vehicle, DisruptionEvent, UserGeolocationState, RoutePlan } from '@/types';
import { Locate, ShieldCheck, Compass, AlertTriangle, Sparkles } from 'lucide-react';
import { CENTRAL_DEPOT_COORDS } from '@/data/demoRoutes';

interface FleetMapProps {
  vehicles: Vehicle[];
  routes: RoutePlan[];
  disruptions: DisruptionEvent[];
  userGeo: UserGeolocationState;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onRequestRealLocation?: () => void;
}

export const FleetMap: React.FC<FleetMapProps> = ({
  vehicles,
  routes,
  disruptions,
  userGeo,
  onSelectVehicle,
  onRequestRealLocation,
}) => {
  const mapIdRef = useRef<string>(`map_${Math.random().toString(36).substring(2, 9)}`);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{
    markers?: any;
    routes?: any;
    disruptions?: any;
    userMarker?: any;
  }>({});
  const [isReady, setIsReady] = useState(false);

  // Initialize Map Once
  useEffect(() => {
    let isCancelled = false;

    async function setupMap() {
      if (typeof window === 'undefined') return;
      const container = document.getElementById(mapIdRef.current);
      if (!container || mapInstanceRef.current) return;

      try {
        const L = (await import('leaflet')).default;

        // Ensure Leaflet CSS is loaded
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        const centerLat = userGeo.coords?.lat || CENTRAL_DEPOT_COORDS[0];
        const centerLng = userGeo.coords?.lng || CENTRAL_DEPOT_COORDS[1];

        // Safe cleanup if container had previous instance
        if ((container as any)._leaflet_id) {
          (container as any)._leaflet_id = null;
        }

        const map = L.map(container, {
          center: [centerLat, centerLng],
          zoom: 13,
          zoomControl: false,
          attributionControl: false,
        });

        // Fast & reliable dark map tiles
        L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        layersRef.current.routes = L.layerGroup().addTo(map);
        layersRef.current.disruptions = L.layerGroup().addTo(map);
        layersRef.current.markers = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;

        // Force resize calculation
        setTimeout(() => {
          if (!isCancelled && mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 200);

        if (!isCancelled) setIsReady(true);
      } catch (err) {
        console.error('Leaflet map initialization error:', err);
      }
    }

    setupMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !isReady) return;
    const map = mapInstanceRef.current;

    import('leaflet').then((L) => {
      if (layersRef.current.userMarker) {
        map.removeLayer(layersRef.current.userMarker);
      }

      if (userGeo.coords) {
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-8 h-8 rounded-full ${
                userGeo.isRealLocation ? 'bg-emerald-400/40' : 'bg-cyan-400/40'
              } animate-ping"></span>
              <div class="relative w-8 h-8 rounded-full ${
                userGeo.isRealLocation
                  ? 'bg-slate-900 border-2 border-emerald-400 shadow-[0_0_15px_#37d67a]'
                  : 'bg-slate-900 border-2 border-cyan-400 shadow-[0_0_15px_#27d9ff]'
              } flex items-center justify-center text-sm font-bold text-white">
                📍
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const userMarker = L.marker([userGeo.coords.lat, userGeo.coords.lng], {
          icon: userIcon,
        }).addTo(map);

        userMarker.bindPopup(`
          <div style="font-family:Inter,sans-serif;color:#0b1d31;padding:4px;">
            <b style="font-size:12px;color:#050d18;">${
              userGeo.isRealLocation ? 'Live Operator Base (You Are Here)' : 'Demo Central Base'
            }</b><br/>
            <span style="font-size:10px;color:#64748b;">
              ${userGeo.coords.lat.toFixed(4)}° N, ${userGeo.coords.lng.toFixed(4)}° E
            </span><br/>
            <small style="font-size:9px;color:${userGeo.isRealLocation ? '#059669' : '#0284c7'};font-weight:bold;">
              ${userGeo.isRealLocation ? '● Live Browser GPS Active' : '● Demo Base Coordinates'}
            </small>
          </div>
        `);

        layersRef.current.userMarker = userMarker;
      }
    });
  }, [userGeo, isReady]);

  // Update Fleet, Routes & Disruptions
  useEffect(() => {
    if (!mapInstanceRef.current || !isReady) return;

    import('leaflet').then((L) => {
      const markersGroup = layersRef.current.markers;
      const routesGroup = layersRef.current.routes;
      const disruptionsGroup = layersRef.current.disruptions;

      if (markersGroup) markersGroup.clearLayers();
      if (routesGroup) routesGroup.clearLayers();
      if (disruptionsGroup) disruptionsGroup.clearLayers();

      // 1. Central Depot
      const depotIcon = L.divIcon({
        className: 'custom-depot-marker',
        html: `
          <div class="w-8 h-8 rounded-xl bg-slate-900 border-2 border-purple-400 shadow-[0_0_15px_#a970ff] flex items-center justify-center text-xs font-bold text-white">
            🏢
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker(CENTRAL_DEPOT_COORDS, { icon: depotIcon })
        .addTo(markersGroup)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;color:#0b1d31;padding:4px;">
            <b style="font-size:12px;">Warehouse Alpha (Central Depot)</b><br/>
            <span style="font-size:10px;color:#64748b;">Quantum Dispatch & Charging Superhub</span>
          </div>
        `);

      // 2. Urgent Healthcare Destinations
      const hospitalCoords: [number, number] = [17.4030, 78.4691];
      const hospitalIcon = L.divIcon({
        className: 'custom-hospital-marker',
        html: `
          <div class="w-7 h-7 rounded-lg bg-rose-950 border-2 border-rose-400 shadow-[0_0_15px_#ff5d6c] flex items-center justify-center text-xs font-bold text-white">
            🏥
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker(hospitalCoords, { icon: hospitalIcon })
        .addTo(markersGroup)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;color:#0b1d31;padding:4px;">
            <b style="font-size:12px;color:#be123c;">Order #438 (URGENT)</b><br/>
            <span style="font-size:10px;color:#64748b;">City Hospital Emergency Care • 09:30–10:30</span>
          </div>
        `);

      // 3. Route Polylines
      routes.forEach((route) => {
        let color = '#27d9ff';
        let dashArray = undefined;

        if (route.strategy === 'greenest') {
          color = '#37d67a';
        } else if (route.strategy === 'cheapest') {
          color = '#3b82f6';
        }

        if (route.status === 'Re-route') {
          color = '#ffd166';
          dashArray = '6, 6';
        }

        L.polyline(route.waypoints, {
          color,
          weight: 4,
          opacity: 0.85,
          dashArray,
          lineJoin: 'round',
        })
          .addTo(routesGroup)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;color:#0b1d31;padding:4px;">
              <b style="font-size:12px;">${route.name}</b><br/>
              <span style="font-size:10px;color:#64748b;">Distance: ${route.totalDistanceKm} km • ETA: ${route.etaFormatted}</span><br/>
              <span style="font-size:9px;color:${color};font-weight:bold;">Status: ${route.status}</span>
            </div>
          `);
      });

      // 4. Disruptions
      disruptions.forEach((d) => {
        if (!d.active) return;

        const warnIcon = L.divIcon({
          className: 'custom-disruption-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-9 h-9 rounded-full bg-rose-500/40 animate-ping"></span>
              <div class="w-8 h-8 rounded-full bg-rose-950 border-2 border-rose-400 shadow-[0_0_20px_#ff5d6c] flex items-center justify-center text-xs font-bold text-white">
                ⚠
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker(d.coordinates, { icon: warnIcon })
          .addTo(disruptionsGroup)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;color:#0b1d31;padding:4px;">
              <b style="font-size:12px;color:#be123c;">⚠ ${d.title}</b><br/>
              <span style="font-size:10px;color:#64748b;">${d.description}</span><br/>
              <b style="font-size:9px;color:#dc2626;">Traffic matrix updated. Re-route required.</b>
            </div>
          `);

        L.circle(d.coordinates, {
          radius: d.radiusMeters,
          color: '#ff5d6c',
          fillColor: '#ff5d6c',
          fillOpacity: 0.14,
          weight: 2,
          dashArray: '6, 6',
        }).addTo(disruptionsGroup);
      });

      // 5. Vehicles
      vehicles.forEach((v) => {
        let borderClass = 'border-cyan-400 shadow-[0_0_15px_#27d9ff]';
        let emoji = '🚚';

        if (v.isEV) {
          borderClass = 'border-emerald-400 shadow-[0_0_15px_#37d67a]';
          emoji = '⚡';
        } else if (v.status === 'traffic') {
          borderClass = 'border-amber-400 shadow-[0_0_15px_#ffd166]';
          emoji = '🚛';
        } else if (v.status === 'break') {
          borderClass = 'border-purple-400 shadow-[0_0_15px_#a970ff]';
          emoji = '🚐';
        }

        const vehicleIcon = L.divIcon({
          className: 'custom-vehicle-marker',
          html: `
            <div class="w-8 h-8 rounded-full bg-slate-950 border-2 ${borderClass} flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform">
              ${emoji}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(v.currentCoordinates, { icon: vehicleIcon })
          .addTo(markersGroup)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;color:#0b1d31;padding:4px;min-width:180px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <b style="font-size:13px;color:#050d18;">${v.id} (${v.registration})</b>
                <span style="font-size:9px;background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:10px;font-weight:bold;">
                  ${v.status.toUpperCase()}
                </span>
              </div>
              <div style="font-size:11px;color:#334155;margin-bottom:2px;">
                Driver: <b>${v.driver.name}</b> (★ ${v.driver.rating})
              </div>
              <div style="font-size:10px;color:#64748b;margin-bottom:4px;">
                Deliveries: ${v.ordersCount} • Load: ${v.loadPercentage}% (${v.currentLoadKg} kg)
              </div>
              <div style="font-size:10px;color:#059669;font-weight:600;">
                ${v.isEV ? '⚡ EV Battery: ' + v.energyLevelPct + '%' : '⛽ Diesel: ' + v.energyLevelPct + '%'}
              </div>
            </div>
          `);

        marker.on('click', () => {
          if (onSelectVehicle) onSelectVehicle(v);
        });
      });
    });
  }, [vehicles, routes, disruptions, isReady, onSelectVehicle]);

  const handleRecenter = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const lat = userGeo.coords?.lat || CENTRAL_DEPOT_COORDS[0];
    const lng = userGeo.coords?.lng || CENTRAL_DEPOT_COORDS[1];
    mapInstanceRef.current.setView([lat, lng], 13);
  }, [userGeo]);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-border shadow-2xl bg-surface-50">
      {/* Map DOM Element */}
      <div id={mapIdRef.current} className="w-full h-full" />

      {/* Floating Status Banner */}
      <div className="absolute top-3 left-3 z-[400] px-3.5 py-2 rounded-xl bg-surface-100/90 backdrop-blur-md border border-border shadow-lg text-xs font-mono text-slate-100">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              userGeo.isRealLocation ? 'bg-emerald-400 shadow-[0_0_8px_#37d67a]' : 'bg-cyan-400 shadow-[0_0_8px_#27d9ff]'
            } animate-pulse`}
          />
          <span className="font-bold text-white">
            {userGeo.isRealLocation ? 'LIVE OPERATOR GPS' : 'DEMO FLEET BASE'}
          </span>
        </div>
        <p className="text-[10px] text-text-muted mt-0.5">
          {userGeo.coords
            ? `${userGeo.coords.lat.toFixed(4)}° N, ${userGeo.coords.lng.toFixed(4)}° E • 15 Vehicles Active`
            : 'Connecting telemetry...'}
        </p>
      </div>

      {/* Recenter & Controls */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="p-2.5 rounded-xl bg-surface-100/90 hover:bg-surface-200 backdrop-blur-md border border-border text-cyan-300 hover:text-white shadow-lg transition-colors cursor-pointer"
          title="Recenter Map on Operator Location"
        >
          <Locate className="w-4 h-4" />
        </button>

        {onRequestRealLocation && !userGeo.isRealLocation && (
          <button
            onClick={onRequestRealLocation}
            className="p-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white shadow-lg transition-colors cursor-pointer"
            title="Switch to Real Browser GPS"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] flex items-center flex-wrap gap-3 px-3 py-1.5 rounded-xl bg-surface-100/90 backdrop-blur-md border border-border text-[11px] font-mono text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#27d9ff]" />
          Fastest
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#37d67a]" />
          Greenest
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_6px_#3b82f6]" />
          Cheapest
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#ff5d6c]" />
          Disruption
        </span>
      </div>
    </div>
  );
};
