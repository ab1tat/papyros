import { useState } from 'react'
import api from '../services/api'
import { apiCatalog } from '../services/apiCatalog'

export default function ApiExplorer() {
  const [result, setResult] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)

  const run = async (method: string, path: string) => {
    setLoading(true)
    try {
      const res = await api.request({ method, url: path })
      setResult(res.data)
    } catch (err) {
      setResult(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2ecf7', marginBottom: 24 }}>API Explorer</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {Object.entries(apiCatalog).map(([group, endpoints]) => (
          <div key={group} style={{
            background: '#101e35', border: '1px solid #1a2d4a',
            borderRadius: 14, padding: '18px 20px',
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>
              {group}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(endpoints).map(([name, ep]) => (
                <button
                  key={name}
                  onClick={() => run(ep.method, ep.path.replace('{id}','1').replace('{vulnId}','1'))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid #1a2d4a',
                    borderRadius: 7, cursor: 'pointer', textAlign: 'left', width: '100%',
                    fontFamily: 'inherit', transition: 'border-color 0.15s',
                  }}
                  onMouseOver={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0077b6')}
                  onMouseOut={e => ((e.currentTarget as HTMLElement).style.borderColor = '#1a2d4a')}
                >
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                    color: ep.method === 'GET' ? '#06d6a0' : ep.method === 'POST' ? '#4895ef' : ep.method === 'DELETE' ? '#e63946' : '#f4a261',
                    background: ep.method === 'GET' ? 'rgba(6,214,160,0.15)' : ep.method === 'POST' ? 'rgba(72,149,239,0.15)' : ep.method === 'DELETE' ? 'rgba(230,57,70,0.15)' : 'rgba(244,162,97,0.15)',
                    flexShrink: 0,
                  }}>
                    {ep.method}
                  </span>
                  <span style={{ fontSize: 12, color: '#e2ecf7', fontWeight: 500 }}>{name}</span>
                  <span style={{ fontSize: 11, color: '#7b96b8', marginLeft: 'auto', fontFamily: 'monospace' }}>{ep.path}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#101e35', border: '1px solid #1a2d4a',
        borderRadius: 14, padding: '18px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Response</h3>
          {loading && <span style={{ fontSize: 12, color: '#7b96b8' }}>Loading...</span>}
        </div>
        <pre style={{
          background: '#060e1f', border: '1px solid #1a2d4a',
          borderRadius: 8, padding: 16,
          fontSize: 12, color: '#06d6a0', fontFamily: 'monospace',
          overflow: 'auto', maxHeight: 400,
          margin: 0,
        }}>
          {result ? JSON.stringify(result, null, 2) : 'Click an endpoint to test it...'}
        </pre>
      </div>
    </div>
  )
}
