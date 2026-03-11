import { HashRouter, Routes, Route, Navigate } from "react-router-dom"; // [CTO] Alterado para HashRouter
import type { ReactNode } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Vulns from "./pages/Vulns";
import AssetDetails from "./pages/AssetDetails";
import AdminLayout from "./shared/layout/AdminLayout";

// Componente de Proteção (CISO)
function PrivateRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("@SVSharp:token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    // [CTO] HashRouter garante que o GitHub Pages não retorne 404 ao atualizar a página
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Grupo Protegido */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assets/:id" element={<AssetDetails />} />
          <Route path="vulnerabilities" element={<Vulns />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}