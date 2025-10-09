import { Link, Outlet } from 'react-router-dom'
import './layouts.css'
import { useAuth } from '../auth/AuthProvider'

function AdminLayout() {
  const auth = useAuth()

  return (
    <div className="admin-root d-flex min-vh-100">
      <aside className="admin-sidebar bg-dark text-white p-3">
        <div className="sidebar-brand mb-4">
          <h5 className="mb-0">Admin Panel</h5>
          <small className="text-muted">WEB502</small>
        </div>

        <nav className="nav flex-column">
          <Link className="nav-link text-white" to="/admin">
            Dashboard
          </Link>
          <Link className="nav-link text-white" to="/admin/products">
            Products
          </Link>
          <Link className="nav-link text-white" to="/admin/users">
            Users
          </Link>
        </nav>
      </aside>

      <div className="admin-main flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Quản trị</h2>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end me-2">
              <div className="fw-semibold">{auth.user?.name || auth.user?.email || 'Admin'}</div>
              <div className="small text-muted">Quyền quản trị</div>
            </div>
            <Link to="/" className="btn btn-outline-secondary me-2">
              Xem site
            </Link>
            <button className="btn btn-danger" onClick={() => auth.logout()}>Đăng xuất</button>
          </div>
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
