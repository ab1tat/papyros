import { Link, useLocation } from "react-router-dom";
import { cyberColors } from "../theme/cyberColors";

/**
 * [CIO] Componente Sidebar Unificado
 * Responsável por toda a navegação vertical do sistema.
 */
export default function Sidebar() {
  const location = useLocation();

  // Função para verificar se a rota atual é a mesma do link
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  const navLinkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: isActive(path) ? 'white' : cyberColors.text.secondary,
    backgroundColor: isActive(path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    borderLeft: isActive(path) ? `4px solid ${cyberColors.severity.medium}` : '4px solid transparent',
    transition: '0.3s',
    marginBottom: '8px',
    fontWeight: isActive(path) ? '600' : '400'
  });

  return (
    <aside style={{ 
      width: '260px', 
      background: '#16213E', 
      borderRight: `1px solid ${cyberColors.border}`, 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Branding - [CTO] Alinhado com a "Fonte da Verdade" */}
      <div style={{ 
        color: cyberColors.severity.medium, 
        fontSize: '22px', 
        fontWeight: 'bold', 
        marginBottom: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px' 
      }}>
        🛡️ SVSharp
      </div>

      {/* Navegação Principal */}
      <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link to="/dashboard" style={navLinkStyle('/dashboard')}>📊 Dashboard</Link>
        <Link to="/assets" style={navLinkStyle('/assets')}>🖥️ Assets</Link>
        <Link to="/vulnerabilities" style={navLinkStyle('/vulnerabilities')}>⚠️ Vulnerabilities</Link>
      </nav>

      {/* Footer da Sidebar - [CISO] Logout Seguro */}
      <button 
        onClick={() => { 
          localStorage.clear(); 
          window.location.href = '#/login'; 
        }}
        style={{ 
          background: 'rgba(239, 68, 68, 0.05)', 
          border: '1px solid rgba(239, 68, 68, 0.2)', 
          color: '#EF4444', 
          cursor: 'pointer', 
          textAlign: 'left', 
          padding: '12px', 
          borderRadius: '8px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: '0.3s'
        }}
      >
        🚪 Sair do Sistema
      </button>
    </aside>
  );
}