'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationPage } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFleetState } from '@/hooks/useFleetState';
import { useToast } from '@/hooks/useToast';
import { analyticsService } from '@/services/analyticsService';

// Landing & Auth
import { LandingHero } from '@/components/landing/LandingHero';
import { LoginCard } from '@/components/auth/LoginCard';

// Layout
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileNav } from '@/components/layout/MobileNav';

// UI
import { ToastContainer } from '@/components/ui/Toast';

// Map & Geolocation
import { FleetMap } from '@/components/map/FleetMap';
import { LocationPromptModal } from '@/components/map/LocationPromptModal';

// Dashboard
import { MetricCards } from '@/components/dashboard/MetricCards';
import { RouteOptionsPanel } from '@/components/dashboard/RouteOptionsPanel';
import { FleetUtilization } from '@/components/dashboard/FleetUtilization';
import { DriverStatusList } from '@/components/dashboard/DriverStatusList';
import { OptimizationGoals } from '@/components/dashboard/OptimizationGoals';

// Routes
import { LiveRoutesTable } from '@/components/routes/LiveRoutesTable';

// Fleet
import { FleetStatsCards } from '@/components/fleet/FleetStatsCards';
import { FleetMonitoringTable } from '@/components/fleet/FleetMonitoringTable';

// Orders
import { OrderPriorityQueue } from '@/components/orders/OrderPriorityQueue';

// Quantum
import { QUBOFormulaCard } from '@/components/quantum/QUBOFormulaCard';
import { ObjectiveWeightSliders } from '@/components/quantum/ObjectiveWeightSliders';
import { QAOASimulator } from '@/components/quantum/QAOASimulator';

// Analytics
import { AnalyticsKPIs } from '@/components/analytics/AnalyticsKPIs';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';

// Profile
import { ProfileOverview } from '@/components/profile/ProfileOverview';

type AppViewStage = 'landing' | 'login' | 'dashboard';

export default function Home() {
  const [viewStage, setViewStage] = useState<AppViewStage>('landing');
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');

  const { isAuthenticated, user, logout: handleAuthLogout, isLoading: isAuthLoading } = useAuth();
  const {
    geoState,
    isRealLocation,
    isPromptOpen,
    requestRealLocation,
    useDemoLocation,
    dismissPrompt,
    setIsPromptOpen,
  } = useGeolocation();
  const {
    vehicles,
    orders,
    routes,
    disruptions,
    selectedVehicle,
    setSelectedVehicle,
    quantumWeights,
    setQuantumWeights,
    quantumMetrics,
    isOptimizing,
    simulateDisruption,
    rerouteAffectedVehicles,
    runQAOAOptimization,
    addOrder,
    updateOrder,
    deleteOrder,
  } = useFleetState();
  const { toasts, showToast, removeToast } = useToast();

  const analyticsData = analyticsService.getAnalyticsSummary();

  // Check initial login session
  useEffect(() => {
    if (isAuthenticated) {
      setViewStage('dashboard');
    }
  }, [isAuthenticated]);

  // Handlers
  const handleParcelClick = () => {
    setViewStage('login');
  };

  const handleLoginSuccess = () => {
    setViewStage('dashboard');
    showToast('Signed in to QRouteX Quantum Logistics OS.', 'success', 'Session Authenticated');
  };

  const handleLogout = () => {
    handleAuthLogout();
    setViewStage('landing');
    setCurrentPage('dashboard');
    showToast('Logged out of control center.', 'info', 'Session Ended');
  };

  const handleSimulateDisruptionClick = async () => {
    const d = await simulateDisruption();
    showToast(
      '⚠ Disruption detected. Traffic matrix updated. Affected routes marked for re-optimization.',
      'warning',
      'Road Closure Alert'
    );
  };

  const handleRerouteClick = async () => {
    const res = await rerouteAffectedVehicles();
    showToast(
      res?.message || 'Autonomous Quantum Detour Applied to Active Fleets.',
      'quantum',
      'Autonomous Quantum Detour Applied'
    );
  };

  const handleOptimizeFleetClick = async () => {
    showToast('⚛ QAOA quantum circuit optimization started...', 'quantum', 'Optimizing Fleet');
    const result = await runQAOAOptimization();
    showToast(
      `✓ Quantum optimization complete! Solution quality: ${result.solutionQualityPct}% (${result.feasibleAssignments} feasible permutations found).`,
      'success',
      'QAOA Converged'
    );
  };

  const handleAddOrder = async (newOrder: any) => {
    const created = await addOrder(newOrder);
    showToast(
      `Order ${created.id} (${created.customerName}) added to queue and assigned to ${created.assignedVehicleId}.`,
      'success',
      'Order Intake Received'
    );
  };

  const handleUpdateOrder = async (id: string, updates: any) => {
    await updateOrder(id, updates);
    showToast(`Order ${id} customized and updated in persistent database.`, 'success', 'Order Saved');
  };

  const handleDeleteOrder = async (id: string) => {
    await deleteOrder(id);
    showToast(`Order ${id} removed from dispatch queue.`, 'info', 'Order Deleted');
  };

  // 1. Landing Screen with 3D Quantum Parcel
  if (viewStage === 'landing') {
    return (
      <>
        <LandingHero onEnter={handleParcelClick} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 2. Futuristic Glassmorphic Login Screen
  if (viewStage === 'login') {
    return (
      <>
        <LoginCard
          onSuccess={handleLoginSuccess}
          onBackToLanding={() => setViewStage('landing')}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 3. Authenticated Fleet Command Dashboard
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Sidebar for Desktop / Tablet */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        onLogout={handleLogout}
        isOptimizing={isOptimizing}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Top Control Bar */}
        <Topbar
          currentPage={currentPage}
          isRealLocation={isRealLocation}
          onSimulateDisruption={handleSimulateDisruptionClick}
          onOptimizeFleet={handleOptimizeFleetClick}
          onOpenProfile={() => setCurrentPage('profile')}
          onOpenLocationPrompt={() => setIsPromptOpen(true)}
          isOptimizing={isOptimizing}
        />

        {/* Dynamic Page Views */}
        <AnimatePresence mode="wait">
          {/* 1. DASHBOARD VIEW */}
          {currentPage === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* KPI Metric Cards */}
              <MetricCards
                activeVehicles={vehicles.filter((v) => v.status === 'active' || v.status === 'traffic').length}
                totalVehicles={vehicles.length}
                deliveriesToday={248}
                totalDistanceKm={1284}
                fuelCostINR={18600}
                co2SavedKg={226}
              />

              {/* Map & Route Options Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Fleet Map (7 cols) */}
                <div className="lg:col-span-7">
                  <FleetMap
                    vehicles={vehicles}
                    routes={routes}
                    disruptions={disruptions}
                    userGeo={geoState}
                    onSelectVehicle={(v) => {
                      setSelectedVehicle(v);
                      showToast(
                        `Inspecting ${v.id} (${v.driver.name} • ${v.type})`,
                        'info',
                        'Vehicle Telemetry'
                      );
                    }}
                    onRequestRealLocation={requestRealLocation}
                  />
                </div>

                {/* Multi-Objective Options (5 cols) */}
                <div className="lg:col-span-5">
                  <RouteOptionsPanel
                    routes={routes}
                    onSelectRoute={(r) => {
                      showToast(
                        `Selected ${r.strategy.toUpperCase()} route: ${r.name}`,
                        'info',
                        'Route Plan'
                      );
                    }}
                  />
                </div>
              </div>

              {/* Bottom 3 Panels Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FleetUtilization />
                <DriverStatusList />
                <OptimizationGoals />
              </div>
            </motion.div>
          )}

          {/* 2. LIVE ROUTES VIEW */}
          {currentPage === 'routes' && (
            <motion.div
              key="routes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <LiveRoutesTable
                routes={routes}
                onRerouteAffected={handleRerouteClick}
                isRerouting={isOptimizing}
              />
            </motion.div>
          )}

          {/* 3. FLEET MONITORING VIEW */}
          {currentPage === 'fleet' && (
            <motion.div
              key="fleet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <FleetStatsCards
                total={vehicles.length}
                active={vehicles.filter((v) => v.status === 'active' || v.status === 'traffic').length}
                idle={vehicles.filter((v) => v.status === 'idle' || v.status === 'break').length}
                service={vehicles.filter((v) => v.status === 'service' || v.status === 'reroute').length}
                avgLoad={78}
                evCount={vehicles.filter((v) => v.isEV).length}
                evPercentage={33}
              />
              <FleetMonitoringTable vehicles={vehicles} />
            </motion.div>
          )}

          {/* 4. ORDERS VIEW */}
          {currentPage === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <OrderPriorityQueue
                orders={orders}
                vehicles={vehicles}
                onAddOrder={handleAddOrder}
                onUpdateOrder={handleUpdateOrder}
                onDeleteOrder={handleDeleteOrder}
              />
            </motion.div>
          )}

          {/* 5. QUANTUM OPTIMIZER VIEW */}
          {currentPage === 'quantum' && (
            <motion.div
              key="quantum"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <QUBOFormulaCard />
                <QAOASimulator
                  metrics={quantumMetrics}
                  isOptimizing={isOptimizing}
                  onRunOptimization={handleOptimizeFleetClick}
                />
              </div>
              <ObjectiveWeightSliders
                weights={quantumWeights}
                onChangeWeights={setQuantumWeights}
              />
            </motion.div>
          )}

          {/* 6. ANALYTICS VIEW */}
          {currentPage === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <AnalyticsKPIs data={analyticsData} />
              <AnalyticsCharts data={analyticsData} />
            </motion.div>
          )}

          {/* 7. PROFILE VIEW */}
          {currentPage === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <ProfileOverview
                user={
                  user || {
                    id: 'usr_admin_01',
                    name: 'Admin User',
                    email: 'admin@qroutex.ai',
                    role: 'Fleet Operations Administrator',
                    title: 'Principal Logistics Systems Lead',
                    avatar: 'A',
                    region: 'Hyderabad Control Center (HQ)',
                    twoFactorEnabled: true,
                    activeSince: 'March 2025',
                    lastLogin: 'Today, 08:15 IST',
                    apiTokensCount: 3,
                  }
                }
                onLogout={handleLogout}
                onEditProfile={() => {
                  showToast(
                    'Profile editing is prepared for live microservice backend connection.',
                    'info',
                    'Operator Settings'
                  );
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
      />

      {/* Location Permission Modal */}
      <LocationPromptModal
        isOpen={isPromptOpen}
        onAllow={async () => {
          const res = await requestRealLocation();
          if (res.status === 'granted') {
            showToast('Real browser GPS location active.', 'success', 'GPS Synced');
          } else {
            showToast(res.error || 'Using demo location base.', 'warning', 'Location Notice');
          }
        }}
        onUseDemo={() => {
          useDemoLocation();
          showToast('Using Hyderabad demo fleet base.', 'info', 'Demo Location');
        }}
        onDismiss={dismissPrompt}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
