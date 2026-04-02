import { useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import logoSword from '../assets/logo.png'

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/assets':     'Assets',
  '/vulns':      'Vulnerabilities',
  '/reports':    'Reports',
  '/settings':   'Settings',
}

function usePageTitle(): string {
  const { pathname } = useLocation()
  if (pathname.startsWith('/assets/')) return 'Asset Details'
  return ROUTE_LABELS[pathname] ?? 'Dashboard'
}

export default function Navbar() {
  const title    = usePageTitle()
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <header style={{
      height: 62,
      background: 'rgba(9,16,34,0.92)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid #1a2d4a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2ecf7', margin: 0, letterSpacing: '0.3px' }}>
        {title}
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={iconBtnStyle} title="Notifications">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', background: '#e63946', border: '1px solid #091022' }} />
        </button>

        <button style={iconBtnStyle} title="Alerts">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
        </button>

        <button style={iconBtnStyle} title="System status">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#06d6a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </button>

        <div style={{ width: 1, height: 26, background: '#1a2d4a', margin: '0 4px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e2ecf7', lineHeight: 1.3 }}>Admin</div>
            <div style={{ fontSize: 10, color: '#06d6a0', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#06d6a0', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Connected
            </div>
          </div>
          <button onClick={handleLogout} title="Logout" style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 3px 10px rgba(0,119,182,0.4)',
            transition: 'transform 0.15s', flexShrink: 0,
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.07)' }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >👤</button>
        </div>
      </div>
    </header>
  )
}

const iconBtnStyle: React.CSSProperties = {
  position: 'relative', width: 34, height: 34,
  borderRadius: 8, background: 'rgba(255,255,255,0.04)',
  border: '1px solid #1a2d4a', cursor: 'pointer', color: '#7b96b8',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.15s', flexShrink: 0,
}
