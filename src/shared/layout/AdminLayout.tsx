import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar  from './Navbar'

export default function AdminLayout() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0b1222',
    }}>
      <Sidebar />

      <div style={{
        flex: 1,
        marginLeft: 220,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Navbar />

        <main style={{
          flex: 1,
          padding: '28px 32px',
          overflowY: 'auto',
          background: 'radial-gradient(ellipse at 30% 20%, rgba(0,119,182,0.06) 0%, transparent 60%), #0b1222',
        }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
