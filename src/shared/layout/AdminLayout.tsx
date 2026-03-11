import { Outlet } from "react-router-dom";
import { cyberColors } from "../theme/cyberColors";
import Sidebar from "./Sidebar"; // [CTO] Importando o componente que unificamos

export default function AdminLayout() {
  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      backgroundColor: cyberColors.background,
      fontFamily: "'Inter', sans-serif" 
    }}>
      
      {/* [CIO] Sidebar Lateral fixa para navegação principal */}
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* [CISO] Navbar de Utilitários - Foco em Identidade e Segurança */}
        <header style={{
          height: '60px',
          borderBottom: `1px solid ${cyberColors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 30px',
          backgroundColor: 'rgba(11, 17, 32, 0.8)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: cyberColors.text.secondary, fontSize: '14px' }}>Admin Console</span>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: cyberColors.severity.medium, display: 'flex', 
              alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white',
              boxShadow: `0 0 10px ${cyberColors.severity.medium}44`
            }}>A</div>
          </div>
        </header>

        {/* [CTO] Área de Conteúdo - Onde as páginas (Dashboard, Assets) são renderizadas */}
        <main style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '40px',
          background: `radial-gradient(circle at top right, ${cyberColors.card}55, transparent)` 
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}