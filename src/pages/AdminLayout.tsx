import { Link, Outlet, useLocation } from 'react-router-dom'
import './layouts.css'
import { useAuth } from '../auth/AuthProvider'
import { useState } from 'react'

function Icon({ name }: { name: string }) {
  // simple inline icons — no extra dependency
  const icons: Record<string, string> = {
    dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 13h3V6H3v7zm0-8h3V3H3v2zm5 8h3V3H8v10zm5 0h-3V8h3v5z"/></svg>',
    products: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 2v6l5 3V5l-5-3z"/><path d="M0 4a2 2 0 0 1 2-2h7v2H2v9h12V8h2v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z"/></svg>',
    users: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z"/><path d="M8 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>'
  }
  return <span className="me-2" dangerouslySetInnerHTML={{ __html: icons[name] || '' }} />
}

function AdminLayout() {
  const auth = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const links = [
    { to: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { to: '/admin/products', label: 'Products', icon: 'products' },
    { to: '/admin/users', label: 'Users', icon: 'users' },
  ]

  return (
    <div className={`admin-root d-flex min-vh-100 ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`admin-sidebar bg-dark text-white p-3 d-flex flex-column`}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h5 className="mb-0">MyStore Admin</h5>
            <small className="text-muted">Quản trị cửa hàng</small>
          </div>
          <button className="btn btn-sm btn-outline-light ms-2 toggle-btn" onClick={() => setCollapsed((s) => !s)} aria-label="Toggle sidebar">
            {collapsed ? '»' : '«'}
          </button>
        </div>

        <nav className="nav flex-column mb-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link text-white d-flex align-items-center ${location.pathname === l.to ? 'active' : ''}`}
            >
              <Icon name={l.icon} />
              <span className="link-label">{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="small text-muted mb-2">Bạn đang đăng nhập:</div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="fw-semibold">{auth.user?.name || auth.user?.email || 'Admin'}</div>
              <div className="small text-muted">{auth.user ? 'Quyền quản trị' : 'Khách'}</div>
            </div>
            <div className="d-flex flex-column">
              <Link to="/" className="btn btn-outline-light btn-sm mb-2">Xem site</Link>
              <button className="btn btn-danger btn-sm" onClick={() => auth.logout()}>Đăng xuất</button>
            </div>
          </div>
        </div>
      </aside>

      <div className="admin-main flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Quản trị</h2>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
