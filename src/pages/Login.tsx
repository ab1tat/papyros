import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import logot from '../shared/assets/logo.png'

export default function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
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
      padding: '20px',
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
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo block */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64,
            background: 'rgba(13,26,48,0.8)',
            border: '1px solid #1a2d4a',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(0,180,216,0.2)',
          }}>
            <img 
              src={logot} 
              alt="aBitat Logo" 
              style={{ width: 42, height: 42, borderRadius: 6 }} 
            />
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#e2ecf7', letterSpacing: '3px', textTransform: 'uppercase' }}>aBitat</div>
          <div style={{ fontSize: 12, color: '#7b96b8', marginTop: 4, fontWeight: 500 }}>Vulnerability Management Platform</div>
        </div>

        {/* Login Card */}
        <form onSubmit={handleLogin} style={{
          background: 'rgba(13,26,48,0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #1a2d4a',
          borderRadius: 20,
          padding: '32px 28px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#e2ecf7', marginBottom: 24, textAlign: 'center', opacity: 0.9 }}>
            Sign in to your account
          </h2>

          {error && (
            <div style={{
              background: 'rgba(230,57,70,0.1)',
              border: '1px solid rgba(230,57,70,0.2)',
              borderRadius: 8,
              padding: '12px',
              fontSize: 12,
              color: '#ff4d5a',
              marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 14 }}>⚠</span> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5c7694', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Username</span>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="Enter username"
                required
                style={inputSt}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5c7694', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Password</span>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="Enter password"
                required
                style={inputSt}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 28,
              padding: '14px',
              background: loading ? '#0a3a5c' : 'linear-gradient(90deg, #0077b6, #0096c7)',
              border: 'none', borderRadius: 10,
              color: '#fff', fontSize: 13, fontWeight: 700,
              letterSpacing: '1px', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 20px rgba(0,119,182,0.3)',
              transition: 'transform 0.2s, background 0.2s',
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 12, color: '#7b96b8' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#00b4d8', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
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
  borderRadius: 10, 
  color: '#e2ecf7',
  fontSize: 14, 
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'all 0.2s',
  width: '100%',
}