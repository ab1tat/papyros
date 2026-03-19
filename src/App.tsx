import { Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import Login        from './pages/Login'
import Register     from './pages/Register'
import Dashboard    from './pages/Dashboard'
import Assets       from './pages/Assets'
import AssetDetails from './pages/AssetDetails'
import Vulns        from './pages/Vulns'
import Archived     from './pages/Archived'
import Reports      from './pages/Reports'
import Settings     from './pages/Settings'
import AdminLayout  from './shared/layout/AdminLayout'

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('@SVSharp:token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index                  element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"       element={<Dashboard />} />
        <Route path="assets"          element={<Assets />} />
        <Route path="assets/:id"      element={<AssetDetails />} />
        <Route path="vulns"           element={<Vulns />} />
        <Route path="archived"        element={<Archived />} />
        <Route path="reports"         element={<Reports />} />
        <Route path="settings"        element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
