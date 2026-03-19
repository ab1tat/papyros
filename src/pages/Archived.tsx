import { useEffect, useState, useCallback } from 'react'
import { assetService } from '../services/assetService'
import { vulnService } from '../services/vulnService'
import type { AssetResponseDTO } from '../shared/assetTypes'
import type { VulnResponseDTO } from '../shared/vulnTypes'
import EnvBadge from '../components/EnvBadge'

export default function Archived() {
  const [assets, setAssets] = useState<AssetResponseDTO[]>([])
  const [vulns, setVulns] = useState<VulnResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'assets' | 'vulns'>('assets')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [archivedAssets, archivedVulns] = await Promise.all([
        assetService.listarArquivados(),
        vulnService.listarArquivados()
      ])
      setAssets(archivedAssets)
      setVulns(archivedVulns)
    } catch (e) {
      console.error("Erro ao carregar arquivados:", e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleRestoreAsset = async (id: number) => {
    try {
      await assetService.restaurar(id)
      await load()
    } catch (e) {
      alert("Erro ao restaurar ativo")
    }
  }

  const handleRestoreVuln = async (id: number) => {
    try {
      await vulnService.restaurar(id)
      await load()
    } catch (e) {
      alert("Erro ao restaurar vulnerabilidade")
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2ecf7', margin: 0 }}>Arquivos</h2>
        <p style={{ fontSize: 12, color: '#7b96b8', margin: '4px 0 0' }}>
          Gerencie itens removidos do painel principal
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button 
          onClick={() => setActiveTab('assets')}
          style={activeTab === 'assets' ? activeTabBtn : inactiveTabBtn}
        >
          Assets ({assets.length})
        </button>
        <button 
          onClick={() => setActiveTab('vulns')}
          style={activeTab === 'vulns' ? activeTabBtn : inactiveTabBtn}
        >
          Vulnerabilidades ({vulns.length})
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#7b96b8' }}>Carregando arquivo...</p>
      ) : (
        <div style={tableContainer}>
          {activeTab === 'assets' ? (
            <table style={tableStyle}>
              <thead>
                <tr style={headerRow}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>NOME</th>
                  <th style={thStyle}>TIPO</th>
                  <th style={thStyle}>AMBIENTE</th>
                  <th style={thLastStyle}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 ? (
                  <tr><td colSpan={5} style={emptyCell}>Nenhum ativo arquivado</td></tr>
                ) : (
                  assets.map(a => (
                    <tr key={a.id} style={trStyle}>
                      <td style={tdIdStyle}>#{a.id}</td>
                      <td style={tdStyle}>{a.nome}</td>
                      <td style={tdStyle}>{a.tipo}</td>
                      <td style={tdStyle}><EnvBadge env={a.ambiente} /></td>
                      <td style={tdLastStyle}>
                        <button onClick={() => handleRestoreAsset(a.id)} style={restoreBtn}>Restaurar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={headerRow}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>TÍTULO</th>
                  <th style={thStyle}>NÍVEL</th>
                  <th style={thStyle}>AMBIENTE</th>
                  <th style={thLastStyle}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {vulns.length === 0 ? (
                  <tr><td colSpan={5} style={emptyCell}>Nenhuma vulnerabilidade arquivada</td></tr>
                ) : (
                  vulns.map(v => (
                    <tr key={v.id} style={trStyle}>
                      <td style={tdIdStyle}>#{v.id}</td>
                      <td style={tdStyle}>{v.titulo}</td>
                      <td style={tdStyle}>{v.nivel}</td>
                      <td style={tdStyle}><EnvBadge env={v.ambiente} /></td>
                      <td style={tdLastStyle}>
                        <button onClick={() => handleRestoreVuln(v.id)} style={restoreBtn}>Restaurar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

// Estilos baseados no padrão do projeto
const activeTabBtn: React.CSSProperties = {
  background: 'rgba(56, 189, 248, 0.15)',
  color: '#38bdf8',
  border: '1px solid rgba(56, 189, 248, 0.3)',
  padding: '8px 16px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600
}

const inactiveTabBtn: React.CSSProperties = {
  background: 'transparent',
  color: '#7b96b8',
  border: '1px solid transparent',
  padding: '8px 16px',
  borderRadius: 8,
  cursor: 'pointer'
}

const tableContainer: React.CSSProperties = {
  background: '#111827',
  borderRadius: 12,
  border: '1px solid #1f2937',
  overflow: 'hidden'
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
const headerRow: React.CSSProperties = { background: '#1f2937' }
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', fontSize: 11, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em' }
const thLastStyle: React.CSSProperties = { ...thStyle, textAlign: 'right' }
const trStyle: React.CSSProperties = { borderTop: '1px solid #1f2937' }
const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 13, color: '#e5e7eb' }
const tdIdStyle: React.CSSProperties = { ...tdStyle, color: '#38bdf8', fontWeight: 600, fontFamily: 'monospace' }
const tdLastStyle: React.CSSProperties = { ...tdStyle, textAlign: 'right' }
const emptyCell: React.CSSProperties = { padding: 32, textAlign: 'center', color: '#7b96b8', fontSize: 13 }

const restoreBtn: React.CSSProperties = {
  background: 'rgba(16, 185, 129, 0.1)',
  color: '#10b981',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  padding: '6px 12px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600
}
