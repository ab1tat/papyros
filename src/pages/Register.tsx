import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { Username: form.username, Password: form.password })
      if (res.status === 200 || res.status === 201) navigate('/login')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b19',
      backgroundImage: `
        radial-gradient(circle at 80% 20%, rgba(0,119,182,0.12) 0%, transparent 40%),
        radial-gradient(circle at 20% 80%, rgba(0,180,216,0.07) 0%, transparent 40%)
      `,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 380, animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 54, height: 54,
            background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(0,180,216,0.4)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#e2ecf7', letterSpacing: '3px' }}>SVSHARP</div>
          <div style={{ fontSize: 12, color: '#7b96b8', marginTop: 4 }}>Create your account</div>
        </div>

        <form onSubmit={handleRegister} style={{
          background: 'rgba(13,26,48,0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #1a2d4a',
          borderRadius: 16,
          padding: '32px 28px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)',
              borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#e63946', marginBottom: 18,
            }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Username', key: 'username', type: 'text', placeholder: 'Choose a username' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Create a password' },
              { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: 'Confirm your password' },
            ].map(f => (
              <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#7b96b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{f.label}</span>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  required
                  style={inputSt}
                  onFocus={ev => (ev.target.style.borderColor = '#0077b6')}
                  onBlur={ev => (ev.target.style.borderColor = '#1a2d4a')}
                />
              </label>
            ))}
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', marginTop: 22, padding: '12px',
            background: loading ? '#0a3a5c' : 'linear-gradient(90deg, #0077b6, #0096c7)',
            border: 'none', borderRadius: 9,
            color: '#fff', fontSize: 13, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}>
            {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#7b96b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00b4d8', fontWeight: 500 }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

const inputSt: React.CSSProperties = {
  padding: '10px 12px',
  background: '#060e1f',
  border: '1px solid #1a2d4a',
  borderRadius: 8, color: '#e2ecf7',
  fontSize: 13, outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
  width: '100%',
}
