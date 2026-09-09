# QRouteX — Quantum Logistics OS

<div align="center">
  <h3>Adaptive Last-Mile Delivery • Hybrid Classical–Quantum Optimization</h3>
  <p>An intelligent logistics operating system combining classical heuristics with quantum-inspired QAOA algorithms to optimize vehicle routing, fuel expenditure, and carbon emissions in real-time.</p>
</div>

---

## 🚀 Overview

**QRouteX** is a next-generation logistics operating system designed for modern fleet command centers. By formulating the Capacitated Vehicle Routing Problem with Time Windows (CVRP-TW) into a Quadratic Unconstrained Binary Optimization (**QUBO**) Hamiltonian, QRouteX executes Quantum Approximate Optimization Algorithm (**QAOA**) variational circuits to discover global minimum routing assignments across complex urban transit networks.

### Core Mathematical Objective:
$$C = \alpha D + \beta T + \gamma F + \delta L + \varepsilon P + \zeta E$$
Where:
- $\alpha D$: Distance minimization coefficient
- $\beta T$: Travel and turnaround duration metric
- $\gamma F$: Fuel and kilowatt-hour energy dissipation
- $\delta L$: SLA tardiness penalty
- $\varepsilon P$: Urgent priority handling multiplier (Emergency medical / cold-chain deliveries)
- $\zeta E$: Carbon equivalent ($CO_2$) emissions factor

---

## ✨ Features

- **Interactive 3D Quantum Parcel Portal**: An immersive 3D floating delivery package rendered in isometric space with mouse parallax, quantum superposition orbital rings, and seamless transition into the command center.
- **Persistent Database & Backend REST API**: Next.js App Router API routes (`/api/orders`, `/api/vehicles`, `/api/routes`, `/api/analytics`, `/api/quantum/optimize`) backed by a persistent file-based JSON database engine (`src/lib/db.ts`).
- **Fully Customizable Order Management**: Full CRUD interface to Create, Edit, Customize priorities (`URGENT`/`HIGH`/`NORMAL`), reassign vehicles, adjust time windows/deadlines, change statuses (`Queued`, `Assigned`, `Out for delivery`, `Delivered`, `Delayed`), and delete orders in real-time.
- **IBM Quantum / Qiskit Integration**: Integrated modal and API backend connecting to IBM Quantum Platform REST API for QAOA QUBO quantum circuits on 127Q Eagle QPUs (`ibm_brisbane`, `ibm_kyoto`, `ibmq_qasm_simulator`, `simulator_statevector`), showing real circuit depth, CNOT count, and convergence metrics.
- **Real Browser Geolocation Intelligence**: Uses the browser's `navigator.geolocation` API to center the operator's command station on their real-world location while preserving 100% privacy (zero cloud storage of precise coordinates).
- **Interactive Leaflet Fleet Map**: High-tech Dark Matter cartography with custom vehicle pins, live driver telemetry, speed indicators, urgent healthcare destination markers, and road congestion zones.
- **Simulated Road Disruption Radar**: Real-time incident injection that flags affected routes and recalculates traffic matrices.
- **Autonomous QAOA Rerouting**: One-click detour execution that bypasses arterial choke points and updates delivery ETAs.
- **Interactive Quantum Parameter Tuner**: Real-time sliders allowing dispatchers to adjust objective weights ($\alpha, \beta, \gamma, \delta, \varepsilon, \zeta$) with live Hamiltonian convergence simulation.
- **Logistics ESG & Carbon Analytics**: Comprehensive Recharts visualizations comparing classical routing baseline costs against QRouteX optimized savings.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript & JavaScript ES6+ |
| **Backend / DB** | Next.js Server REST API Routes + Persistent JSON Database (`src/lib/db.ts`) |
| **Quantum API** | IBM Quantum Platform API & QAOA QUBO Hamiltonian Solver |
| **Styling** | Tailwind CSS & Futuristic Cyber-Glassmorphic Design System |
| **Animations** | Framer Motion & GPU-accelerated CSS 3D Transforms |
| **Icons** | Lucide React |
| **Mapping Engine** | Leaflet & OpenStreetMap / CartoDB Dark Matter |
| **Charts** | Recharts Responsive Analytics |
| **Deployment** | Vercel (Zero-config Edge & Serverless compatibility) |

---

## 🔑 Demo Credentials

| Parameter | Value |
|---|---|
| **Email / User ID** | `admin@qroutex.ai` or `admin` |
| **Password** | `qroutex` |
| **Access Role** | Principal Fleet Operations Administrator |

---

## ⚡ Quick Start & Local Execution

### Prerequisites
- Node.js `v18.17.0` or higher
- npm `v9.0.0` or higher

### Installation & Run

```bash
# 1. Install all dependencies
npm install --legacy-peer-deps

# 2. Launch the development server
npm run dev

# 3. Open in your browser
# Navigate to http://localhost:3000
```

### Production Build Verification

```bash
# Verify type-checking and production compilation
npm run build

# Start production server
npm run start
```

---

## 🚀 Vercel Deployment Instructions

Deploying QRouteX to Vercel takes less than 2 minutes:

### Option A: Deploy via Vercel CLI (Direct)

```bash
# Deploy directly from your project directory
npx vercel

# For production deployment:
npx vercel --prod
```

### Option B: Deploy via Vercel Dashboard

1. Import or connect the folder to Vercel.
2. Select Framework Preset: `Next.js`.
3. Root Directory: `./`.
4. (Optional) Set Environment Variables:
   - `IBM_QUANTUM_API_TOKEN`: *(Optional, for IBM QPU connection)*
   - `NEXT_PUBLIC_MAP_DEFAULT_LAT`: `17.4065`
   - `NEXT_PUBLIC_MAP_DEFAULT_LNG`: `78.4772`
5. Click **Deploy**.

---

<div align="center">
  <sub>Built for mission-critical last-mile logistics. © 2026 QRouteX Systems.</sub>
</div>
