import { useEffect, useState, useCallback } from 'react'
import { vulnService } from '../services/vulnService'
import { assetService } from '../services/assetService'
import type { VulnResponseDTO } from '../shared/vulnTypes'
import type { AssetResponseDTO } from '../shared/assetTypes'
import { getSeverityColor } from '../shared/theme/cyberColors'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts'

// Configuração de Cores Silicon Valley Style
const PIE_COLORS = ['#e63946', '#f4a261', '#4895ef', '#06d6a0']

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#101e35', border: '1px solid #1a2d4a',
      borderRadius: 14, padding: '20px', marginBottom: '20px'
    }}>
      <h3 style={{ fontSize: 13, color: '#e2ecf7', marginBottom: '18px', textTransform: 'uppercase' }}>{title}</h3>
      {children}
    </div>
  )
}

export default function Reports() {
  const [vulns, setVulns] = useState<VulnResponseDTO[]>([])
  const [assets, setAssets] = useState<AssetResponseDTO[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [v, a] = await Promise.all([vulnService.listar(), assetService.listar()])
      setVulns(v); setAssets(a)
    } catch (err) {
      console.error("Erro ao carregar dados do relatório", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Processamento de dados para os gráficos
  const sevData = [
    { name: 'Crítica', value: vulns.filter(v => v.nivel === 'Critica').length },
    { name: 'Alta', value: vulns.filter(v => v.nivel === 'Alta').length },
    { name: 'Média', value: vulns.filter(v => v.nivel === 'Media').length },
    { name: 'Baixa', value: vulns.filter(v => v.nivel === 'Baixa').length },
  ]

  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Carregando Relatórios...</div>

  return (
    <div style={{ padding: '20px', backgroundColor: '#050b19', minHeight: '100vh' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Dashboard de Vulnerabilidades</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card title="Distribuição por Severidade">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sevData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {sevData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Análise de Risco (Radar)">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={sevData}>
              <PolarGrid stroke="#1a2d4a" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#7b96b8', fontSize: 12 }} />
              <Radar name="Vulnerabilidades" dataKey="value" stroke="#4895ef" fill="#4895ef" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Ativos vs Vulnerabilidades">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sevData}>
              <XAxis dataKey="name" tick={{ fill: '#7b96b8' }} />
              <YAxis tick={{ fill: '#7b96b8' }} />
              <Tooltip cursor={{ fill: '#1a2d4a' }} />
              <Bar dataKey="value" fill="#0096c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Resumo Geral">
          <div style={{ color: '#e2ecf7' }}>
            <p>Total de Ativos: <strong>{assets.length}</strong></p>
            <p>Total de Vulnerabilidades: <strong>{vulns.length}</strong></p>
            <p>Ação Recomendada: <span style={{ color: '#e63946' }}>Priorizar Correções Críticas</span></p>
          </div>
        </Card>
      </div>
    </div>
  )
}