import { useEffect, useState, useCallback } from 'react'
import { vulnService } from '../services/vulnService'
import { assetService } from '../services/assetService'
import type { VulnResponseDTO } from '../shared/vulnTypes'
import type { AssetResponseDTO } from '../shared/assetTypes'
import { getSeverityColor, getSeverityLabel } from '../shared/theme/cyberColors'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts'

const PIE_COLORS = { DEV: '#4895ef', HML: '#06d6a0', PROD: '#0096c7' }
const SEV_COLORS = { Critica: '#e63946', Alta: '#f4a261', Media: '#4895ef', Baixa: '#06d6a0' }

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#101e35', border: '1px solid #1a2d4a',
      borderRadius: 14, padding: '20px 22px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#e2ecf7', margin: '0 0 18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function StatBox({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div style={{
      background: '#0a1528', border: `1px solid ${color}25`,
      borderRadius: 10, padding: '16px 18px',
    }}>
      <div style={{ fontSize: 11, color: '#7b96b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#7b96b8', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0d1a30', border: '1px solid #1a2d4a', borderRadius: 8, padding: '8px 12px' }}>
      <div style={{ color: '#7b96b8', fontSize: 11, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

export default function Reports() {
  const [vulns, setVulns]   = useState<VulnResponseDTO[]>([])
  const [assets, setAssets] = useState<AssetResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [reportDate] = useState(new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }))

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [v, a] = await Promise.all([vulnService.listar(), assetService.listar()])
      setVulns(v); setAssets(a)
    } catch { /* silent */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const sevCounts = [
    { name: 'Crítica', value: vulns.filter(v => v.nivel === 'Critica').length, color: '#e63946' },
    { name: 'Alta',     value: vulns.filter(v => v.nivel === 'Alta').length,    color: '#f4a261' },
    { name: 'Média',    value: vulns.filter(v => v.nivel === 'Media').length,   color: '#4895ef' },
    { name: 'Baixa',    value: vulns.filter(v => v.nivel === 'Baixa').length,   color: '#06d6a0' },
  ]

  const statusCounts = [
    { name: 'Ativa',    value: vulns.filter(v => v.status === 'Ativa').length,     fill: '#e63946' },
    { name: 'Resolvida', value: vulns.filter(v => v.status === 'Resolvida').length, fill: '#06d6a0' },
    { name: 'Arquivada', value: vulns.filter(v => v.status === 'Arquivada').length, fill: '#64748b' },
  ]

  const envAssets = ['DEV','HML','PROD'].map(e => ({
    name: e,
    Ativos: assets.filter(a => a.ambiente === e).length,
    Vulns:  vulns.filter(v => v.ambiente === e).length,
  }))

  const radarData = [
    { subject: 'Crítica',  value: sevCounts[0].value, fullMark: vulns.length || 1 },
    { subject: 'Alta',     value: sevCounts[1].value, fullMark: vulns.length || 1 },
    { subject: 'Média',    value: sevCounts[2].value, fullMark: vulns.length || 1 },
    { subject: 'Baixa',    value: sevCounts[3].value, fullMark: vulns.length || 1 },
    { subject: 'Resolvida', value: statusCounts[1].value, fullMark: vulns.length || 1 },
    { subject: 'Ativa',    value: statusCounts[0].value, fullMark: vulns.length || 1 },
  ]

  const resolvedRate = vulns.length > 0
    ? Math.round((vulns.filter(v => v.status === 'Resolvida').length / vulns.length) * 100)
    : 0

  const criticalRate = vulns.length > 0
    ? Math.round((vulns.filter(v => v.nivel === 'Critica').length / vulns.length) * 100)
    : 0

  const topCritical = vulns
    .filter(v => v.nivel === 'Critica' || v.nivel === 'Alta')
    .sort((a, b) => {
      const order: Record<string, number> = { Critica: 0, Alta: 1, Media: 2, Baixa: 3 }
      return order[a.nivel] - order[b.nivel]
    })
    .slice(0, 5)

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2ecf7', margin: 0 }}>Relatórios de Segurança</h2>
          <p style={{ fontSize: 12, color: '#7b96b8', margin: '4px 0 0' }}>Gerado em: {reportDate}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={load} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid #1a2d4a',
            borderRadius: 9, color: '#7b96b8', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Atualizar
          </button>
          <button onClick={() => window.print()} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px',
            background: 'linear-gradient(90deg,#0077b6,#0096c7)',
            border: 'none', borderRadius: 9,
            color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Exportar PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
        <StatBox label="Total de Vulns"    value={loading ? '…' : vulns.length}   color="#e2ecf7" />
        <StatBox label="Críticas"        value={loading ? '…' : sevCounts[0].value} color="#e63946" sub="Ação imediata" />
        <StatBox label="Total de Ativos"   value={loading ? '…' : assets.length}  color="#4895ef" sub={`${assets.filter(a=>a.habilitado).length} online`} />
        <StatBox label="Taxa de Resolução" value={loading ? '…' : `${resolvedRate}%`} color="#06d6a0" sub="De todas vulns" />
        <StatBox label="Taxa Crítica"      value={loading ? '…' : `${criticalRate}%`} color="#f4a261" sub="De todas vulns" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 18, marginBottom: 18 }}>

        <Card title="Ativos e Vulns por Ambiente">
          {loading ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7b96b8', fontSize: 13 }}>Carregando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={envAssets} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#7b96b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#7b96b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,119,182,0.08)' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#7b96b8' }} />
                <Bar dataKey="Ativos" fill="#4895ef" radius={[4,4,0,0]} />
                <Bar dataKey="Vulns"  fill="#e63946" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Distribuição por Severidade">
          {loading ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7b96b8', fontSize: 13 }}>Carregando...</div>
          ) : vulns.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f5778', fontSize: 13 }}>Sem dados</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sevCounts} cx="50%" cy="45%" outerRadius={70} paddingAngle={3} dataKey="value"
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${Math.round(percent * 100)}%`}
                >
                  {sevCounts.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0d1a30', border: '1px solid #1a2d4a', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Visão Geral de Status">
          {loading ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7b96b8', fontSize: 13 }}>Carregando...</div>
          ) : vulns.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f5778', fontSize: 13 }}>Sem dados</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={statusCounts} cx="50%" cy="50%" outerRadius={60} paddingAngle={3} dataKey="value">
                    {statusCounts.map(e => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d1a30', border: '1px solid #1a2d4a', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {statusCounts.map(s => (
                  <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: s.fill, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#7b96b8' }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#e2ecf7', fontWeight: 600 }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </>)}
        </Card> 
      </div>                                
    </div>
  )
}