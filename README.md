# 🛡️ SVSharp Frontend

React + TypeScript + Vite frontend for the SVSharp Vulnerability Management Platform.

---

## 🚀 Stack
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite 5
- **Routing:** React Router v6 (HashRouter for GitHub Pages)
- **Charts:** Recharts
- **HTTP:** Axios
- **Deploy:** GitHub Pages (`/front-svsharp/`)

---

## 🔗 Backend API
- **Base URL:** `https://api-svsharp.onrender.com/api`
- Auth via **JWT Bearer** (stored in `localStorage`)

---

## 📂 Structure
```
src/
├── components/         # Shared UI components (SeverityBadge, StatusBadge, Modal, etc.)
├── pages/              # Route-level pages (Dashboard, Assets, AssetDetails, Vulns, Login, Register)
├── services/           # API layer (api.ts, assetService.ts, vulnService.ts, authService.ts)
├── shared/
│   ├── layout/         # AdminLayout, Sidebar, Navbar
│   ├── theme/          # cyberColors.ts design system
│   ├── ResponseModel.ts
│   ├── assetTypes.ts
│   └── vulnTypes.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## ⚡ Local Development
```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## 🏗️ Build & Deploy
```bash
npm run build
# Output: dist/ — deploy to GitHub Pages under /front-svsharp/
```

---

## 🔐 Auth Flow
1. `POST /auth/login` → receives JWT
2. Token stored in `localStorage` as `@SVSharp:token`
3. All protected requests inject `Authorization: Bearer <token>`
4. 401 responses auto-redirect to `/login`
