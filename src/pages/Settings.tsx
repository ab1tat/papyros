import { useState } from 'react'

interface SettingSection {
  title: string
  items: SettingItem[]
}
interface SettingItem {
  label: string
  description: string
  type: 'toggle' | 'input' | 'select'
  key: string
  options?: string[]
}

const SECTIONS: SettingSection[] = [
  {
    title: 'Security',
    items: [
      { label: 'Two-Factor Authentication', description: 'Require 2FA for all logins', type: 'toggle', key: '2fa' },
      { label: 'Session Timeout', description: 'Auto-logout after inactivity (minutes)', type: 'input', key: 'timeout' },
      { label: 'JWT Token Expiry', description: 'Token expiration period', type: 'select', key: 'jwt_exp', options: ['1h','4h','8h','24h','48h'] },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { label: 'Critical Alerts', description: 'Notify on new Critical vulnerabilities', type: 'toggle', key: 'notif_critical' },
      { label: 'Weekly Summary', description: 'Receive weekly security digest', type: 'toggle', key: 'notif_weekly' },
      { label: 'Asset Status Changes', description: 'Alert when assets go offline', type: 'toggle', key: 'notif_assets' },
    ],
  },
  {
    title: 'API',
    items: [
      { label: 'API Base URL', description: 'Backend API endpoint', type: 'input', key: 'api_url' },
      { label: 'Request Timeout', description: 'HTTP timeout in milliseconds', type: 'input', key: 'api_timeout' },
    ],
  },
  {
    title: 'Display',
    items: [
      { label: 'Items per Page', description: 'Default rows in tables', type: 'select', key: 'page_size', options: ['10','25','50','100'] },
      { label: 'Date Format', description: 'Date display format', type: 'select', key: 'date_fmt', options: ['MM/DD/YYYY','DD/MM/YYYY','YYYY-MM-DD'] },
      { label: 'Compact Mode', description: 'Reduce padding in tables', type: 'toggle', key: 'compact' },
    ],
  },
]

export default function Settings() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    '2fa': false, notif_critical: true, notif_weekly: false, notif_assets: true, compact: false,
  })
  const [inputs, setInputs] = useState<Record<string, string>>({
    timeout: '60', api_url: 'https://rapsodia.onrender.com/api', api_timeout: '60000',
  })
  const [selects, setSelects] = useState<Record<string, string>>({
    jwt_exp: '8h', page_size: '25', date_fmt: 'DD/MM/YYYY',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out', maxWidth: 760 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2ecf7', margin: 0 }}>Settings</h2>
          <p style={{ fontSize: 12, color: '#7b96b8', margin: '4px 0 0' }}>Platform configuration and preferences</p>
        </div>
        <button onClick={handleSave} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '9px 20px',
          background: saved ? 'linear-gradient(90deg,#06d6a0,#059e77)' : 'linear-gradient(90deg,#0077b6,#0096c7)',
          border: 'none', borderRadius: 9,
          color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background 0.3s',
        }}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SECTIONS.map(section => (
          <div key={section.title} style={{
            background: '#101e35', border: '1px solid #1a2d4a',
            borderRadius: 14, overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            {/* Section header */}
            <div style={{
              padding: '14px 22px',
              borderBottom: '1px solid #1a2d4a',
              background: 'rgba(0,119,182,0.05)',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {section.title}
              </span>
            </div>

            {/* Items */}
            {section.items.map((item, i) => (
              <div key={item.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 22px',
                borderBottom: i < section.items.length - 1 ? '1px solid #1a2d4a' : 'none',
                gap: 16,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#e2ecf7', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#7b96b8' }}>{item.description}</div>
                </div>

                {item.type === 'toggle' && (
                  <div
                    onClick={() => setToggles(t => ({ ...t, [item.key]: !t[item.key] }))}
                    style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: toggles[item.key] ? '#0077b6' : '#1a2d4a',
                      cursor: 'pointer', position: 'relative',
                      transition: 'background 0.2s', flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 3,
                      left: toggles[item.key] ? 23 : 3,
                      width: 18, height: 18, borderRadius: '50%',
                      background: toggles[item.key] ? '#fff' : '#64748b',
                      transition: 'left 0.2s, background 0.2s',
                      boxShadow: toggles[item.key] ? '0 0 6px rgba(0,119,182,0.6)' : 'none',
                    }} />
                  </div>
                )}

                {item.type === 'input' && (
                  <input
                    value={inputs[item.key] ?? ''}
                    onChange={e => setInputs(p => ({ ...p, [item.key]: e.target.value }))}
                    style={{
                      padding: '7px 12px', width: 200,
                      background: '#060e1f', border: '1px solid #1a2d4a',
                      borderRadius: 8, color: '#e2ecf7', fontSize: 12,
                      outline: 'none', fontFamily: 'inherit', flexShrink: 0,
                    }}
                    onFocus={e => (e.target.style.borderColor = '#0077b6')}
                    onBlur={e => (e.target.style.borderColor = '#1a2d4a')}
                  />
                )}

                {item.type === 'select' && (
                  <select
                    value={selects[item.key] ?? ''}
                    onChange={e => setSelects(p => ({ ...p, [item.key]: e.target.value }))}
                    style={{
                      padding: '7px 12px', width: 130,
                      background: '#060e1f', border: '1px solid #1a2d4a',
                      borderRadius: 8, color: '#e2ecf7', fontSize: 12,
                      outline: 'none', fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {item.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* About card */}
        <div style={{
          background: '#101e35', border: '1px solid #1a2d4a',
          borderRadius: 14, padding: '20px 22px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>
            About
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Platform',   value: 'aBitat v1.0' },
              { label: 'Framework',  value: 'React 18 + Vite' },
              { label: 'Backend',    value: '.NET 8 / ASP.NET Core' },
              { label: 'Database',   value: 'PostgreSQL (Render)' },
              { label: 'Auth',       value: 'JWT Bearer' },
              { label: 'Hosting',    value: 'GitHub Pages + Render' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a2d4a' }}>
                <span style={{ fontSize: 12, color: '#7b96b8' }}>{r.label}</span>
                <span style={{ fontSize: 12, color: '#e2ecf7', fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
