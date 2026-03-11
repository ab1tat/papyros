import { cyberColors } from "../theme/cyberColors";

// [CIO] Transformamos o Navbar em uma "Utility Bar" (Barra de utilitários)
// Removemos os links de navegação daqui, pois eles já estão na Sidebar.
export default function Navbar() {
  return (
    <header style={{
      height: '64px',
      backgroundColor: 'rgba(11, 17, 32, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${cyberColors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Lado Esquerdo: Breadcrumb ou Título da Página Atual */}
      <div style={{ color: cyberColors.text.secondary, fontSize: '14px', fontWeight: '500' }}>
        System / <span style={{ color: 'white' }}>Overview</span>
      </div>

      {/* Lado Direito: Perfil e Alertas (Visão CISO) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Admin User</div>
          <div style={{ color: cyberColors.status.online, fontSize: '12px' }}>● Connected</div>
        </div>
        
        <div style={{ 
          width: '38px', 
          height: '38px', 
          borderRadius: '10px', 
          background: cyberColors.severity.medium,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          boxShadow: `0 0 15px ${cyberColors.severity.medium}44`
        }}>
          👤
        </div>
      </div>
    </header>
  );
}