import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { assetService } from '../services/assetService'
import { vulnService }  from '../services/vulnService'
import type { AssetResponseDTO } from '../shared/assetTypes'
import type { VulnResponseDTO }  from '../shared/vulnTypes'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge   from '../components/StatusBadge'
import EnvBadge      from '../components/EnvBadge'

export default function AssetDetails() {
  const { id } = useParams<{ id: string }>()
  const [asset, setAsset]     = useState<AssetResponseDTO | null>(null)
  const [allVulns, setAllVulns] = useState<VulnResponseDTO[]>([])
  const [linked, setLinked]   = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<number | null>(null)
  const [tab, setTab]         = useState<'linked'|'all'>('linked')
  const [searchQ, setSearchQ] = useState('')
  const [toast, setToast]     = useState<{ msg: string; type: 'success'|'error' } | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [assetRes, vulnsRes] = await Promise.all([
        assetService.buscarPorId(Number(id)),
        vulnService.listar(),
      ])
      setAsset(assetRes)
      setAllVulns(vulnsRes)
      // infer linked from asset.vulnerabilities if backend returns them, else allow re-link freely
      if (assetRes.vulnerabilities) {
        setLinked(new Set(assetRes.vulnerabilities.map(v => v.id)))
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [id])

  useEffect(() => { load() }, [load])

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleLink = async (vulnId: number) => {
    setActionId(vulnId)
    try {
      await assetService.adicionarVuln(Number(id), vulnId)
      setLinked(prev => new Set([...prev, vulnId]))
      showToast('Vulnerability linked successfully.', 'success')
    } catch { showToast('Error linking vulnerability.', 'error') }
    finally { setActionId(null) }
  }

  const handleUnlink = async (vulnId: number) => {
    setActionId(vulnId)
    try {
      await assetService.removerVuln(Number(id), vulnId)
      setLinked(prev => { const s = new Set(prev); s.delete(vulnId); return s })
      showToast('Vulnerability unlinked.', 'success')
    } catch { showToast('Error unlinking vulnerability.', 'error') }
    finally { setActionId(null) }
  }

  const displayed = allVulns.filter(v => {
    const q = searchQ.toLowerCase()
    const matchQ  = !q || v.titulo.toLowerCase().includes(q)
    const matchTab = tab === 'all' || linked.has(v.id)
    return matchQ && matchTab
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ color: '#7b96b8', fontSize: 13 }}>Loading asset data...</div>
    </div>
  )

  if (!asset) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
      <div style={{ color: '#7b96b8', fontSize: 14 }}>Asset not found.</div>
      <Link to="/assets" style={{ color: '#00b4d8', fontSize: 13, marginTop: 12, display: 'inline-block' }}>← Back to Assets</Link>
    </div>
  )

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? 'rgba(6,214,160,0.15)' : 'rgba(230,57,70,0.15)',
          border: `1px solid ${toast.type === 'success' ? '#06d6a040' : '#e6394640'}`,
          borderRadius: 9, padding: '12px 20px',
          color: toast.type === 'success' ? '#06d6a0' : '#e63946',
          fontSize: 13, fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      {/* Back */}
      <Link to="/assets" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#7b96b8', fontSize: 12, marginBottom: 20 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Assets
      </Link>

      {/* Asset header card */}
      <div style={{
        background: '#101e35', border: '1px solid #1a2d4a',
        borderRadius: 14, padding: '22px 26px',
        marginBottom: 22,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 12,
              background: asset.habilitado ? 'rgba(6,214,160,0.12)' : 'rgba(100,116,139,0.12)',
              border: `1px solid ${asset.habilitado ? '#06d6a040' : '#64748b40'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>
              {asset.tipo === 'WebApplication' ? '🌐' : asset.tipo === 'Database' ? '🗄' : asset.tipo === 'API' ? '⚡' : asset.tipo === 'Network' ? '🔗' : '💻'}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2ecf7', margin: '0 0 6px' }}>{asset.nome}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <EnvBadge ambiente={asset.ambiente} />
                <span style={{ fontSize: 11, color: '#7b96b8' }}>#{asset.id}</span>
                <span style={{ fontSize: 11, color: '#7b96b8' }}>{asset.tipo}</span>
                <span style={{ fontSize: 11, color: '#7b96b8' }}>Created {new Date(asset.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 20,
            fontSize: 12, fontWeight: 600,
            background: asset.habilitado ? 'rgba(6,214,160,0.12)' : 'rgba(100,116,139,0.12)',
            border: `1px solid ${asset.habilitado ? '#06d6a040' : '#64748b40'}`,
            color: asset.habilitado ? '#06d6a0' : '#64748b',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor' }} />
            {asset.habilitado ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 20,
          paddingTop: 20, borderTop: '1px solid #1a2d4a',
        }}>
          {[
            { label: 'Linked Vulns', value: linked.size,                                       color: '#e2ecf7' },
            { label: 'Critical',     value: allVulns.filter(v => linked.has(v.id) && v.nivel === 'Critica').length, color: '#e63946' },
            { label: 'High',         value: allVulns.filter(v => linked.has(v.id) && v.nivel === 'Alta').length,    color: '#f4a261' },
            { label: 'Resolved',     value: allVulns.filter(v => linked.has(v.id) && v.status === 'Resolvida').length, color: '#06d6a0' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#7b96b8', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerabilities mapping */}
      <div style={{
        background: '#101e35', border: '1px solid #1a2d4a',
        borderRadius: 14, padding: '20px 22px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e2ecf7', margin: 0 }}>Vulnerabilities Mapping</h3>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', background: '#0a1528', borderRadius: 8, padding: 3, border: '1px solid #1a2d4a' }}>
              {(['linked','all'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
                  background: tab === t ? '#0077b6' : 'transparent',
                  color: tab === t ? '#fff' : '#7b96b8',
                  transition: 'all 0.15s',
                }}>
                  {t === 'linked' ? `Linked (${linked.size})` : `All (${allVulns.length})`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#7b96b8' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search vulnerabilities..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
                style={{ ...filterSt, paddingLeft: 28, width: 200 }} />
            </div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a2d4a' }}>
              {['ID','Title','Severity','Env','Status','Action'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#3f5778', fontSize: 13 }}>
                  {tab === 'linked' ? 'No vulnerabilities linked to this asset yet.' : 'No vulnerabilities found.'}
                </td>
              </tr>
            ) : (
              displayed.map(v => {
                const isLinked = linked.has(v.id)
                const busy = actionId === v.id
                return (
                  <tr key={v.id} style={{ borderBottom: '1px solid #1a2d4a', transition: 'background 0.15s' }}
                    onMouseOver={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,119,182,0.05)')}
                    onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <td style={tdStyle}><span style={{ color: '#0096c7', fontWeight: 600, fontSize: 12 }}>#{v.id}</span></td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#e2ecf7' }}>{v.titulo}</span>
                    </td>
                    <td style={tdStyle}><SeverityBadge nivel={v.nivel} /></td>
                    <td style={tdStyle}><EnvBadge ambiente={v.ambiente} /></td>
                    <td style={tdStyle}><StatusBadge status={v.status} /></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!isLinked ? (
                          <button disabled={busy} onClick={() => handleLink(v.id)} style={{
                            padding: '5px 12px', fontSize: 11, fontWeight: 600,
                            background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.3)',
                            borderRadius: 6, color: '#06d6a0', cursor: busy ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                          }}>
                            {busy ? '...' : '+ Link'}
                          </button>
                        ) : (
                          <button disabled={busy} onClick={() => handleUnlink(v.id)} style={{
                            padding: '5px 12px', fontSize: 11, fontWeight: 600,
                            background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)',
                            borderRadius: 6, color: '#e63946', cursor: busy ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                          }}>
                            {busy ? '...' : '− Unlink'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '10px 14px', textAlign: 'left',
  fontSize: 11, fontWeight: 600, color: '#7b96b8',
  textTransform: 'uppercase', letterSpacing: '0.5px',
}
const tdStyle: React.CSSProperties = { padding: '12px 14px', fontSize: 13, color: '#e2ecf7' }
const filterSt: React.CSSProperties = {
  padding: '7px 12px', background: '#0a1528',
  border: '1px solid #1a2d4a', borderRadius: 8,
  color: '#7b96b8', fontSize: 12, outline: 'none', fontFamily: 'inherit',
}
