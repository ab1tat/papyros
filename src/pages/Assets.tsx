import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { assetService } from '../services/assetService'
import type { AssetResponseDTO, AssetCriacaoDTO } from '../shared/assetTypes'
import EnvBadge from '../components/EnvBadge'
import Modal    from '../components/Modal'
import { FormField, Input, Select } from '../components/FormField'

const TIPOS = ['OperatingSystem','WebApplication','Database','API','Network','Other']
const AMBIENTES: ('DEV'|'HML'|'PROD')[] = ['DEV','HML','PROD']

export default function Assets() {
  const [assets, setAssets]     = useState<AssetResponseDTO[]>([])
  const [loading, setLoading]   = useState(true)
  const [searchQ, setSearchQ]   = useState('')
  const [filterEnv, setFilterEnv] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  /* modal states */
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit,   setShowEdit]   = useState(false)
  const [editTarget, setEditTarget] = useState<AssetResponseDTO | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState<AssetResponseDTO | null>(null)

  const [form, setForm] = useState<AssetCriacaoDTO>({ nome: '', tipo: 'WebApplication', ambiente: 'DEV' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try { setAssets(await assetService.listar()) }
    catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = assets.filter(a => {
    const q = searchQ.toLowerCase()
    const matchQ = !q || a.nome.toLowerCase().includes(q) || a.tipo.toLowerCase().includes(q)
    const matchEnv = filterEnv === 'All' || a.ambiente === filterEnv
    const matchSt  = filterStatus === 'All' || (filterStatus === 'Online' ? a.habilitado : !a.habilitado)
    return matchQ && matchEnv && matchSt
  })

  /* CREATE */
  const openCreate = () => { setForm({ nome: '', tipo: 'WebApplication', ambiente: 'DEV' }); setFormError(''); setShowCreate(true) }
  const handleCreate = async () => {
    if (!form.nome.trim()) { setFormError('Name is required.'); return }
    setSaving(true); setFormError('')
    try { await assetService.criar(form); await load(); setShowCreate(false) }
    catch (e: unknown) { setFormError((e as Error).message ?? 'Error creating asset.') }
    finally { setSaving(false) }
  }

  /* EDIT */
  const openEdit = (a: AssetResponseDTO) => {
    setEditTarget(a)
    setForm({ nome: a.nome, tipo: a.tipo, ambiente: a.ambiente })
    setFormError('')
    setShowEdit(true)
  }
  const handleEdit = async () => {
    if (!editTarget) return
    if (!form.nome.trim()) { setFormError('Name is required.'); return }
    setSaving(true); setFormError('')
    try { await assetService.editar(editTarget.id, { ...form, habilitado: editTarget.habilitado }); await load(); setShowEdit(false) }
    catch (e: unknown) { setFormError((e as Error).message ?? 'Error updating asset.') }
    finally { setSaving(false) }
  }

  /* ARCHIVE / RESTORE */
  const confirmArchive = (a: AssetResponseDTO) => { setArchiveTarget(a); setShowConfirm(true) }
  const handleArchive = async () => {
    if (!archiveTarget) return
    try { await assetService.arquivar(archiveTarget.id); await load(); setShowConfirm(false) }
    catch { /* silent */ }
  }
  const handleRestore = async (id: number) => {
    try { await assetService.restaurar(id); await load() }
    catch { /* silent */ }
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2ecf7', margin: 0 }}>Assets</h2>
          <p style={{ fontSize: 12, color: '#7b96b8', margin: '4px 0 0' }}>
            {assets.length} total · {assets.filter(a => a.habilitado).length} online
          </p>
        </div>
        <button onClick={openCreate} style={primaryBtn}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Asset
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#7b96b8' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search assets..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ ...filterSt, paddingLeft: 30, width: '100%' }} />
        </div>
        <select value={filterEnv} onChange={e => setFilterEnv(e.target.value)} style={filterSt}>
          {['All','DEV','HML','PROD'].map(e => <option key={e} value={e}>{e === 'All' ? 'Env: All' : e}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={filterSt}>
          {['All','Online','Offline'].map(s => <option key={s} value={s}>{s === 'All' ? 'Status: All' : s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={tableCard}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a2d4a' }}>
              {['ID','Name','Type','Env','Status','Created','Actions'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3,4].map(i => (
                <tr key={i}>
                  <td colSpan={7} style={{ padding: 12 }}>
                    <div className="skeleton" style={{ height: 18 }} />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#3f5778', fontSize: 13 }}>
                  {assets.length === 0 ? 'No assets found. Create one to get started.' : 'No results match your filters.'}
                </td>
              </tr>
            ) : (
              filtered.map(a => (
                <tr key={a.id} style={trHover}
                  onMouseOver={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,119,182,0.06)')}
                  onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <td style={td}><span style={{ color: '#0096c7', fontWeight: 600, fontSize: 12 }}>#{a.id}</span></td>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: a.habilitado ? 'rgba(6,214,160,0.12)' : 'rgba(100,116,139,0.12)',
                        border: `1px solid ${a.habilitado ? '#06d6a040' : '#64748b40'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, flexShrink: 0,
                      }}>
                        {a.tipo === 'WebApplication' ? '🌐' : a.tipo === 'Database' ? '🗄' : a.tipo === 'API' ? '⚡' : a.tipo === 'Network' ? '🔗' : '💻'}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2ecf7' }}>{a.nome}</div>
                        <div style={{ fontSize: 11, color: '#7b96b8' }}>{a.tipo}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...td, color: '#7b96b8', fontSize: 12 }}>{a.tipo}</td>
                  <td style={td}><EnvBadge ambiente={a.ambiente} /></td>
                  <td style={td}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 12, fontWeight: 600,
                      color: a.habilitado ? '#06d6a0' : '#64748b',
                    }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: a.habilitado ? '#06d6a0' : '#64748b',
                        animation: a.habilitado ? 'pulse 2s infinite' : 'none',
                      }} />
                      {a.habilitado ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td style={{ ...td, color: '#7b96b8', fontSize: 12 }}>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <Link to={`/assets/${a.id}`} style={actionBtn('#0096c7')}>View</Link>
                      <button onClick={() => openEdit(a)} style={actionBtn('#4895ef')}>Edit</button>
                      {a.habilitado
                        ? <button onClick={() => confirmArchive(a)} style={actionBtn('#e63946')}>Archive</button>
                        : <button onClick={() => handleRestore(a.id)} style={actionBtn('#06d6a0')}>Restore</button>
                      }
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal open={showCreate} title="New Asset" onClose={() => setShowCreate(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Name" error={formError}>
            <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Asset name" />
          </FormField>
          <FormField label="Type">
            <Select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as typeof form.tipo })}>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </FormField>
          <FormField label="Environment">
            <Select value={form.ambiente} onChange={e => setForm({ ...form, ambiente: e.target.value as typeof form.ambiente })}>
              {AMBIENTES.map(a => <option key={a} value={a}>{a}</option>)}
            </Select>
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={() => setShowCreate(false)} style={secondaryBtn}>Cancel</button>
            <button onClick={handleCreate} disabled={saving} style={primaryBtn}>{saving ? 'Creating...' : 'Create Asset'}</button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEdit} title={`Edit — ${editTarget?.nome}`} onClose={() => setShowEdit(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Name" error={formError}>
            <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          </FormField>
          <FormField label="Type">
            <Select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as typeof form.tipo })}>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </FormField>
          <FormField label="Environment">
            <Select value={form.ambiente} onChange={e => setForm({ ...form, ambiente: e.target.value as typeof form.ambiente })}>
              {AMBIENTES.map(a => <option key={a} value={a}>{a}</option>)}
            </Select>
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={() => setShowEdit(false)} style={secondaryBtn}>Cancel</button>
            <button onClick={handleEdit} disabled={saving} style={primaryBtn}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      </Modal>

      {/* Confirm Archive */}
      <Modal open={showConfirm} title="Confirm Archive" onClose={() => setShowConfirm(false)} width={380}>
        <p style={{ color: '#7b96b8', fontSize: 13, marginBottom: 20 }}>
          Archive <strong style={{ color: '#e2ecf7' }}>{archiveTarget?.nome}</strong>? It will be hidden from the main list.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setShowConfirm(false)} style={secondaryBtn}>Cancel</button>
          <button onClick={handleArchive} style={{ ...primaryBtn, background: '#e63946' }}>Archive</button>
        </div>
      </Modal>
    </div>
  )
}

const tableCard: React.CSSProperties = {
  background: '#101e35', border: '1px solid #1a2d4a',
  borderRadius: 14, overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
}
const th: React.CSSProperties = {
  padding: '10px 14px', textAlign: 'left',
  fontSize: 11, fontWeight: 600, color: '#7b96b8',
  textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
}
const td: React.CSSProperties = { padding: '12px 14px', fontSize: 13, color: '#e2ecf7' }
const trHover: React.CSSProperties = { borderBottom: '1px solid #1a2d4a', transition: 'background 0.15s' }
const filterSt: React.CSSProperties = {
  padding: '8px 12px', background: '#0a1528',
  border: '1px solid #1a2d4a', borderRadius: 8,
  color: '#7b96b8', fontSize: 12, outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
}
const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '9px 18px',
  background: 'linear-gradient(90deg,#0077b6,#0096c7)',
  border: 'none', borderRadius: 9,
  color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  fontFamily: 'inherit',
}
const secondaryBtn: React.CSSProperties = {
  padding: '9px 16px', background: 'transparent',
  border: '1px solid #1a2d4a', borderRadius: 9,
  color: '#7b96b8', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
}
function actionBtn(color: string): React.CSSProperties {
  return {
    padding: '4px 10px', fontSize: 11, fontWeight: 600,
    background: `${color}15`, border: `1px solid ${color}35`,
    borderRadius: 5, color, cursor: 'pointer', fontFamily: 'inherit',
    transition: 'background 0.15s',
  }
}
