import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'

const NAV = [
  {
    path: '/dashboard', label: 'Dashboard',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    path: '/assets', label: 'Assets',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="5" rx="2"/><rect x="2" y="13" width="20" height="5" rx="2"/><circle cx="6" cy="8.5" r="1" fill="currentColor"/><circle cx="6" cy="15.5" r="1" fill="currentColor"/></svg>,
  },
  {
    path: '/vulns', label: 'Vulnerabilities',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="15" r="0.5" fill="currentColor"/></svg>,
  },
  {
    path: '/reports', label: 'Reports',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    path: '/settings', label: 'Settings',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0M19.07 19.07a10 10 0 0 0 0-14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate  = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#091022',
      borderRight: '1px solid #1a2d4a',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      zIndex: 200,
    }}>
      {/* ── Logo ── */}
      <div style={{
        padding: '22px 18px 18px',
        borderBottom: '1px solid #1a2d4a',
        display: 'flex', alignItems: 'center', gap: 11,
      }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px rgba(0,180,216,0.45)',
          flexShrink: 0,
        }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#e2ecf7', letterSpacing: '2px', lineHeight: 1.1 }}>SV</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#00b4d8', letterSpacing: '2.5px', lineHeight: 1.1 }}>SHARP</div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
        {NAV.map(item => {
          const active = location.pathname === item.path
            || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'))
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 12px',
                borderRadius: 9,
                textDecoration: 'none',
                fontWeight: active ? 600 : 400,
                fontSize: 13,
                transition: 'all 0.15s',
                color: active ? '#e2ecf7' : '#6b87a8',
                background: active ? 'rgba(0,119,182,0.18)' : 'transparent',
                borderLeft: active ? '2px solid #00b4d8' : '2px solid transparent',
              }}
              onMouseOver={e => {
                if (!active)(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseOut={e => {
                if (!active)(e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              <span style={{ color: active ? '#00b4d8' : '#6b87a8', flexShrink: 0, display: 'flex', transition: 'color 0.15s' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* ── User / Logout ── */}
      <div style={{ padding: '14px 14px 18px', borderTop: '1px solid #1a2d4a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #0077b6, #023e8a)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 15,
          }}>👤</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e2ecf7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</div>
            <div style={{ fontSize: 10, color: '#7b96b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>admin@example.com</div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#7b96b8', display: 'flex', alignItems: 'center',
              padding: 4, borderRadius: 5, transition: 'color 0.15s',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#e63946')}
            onMouseOut={e => (e.currentTarget.style.color = '#7b96b8')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
