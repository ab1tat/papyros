import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import logot from '../shared/assets/logo.png'

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validação de segurança primária (CISO)
    if (form.password !== form.confirm) { 
      setError('Passwords do not match.')
      return 
    }
    
    setLoading(true)
    try {
      // Alinhado com o DTO do Backend Rapsodia (Username/Password com iniciais maiúsculas)
      const res = await api.post('/auth/register', { 
        Username: form.username, 
        Password: form.password 
      })
      
      if (res.status === 200 || res.status === 201) {
        navigate('/login')
      }
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
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img 
            src={logot} 
            alt="aBitat Logo" 
            style={{ 
              width: 64, 
              height: 64, 
              margin: '0 auto 16px', 
              borderRadius: 14, 
              boxShadow: '0 0 30px rgba(0,180,216,0.3)',
              border: '1px solid #1a2d4a'
            }} 
          />
          <div style={{ fontSize: 26, fontWeight: 800, color: '#e2ecf7', letterSpacing: '3px', textTransform: 'uppercase' }}>aBitat</div>
          <div style={{ fontSize: 12, color: '#7b96b8', marginTop: 4, fontWeight: 500 }}>Create your account</div>
        </div>

        <form onSubmit={handleRegister} style={{
          background: 'rgba(13,26,48,0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #1a2d4a',
          borderRadius: 20,
          padding: '32px 28px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(230,57,70,0.1)',
              border: '1px solid rgba(230,57,70,0.2)',
              borderRadius: 8, padding: '12px', fontSize: 12, color: '#ff4d5a', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Username', key: 'username', type: 'text', placeholder: 'Choose a username' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Create a password' },
              { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: 'Confirm your password' },
            ].map(f => (
              <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#5c7694', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{f.label}</span>
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
            width: '100%', marginTop: 28, padding: '14px',
            background: loading ? '#0a3a5c' : 'linear-gradient(90deg, #0077b6, #0096c7)',
            border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 700,
            letterSpacing: '1px', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 20px rgba(0,119,182,0.3)',
            transition: 'transform 0.2s',
          }}
          onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 12, color: '#7b96b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00b4d8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

const inputSt: React.CSSProperties = {
  padding: '12px 14px',
  background: '#060e1f',
  border: '1px solid #1a2d4a',
  borderRadius: 10, color: '#e2ecf7',
  fontSize: 14, outline: 'none',
  fontFamily: 'inherit',
  transition: 'all 0.2s',
  width: '100%',
}