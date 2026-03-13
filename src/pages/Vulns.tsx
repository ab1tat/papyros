import { useEffect, useState, useCallback } from 'react'
import { vulnService } from '../services/vulnService'
import type { VulnResponseDTO, VulnCriacaoDTO, EditarVulnDTO } from '../shared/vulnTypes'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge   from '../components/StatusBadge'
import EnvBadge      from '../components/EnvBadge'
import Modal         from '../components/Modal'
import { FormField, Input, Select } from '../components/FormField'

const AMBIENTES: ('DEV'|'HML'|'PROD')[] = ['DEV','HML','PROD']
const NIVEIS: VulnCriacaoDTO['nivel'][]  = ['Baixa','Media','Alta','Critica']
const STATUS_OPTS: VulnCriacaoDTO['status'][] = ['Ativa','Resolvida','Arquivada']

export default function Vulns() {
  const [vulns, setVulns]     = useState<VulnResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQ, setSearchQ] = useState('')
  const [filterSev, setFilterSev]     = useState('All')
  const [filterEnv, setFilterEnv]     = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  /* modals */
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit,   setShowEdit]   = useState(false)
  const [editTarget, setEditTarget] = useState<VulnResponseDTO | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState<VulnResponseDTO | null>(null)

  const [form, setForm]     = useState<VulnCriacaoDTO>({ titulo: '', ambiente: 'DEV', nivel: 'Media', status: 'Ativa' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null)

  const showToastMsg = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try { setVulns(await vulnService.listar()) }
    catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = vulns.filter(v => {
    const q = searchQ.toLowerCase()
    const matchQ   = !q || v.titulo.toLowerCase().includes(q) || String(v.id).includes(q)
    const matchSev = filterSev === 'All' || v.nivel === filterSev
    const matchEnv = filterEnv === 'All' || v.ambiente === filterEnv
    const matchSt  = filterStatus === 'All' || v.status === filterStatus
    return matchQ && matchSev && matchEnv && matchSt
  })

  /* severity counts */
  const counts = {
    critical: vulns.filter(v => v.nivel === 'Critica').length,
    high:     vulns.filter(v => v.nivel === 'Alta').length,
    medium:   vulns.filter(v => v.nivel === 'Media').length,
    low:      vulns.filter(v => v.nivel === 'Baixa').length,
  }

  /* CREATE */
  const openCreate = () => {
    setForm({ titulo: '', ambiente: 'DEV', nivel: 'Media', status: 'Ativa' })
    setFormError('')
    setShowCreate(true)
  }
  const handleCreate = async () => {
    if (!form.titulo.trim()) { setFormError('Title is required.'); return }
    setSaving(true); setFormError('')
    try {
      await vulnService.criar(form)
      await load()
      setShowCreate(false)
      showToastMsg('Vulnerability created.', 'success')
    } catch (e: unknown) { setFormError((e as Error).message ?? 'Error creating.') }
    finally { setSaving(false) }
  }

  /* EDIT */
  const openEdit = (v: VulnResponseDTO) => {
    setEditTarget(v)
    setForm({ titulo: v.titulo, ambiente: v.ambiente, nivel: v.nivel, status: v.status })
    setFormError('')
    setShowEdit(true)
  }
  const handleEdit = async () => {
    if (!editTarget) return
    if (!form.titulo.trim()) { setFormError('Title is required.'); return }
    setSaving(true); setFormError('')
    try {
      const dto: EditarVulnDTO = { titulo: form.titulo, ambiente: form.ambiente, nivel: form.nivel, status: form.status }
      await vulnService.editar(editTarget.id, dto)
      await load()
      setShowEdit(false)
      showToastMsg('Vulnerability updated.', 'success')
    } catch (e: unknown) { setFormError((e as Error).message ?? 'Error updating.') }
    finally { setSaving(false) }
  }

  /* ARCHIVE / RESTORE */
  const confirmArchive = (v: VulnResponseDTO) => { setArchiveTarget(v); setShowConfirm(true) }
  const handleArchive = async () => {
    if (!archiveTarget) return
    try {
      await vulnService.arquivar(archiveTarget.id)
      await load()
      setShowConfirm(false)
      showToastMsg('Vulnerability archived.', 'success')
    } catch { showToastMsg('Error archiving.', 'error') }
  }
  const handleRestore = async (id: number) => {
    try {
      await vulnService.restaurar(id)
      await load()
      showToastMsg('Vulnerability restored.', 'success')
    } catch { showToastMsg('Error restoring.', 'error') }
  }

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

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2ecf7', margin: 0 }}>Vulnerabilities</h2>
          <p style={{ fontSize: 12, color: '#7b96b8', margin: '4px 0 0' }}>
            {vulns.length} total · {vulns.filter(v => v.status === 'Ativa').length} active
          </p>
        </div>
        <button onClick={openCreate} style={primaryBtn}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Vulnerability
        </button>
      </div>

      {/* Severity summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Critical', value: counts.critical, color: '#e63946', bg: 'rgba(230,57,70,0.08)' },
          { label: 'High',     value: counts.high,     color: '#f4a261', bg: 'rgba(244,162,97,0.08)' },
          { label: 'Medium',   value: counts.medium,   color: '#4895ef', bg: 'rgba(72,149,239,0.08)' },
          { label: 'Low',      value: counts.low,      color: '#06d6a0', bg: 'rgba(6,214,160,0.08)' },
        ].map(c => (
          <div key={c.label}
            onClick={() => setFilterSev(filterSev === c.label.charAt(0).toUpperCase() + c.label.slice(1) ? 'All' : NIVEIS.find(n => n.startsWith(c.label.slice(0, 4))) ?? 'All')}
            style={{
              background: '#101e35', border: `1px solid ${c.color}25`,
              borderRadius: 10, padding: '14px 16px',
              cursor: 'pointer', transition: 'box-shadow 0.2s',
              background2: c.bg,
            } as React.CSSProperties}
            onMouseOver={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${c.color}20`)}
            onMouseOut={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
          >
            <div style={{ fontSize: 11, color: c.color, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#e2ecf7' }}>{loading ? '...' : c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#7b96b8' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search vulnerabilities..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ ...filterSt, paddingLeft: 30, width: '100%' }} />
        </div>
        <select value={filterSev} onChange={e => setFilterSev(e.target.value)} style={filterSt}>
          <option value="All">Severity: All</option>
          {NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={filterEnv} onChange={e => setFilterEnv(e.target.value)} style={filterSt}>
          {['All','DEV','HML','PROD'].map(e => <option key={e} value={e}>{e === 'All' ? 'Env: All' : e}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={filterSt}>
          <option value="All">Status: All</option>
          {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#101e35', border: '1px solid #1a2d4a', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a2d4a' }}>
              {['ID','Title','Severity','Env','Status','Created','Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td colSpan={7} style={{ padding: 12 }}>
                    <div className="skeleton" style={{ height: 18 }} />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#3f5778', fontSize: 13 }}>
                  {vulns.length === 0 ? 'No vulnerabilities registered yet.' : 'No results match the current filters.'}
                </td>
              </tr>
            ) : (
              filtered.map(v => (
                <tr key={v.id}
                  style={{ borderBottom: '1px solid #1a2d4a', transition: 'background 0.15s' }}
                  onMouseOver={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,119,182,0.06)')}
                  onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <td style={tdStyle}><span style={{ color: '#0096c7', fontWeight: 600, fontSize: 12 }}>#{v.id}</span></td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#e2ecf7' }}>{v.titulo}</span>
                  </td>
                  <td style={tdStyle}><SeverityBadge nivel={v.nivel} /></td>
                  <td style={tdStyle}><EnvBadge ambiente={v.ambiente} /></td>
                  <td style={tdStyle}><StatusBadge status={v.status} /></td>
                  <td style={{ ...tdStyle, color: '#7b96b8', fontSize: 12 }}>
                    {new Date(v.createdAt).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(v)} style={actionBtn('#4895ef')}>Edit</button>
                      {v.status !== 'Arquivada'
                        ? <button onClick={() => confirmArchive(v)} style={actionBtn('#e63946')}>Archive</button>
                        : <button onClick={() => handleRestore(v.id)} style={actionBtn('#06d6a0')}>Restore</button>
                      }
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        {filtered.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #1a2d4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#7b96b8' }}>Showing {filtered.length} of {vulns.length}</span>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={showCreate} title="New Vulnerability" onClose={() => setShowCreate(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Title" error={formError}>
            <Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Vulnerability title" />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Severity">
              <Select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value as VulnCriacaoDTO['nivel'] })}>
                {NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}
              </Select>
            </FormField>
            <FormField label="Environment">
              <Select value={form.ambiente} onChange={e => setForm({ ...form, ambiente: e.target.value as VulnCriacaoDTO['ambiente'] })}>
                {AMBIENTES.map(a => <option key={a} value={a}>{a}</option>)}
              </Select>
            </FormField>
          </div>
          <FormField label="Status">
            <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as VulnCriacaoDTO['status'] })}>
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={() => setShowCreate(false)} style={secondaryBtn}>Cancel</button>
            <button onClick={handleCreate} disabled={saving} style={primaryBtn}>{saving ? 'Creating...' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEdit} title={`Edit — #${editTarget?.id}`} onClose={() => setShowEdit(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Title" error={formError}>
            <Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Severity">
              <Select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value as VulnCriacaoDTO['nivel'] })}>
                {NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}
              </Select>
            </FormField>
            <FormField label="Environment">
              <Select value={form.ambiente} onChange={e => setForm({ ...form, ambiente: e.target.value as VulnCriacaoDTO['ambiente'] })}>
                {AMBIENTES.map(a => <option key={a} value={a}>{a}</option>)}
              </Select>
            </FormField>
          </div>
          <FormField label="Status">
            <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as VulnCriacaoDTO['status'] })}>
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
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
          Archive <strong style={{ color: '#e2ecf7' }}>{archiveTarget?.titulo}</strong>? It will be hidden from the active list.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setShowConfirm(false)} style={secondaryBtn}>Cancel</button>
          <button onClick={handleArchive} style={{ ...primaryBtn, background: '#e63946' }}>Archive</button>
        </div>
      </Modal>
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
  padding: '8px 12px', background: '#0a1528',
  border: '1px solid #1a2d4a', borderRadius: 8,
  color: '#7b96b8', fontSize: 12, outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
}
const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '9px 18px',
  background: 'linear-gradient(90deg,#0077b6,#0096c7)',
  border: 'none', borderRadius: 9,
  color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
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
  }
}
