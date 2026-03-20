import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts'
import { vulnService } from '../services/vulnService'
import { assetService } from '../services/assetService'
import type { VulnResponseDTO } from '../shared/vulnTypes'
import type { AssetResponseDTO } from '../shared/assetTypes'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge   from '../components/StatusBadge'

/* ── helpers ── */
function getSevColor(nivel: string) {
  return { Critica: '#e63946', Alta: '#f4a261', Media: '#4895ef', Baixa: '#06d6a0' }[nivel] ?? '#7b96b8'
}

/* ── mini bar sparkline ── */
function Sparkline({ color }: { color: string }) {
  const bars = [3, 5, 2, 6, 4, 7, 5]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 24 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 5, height: `${h * 3}px`,
          background: color, opacity: 0.6 + i * 0.05,
          borderRadius: 2,
        }} />
      ))}
    </div>
  )
}

/* ── severity card ── */
function SevCard({ label, value, color, bg, icon }: {
  label: string; value: number; color: string; bg: string; icon: string
}) {
  return (
    <div style={{
      background: '#101e35',
      border: `1px solid ${color}30`,
      borderRadius: 12,
      padding: '18px 20px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseOver={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}25`)}
    onMouseOut={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${bg} 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ color, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        </div>
        <Sparkline color={color} />
      </div>
      <div style={{ fontSize: 38, fontWeight: 800, color: '#e2ecf7', lineHeight: 1 }}>{value}</div>
    </div>
  )
}

/* ── tooltip for recharts ── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0d1a30', border: '1px solid #1a2d4a', borderRadius: 8, padding: '8px 12px' }}>
      <div style={{ color: '#7b96b8', fontSize: 11, marginBottom: 4 }}>Day {label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

const PIE_COLORS = { DEV: '#4895ef', HML: '#06d6a0', PROD: '#0096c7' }

export default function Dashboard() {
  const navigate = useNavigate()
  const [vulns, setVulns]   = useState<VulnResponseDTO[]>([])
  const [assets, setAssets] = useState<AssetResponseDTO[]>([])
  const [archivedCount, setArchivedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQ, setSearchQ] = useState('')
  const [filterSev, setFilterSev] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [v, a, arq] = await Promise.all([
        vulnService.listar(), 
        assetService.listar(),
        assetService.listarArquivados().catch(() => []) // Handle potential error if endpoint fails
      ])
      setVulns(v)
      setAssets(a)
      setArchivedCount(arq.length)
    } catch (err) { 
      console.error('Failed to load dashboard data', err)
    } finally { 
      setLoading(false) 
    }
  }, [])

  useEffect(() => { load() }, [load])

  const stats = {
    critical: vulns.filter(v => v.nivel === 'Critica').length,
    high:     vulns.filter(v => v.nivel === 'Alta').length,
    medium:   vulns.filter(v => v.nivel === 'Media').length,
    low:      vulns.filter(v => v.nivel === 'Baixa').length,
  }

  /* asset distribution pie */
  const assetDist = ['DEV', 'HML', 'PROD'].map(env => ({
    name: env,
    value: assets.filter(a => a.ambiente === env).length,
  })).filter(d => d.value > 0)

  /* active assets sidebar */
  const online      = assets.filter(a => a.habilitado).length
  const maintenance = assets.filter(a => !a.habilitado).length

  /* fake line chart data based on actual vuln counts, spread over days */
  const lineData = [6, 12, 18, 19, 21, 22, 30].map((day, i) => ({
    day,
    Critical: Math.round(stats.critical * (0.3 + i * 0.1)),
    High:     Math.round(stats.high     * (0.4 + i * 0.08)),
    Medium:   Math.round(stats.medium   * (0.2 + i * 0.12)),
  }))

  /* recent vulns table */
  const recentVulns = vulns
    .filter(v => {
      const q = searchQ.toLowerCase()
      const matchQ = !q || v.titulo.toLowerCase().includes(q) || String(v.id).includes(q)
      const matchSev = filterSev === 'All' || v.nivel === filterSev
      const matchSt  = filterStatus === 'All' || v.status === filterStatus
      return matchQ && matchSev && matchSt
    })
    .slice(0, 5)

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>

      {/* ── severity cards row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 24 }}>
        <SevCard label="Critical" value={stats.critical} color="#e63946" bg="rgba(230,57,70,0.08)" icon="🚨" />
        <SevCard label="High"     value={stats.high}     color="#f4a261" bg="rgba(244,162,97,0.08)" icon="⚠️" />
        <SevCard label="Medium"   value={stats.medium}   color="#4895ef" bg="rgba(72,149,239,0.08)" icon="ℹ️" />
        <SevCard label="Low"      value={stats.low}      color="#06d6a0" bg="rgba(6,214,160,0.08)"  icon="✅" />
      </div>

      {/* ── charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 24 }}>

        {/* Line chart */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={cardTitle}>Vulnerabilities Overview</h3>
          </div>
          {loading ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7b96b8', fontSize: 13 }}>
              Loading data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fill: '#7b96b8', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Days', position: 'insideBottom', offset: -2, fill: '#7b96b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#7b96b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#7b96b8', paddingTop: 8 }} />
                <Line type="monotone" dataKey="Critical" stroke="#e63946" strokeWidth={2} dot={{ fill: '#e63946', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="High"     stroke="#f4a261" strokeWidth={2} dot={{ fill: '#f4a261', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Medium"   stroke="#4895ef" strokeWidth={2} dot={{ fill: '#4895ef', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart */}
        <div style={card}>
          <h3 style={{ ...cardTitle, marginBottom: 10 }}>Asset Distribution</h3>
          {loading ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7b96b8', fontSize: 13 }}>Loading...</div>
          ) : assetDist.length === 0 ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f5778', fontSize: 13 }}>No assets registered</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ResponsiveContainer width={180} height={200}>
                <PieChart>
                  <Pie
                    data={assetDist}
                    cx="50%" cy="50%"
                    innerRadius={52} outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${Math.round(percent * 100)}%`}
                    labelLine={false}
                  >
                    {assetDist.map(entry => (
                      <Cell key={entry.name} fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS] ?? '#7b96b8'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d1a30', border: '1px solid #1a2d4a', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(PIE_COLORS).map(([env, color]) => (
                  <div key={env} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#7b96b8' }}>{env}</span>
                    <span style={{ fontSize: 12, color: '#e2ecf7', fontWeight: 600, marginLeft: 4 }}>
                      {assets.filter(a => a.ambiente === env).length}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: 8, borderTop: '1px solid #1a2d4a', paddingTop: 8 }}>
                  <div style={{ fontSize: 11, color: '#7b96b8' }}>Total Assets</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#e2ecf7' }}>{assets.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── bottom row: recent vulns + active assets ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 18 }}>

        {/* Recent Vulnerabilities table */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            <h3 style={cardTitle}>Recent Vulnerabilities</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                style={filterSt}
              >
                {['All','Ativa','Resolvida','Arquivada'].map(s => (
                  <option key={s} value={s}>{s === 'All' ? 'Status: All' : s}</option>
                ))}
              </select>

              {/* Severity filter */}
              <select
                value={filterSev}
                onChange={e => setFilterSev(e.target.value)}
                style={filterSt}
              >
                {['All','Critica','Alta','Media','Baixa'].map(s => (
                  <option key={s} value={s}>{s === 'All' ? 'Severity: All' : s}</option>
                ))}
              </select>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#7b96b8' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  placeholder="Search..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  style={{ ...filterSt, paddingLeft: 28, width: 140 }}
                />
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a2d4a' }}>
                {['ID','Name','Severity','Asset','Status',''].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#7b96b8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i}>
                    <td colSpan={6} style={{ padding: '12px' }}>
                      <div className="skeleton" style={{ height: 18, width: '100%' }} />
                    </td>
                  </tr>
                ))
              ) : recentVulns.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '28px', textAlign: 'center', color: '#3f5778', fontSize: 13 }}>
                    {vulns.length === 0 ? 'No vulnerabilities registered.' : 'No results found for the current filters.'}
                  </td>
                </tr>
              ) : (
                recentVulns.map(v => (
                  <tr
                    key={v.id}
                    style={{ borderBottom: '1px solid #1a2d4a', transition: 'background 0.15s' }}
                    onMouseOver={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,119,182,0.06)')}
                    onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <td style={td}>
                      <span style={{ color: getSevColor(v.nivel), fontWeight: 600, fontSize: 12 }}>#{v.id}</span>
                    </td>
                    <td style={{ ...td, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: `${getSevColor(v.nivel)}20`,
                        border: `1px solid ${getSevColor(v.nivel)}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: getSevColor(v.nivel) }} />
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#e2ecf7' }}>{v.titulo}</span>
                    </td>
                    <td style={td}><SeverityBadge nivel={v.nivel} /></td>
                    <td style={{ ...td, color: '#7b96b8', fontSize: 12 }}>{v.ambiente}</td>
                    <td style={td}><StatusBadge status={v.status} /></td>
                    <td style={td}>
                      <button 
                        onClick={() => navigate('/vulns')}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#7b96b8', padding: '4px 6px', borderRadius: 4,
                          fontSize: 14, display: 'flex', gap: 2,
                        }}
                        title="View Details"
                      >
                        ···
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {vulns.length > 5 && (
            <div style={{ padding: '14px 12px 0', textAlign: 'right' }}>
              <Link to="/vulns" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#00b4d8', fontSize: 12, fontWeight: 500,
                padding: '7px 16px',
                border: '1px solid rgba(0,180,216,0.3)',
                borderRadius: 7,
                transition: 'background 0.15s',
              }}>
                View All <span>›</span>
              </Link>
            </div>
          )}
        </div>

        {/* Active Assets sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={card}>
            <h3 style={{ ...cardTitle, marginBottom: 16 }}>Active Assets</h3>
            {[
              { label: 'Online',      count: online,          color: '#06d6a0' },
              { label: 'Maintenance', count: maintenance,     color: '#f4a261' },
              { label: 'Archived',    count: archivedCount,   color: '#64748b' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #1a2d4a',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                  <span style={{ fontSize: 13, color: '#7b96b8' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: item.color }}>{item.count}</span>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <Link to="/assets" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '9px',
                background: 'rgba(0,119,182,0.12)',
                border: '1px solid rgba(0,119,182,0.25)',
                borderRadius: 8, color: '#00b4d8', fontSize: 12, fontWeight: 500,
              }}>
                Manage Assets ›
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div style={card}>
            <h3 style={{ ...cardTitle, marginBottom: 14 }}>Quick Stats</h3>
            {[
              { label: 'Total Vulns',   value: vulns.length,                          color: '#e2ecf7' },
              { label: 'Active',        value: vulns.filter(v => v.status === 'Ativa').length,     color: '#06d6a0' },
              { label: 'Resolved',      value: vulns.filter(v => v.status === 'Resolvida').length, color: '#4895ef' },
              { label: 'Total Assets',  value: assets.length,                         color: '#e2ecf7' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #1a2d4a',
              }}>
                <span style={{ fontSize: 12, color: '#7b96b8' }}>{s.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{loading ? '...' : s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const card: React.CSSProperties = {
  background: '#101e35',
  border: '1px solid #1a2d4a',
  borderRadius: 14,
  padding: '20px 22px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
}

const cardTitle: React.CSSProperties = {
  fontSize: 14, fontWeight: 700, color: '#e2ecf7', margin: 0,
}

const td: React.CSSProperties = {
  padding: '11px 12px', fontSize: 13, color: '#e2ecf7',
}

const filterSt: React.CSSProperties = {
  padding: '6px 10px',
  background: '#0a1528',
  border: '1px solid #1a2d4a',
  borderRadius: 7,
  color: '#7b96b8',
  fontSize: 12,
  outline: 'none',
  fontFamily: 'inherit',
  cursor: 'pointer',
}
