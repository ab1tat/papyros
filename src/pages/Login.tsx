import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'

export default function Login() {
  const [user, setUser]     = useState('')
  const [pass, setPass]     = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.login(user, pass)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b19',
      backgroundImage: `
        radial-gradient(circle at 20% 40%, rgba(0,119,182,0.15) 0%, transparent 45%),
        radial-gradient(circle at 80% 70%, rgba(0,180,216,0.08) 0%, transparent 40%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Background grid lines */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,119,182,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,119,182,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      <div style={{
        width: '100%', maxWidth: 380,
        animation: 'fadeIn 0.4s ease-out',
        position: 'relative',
      }}>
        {/* Logo block */}
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
          <div style={{ fontSize: 12, color: '#7b96b8', marginTop: 4 }}>Vulnerability Management Platform</div>
        </div>

        {/* Card */}
        <form onSubmit={handleLogin} style={{
          background: 'rgba(13,26,48,0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #1a2d4a',
          borderRadius: 16,
          padding: '32px 28px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e2ecf7', marginBottom: 24, textAlign: 'center' }}>
            Sign in to your account
          </h2>

          {error && (
            <div style={{
              background: 'rgba(230,57,70,0.12)',
              border: '1px solid rgba(230,57,70,0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 12,
              color: '#e63946',
              marginBottom: 18,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#7b96b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Username</span>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="Enter username"
                required
                style={inputSt}
                onFocus={e => (e.target.style.borderColor = '#0077b6')}
                onBlur={e => (e.target.style.borderColor = '#1a2d4a')}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#7b96b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Password</span>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="Enter password"
                required
                style={inputSt}
                onFocus={e => (e.target.style.borderColor = '#0077b6')}
                onBlur={e => (e.target.style.borderColor = '#1a2d4a')}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 22,
              padding: '12px',
              background: loading ? '#0a3a5c' : 'linear-gradient(90deg, #0077b6, #0096c7)',
              border: 'none', borderRadius: 9,
              color: '#fff', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.5px', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(0,119,182,0.4)',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Authenticating...' : 'SIGN IN'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#7b96b8' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#00b4d8', fontWeight: 500 }}>Create one</Link>
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
