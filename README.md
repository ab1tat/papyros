# 🛡️ aBitat Frontend — Visual Intelligence Dashboard

A modern, high-performance web dashboard designed for security professionals to visualize and manage enterprise cybersecurity posture. Built with **React 18**, **TypeScript**, and **Vite**.

---

## 📊 Visual Intelligence (CIO Focus)

The aBitat Dashboard transforms raw vulnerability data into actionable insights through high-fidelity visualizations.

- **Real-time Analytics:** Instant visibility into Critical, High, Medium, and Low severity risks.
- **Asset Distribution:** Environment-based breakdown (DEV, HML, PROD) using interactive Recharts components.
- **Trend Tracking:** Line charts visualizing vulnerability trends over time.
- **Status Monitoring:** Real-time health indicators for IT assets (Online/Offline/Maintenance).

---

## 🛠️ Technical Stack & Performance

- **Core:** React 18 (Functional Components & Hooks).
- **Language:** TypeScript (Strict Mode) for enterprise-grade type safety and reduced runtime errors.
- **Build System:** Vite 5 (Ultra-fast HMR and optimized production bundling).
- **Data Visualization:** Recharts (SVG-based, responsive charts).
- **API Communication:** Axios with centralized Service Layer and interceptors.
- **State Management:** Localized state with `useCallback` and `useEffect` optimizations for minimal re-renders.

---

## 🔐 Security & Integration

1. **JWT Integration:**
   - Secure authentication flow with token persistence in `localStorage`.
   - Automated `Authorization: Bearer` injection in all API requests via a centralized `api.ts` instance.
2. **Type-Safe Mapping:**
   - Automatic synchronization with Backend Enums via shared TypeScript types (`vulnTypes.ts`, `assetTypes.ts`).
   - Case-insensitive data mapping for robust statistics calculation.
3. **Route Protection:**
   - `PrivateRoute` wrapper ensuring only authenticated users can access internal dashboard modules.

---

## 📁 Project Architecture

```
src/
├── components/         # Atomic UI components (Badges, Modals, Forms)
├── pages/              # Complex view modules (Dashboard, AssetDetails, Vulns)
├── services/           # Abstraction layer for Backend communication
├── shared/             # Type definitions, Layouts, and Theme constants
└── shared/theme/       # Design System (Cyberpunk/Dark Mode aesthetic)
```

---

## 🚀 Key Features

### 1. Unified Dashboard
The "Single Pane of Glass" for the organization's security state, featuring high-level KPIs and recent activity.

### 2. Asset Lifecycle Management
Detailed views for each asset, including its associated vulnerability history and connectivity status.
- **Link/Unlink:** Intuitive UI to map vulnerabilities to specific assets.

### 3. Vulnerability Management
Complete CRUD and filtering capabilities for security findings, including search, severity, and status filters.

### 4. Archive & Recovery
Dedicated module for auditing and restoring archived assets or vulnerabilities, ensuring no data loss during lifecycle transitions.

---

## ⚡ Performance Optimizations

- **Tree Shaking:** Minimized bundle size via Vite/Rollup.
- **Skeleton Loading:** Improved Perceived Performance during data fetching.
- **SVG Icons:** Lightweight icons for faster initial load.

---

## 🏗️ Setup & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

**CIO/CTO Note:** *The aBitat Frontend is designed for speed and clarity, providing security teams with the tools they need to respond to threats effectively while maintaining a professional, data-driven interface.*
