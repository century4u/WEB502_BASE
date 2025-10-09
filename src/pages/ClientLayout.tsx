import { Link, Outlet } from 'react-router-dom'
import '../App.css'
import './layouts.css'

function ClientLayout() {
  return (
    <div className="client-root d-flex flex-column min-vh-100">
      <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src="/vite.svg" alt="logo" style={{ height: 36, marginRight: 8 }} />
            <strong>WEB502 Shop</strong>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#clientNav"
            aria-controls="clientNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="clientNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/List">
                  Sản phẩm
                </Link>
              </li>
              
            </ul>

            <div className="d-flex align-items-center">
              <Link className="btn btn-outline-primary me-2" to="/register">
                Đăng ký
              </Link>
              <Link className="btn btn-primary" to="/login">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="hero bg-light py-5">
        <div className="container text-center">
          <h1 className="display-5">Khám phá sản phẩm nổi bật</h1>
          <p className="lead text-muted">Giao diện client đơn giản, rõ ràng và responsive.</p>
        </div>
      </div>

      <main className="container my-4 flex-grow-1">
        <Outlet />
      </main>

      <footer className="bg-dark text-white-50 text-center py-3 mt-auto">
        <div className="container">
          <small>© {new Date().getFullYear()} WEB502 Shop • Thiết kế đẹp</small>
        </div>
      </footer>
    </div>
  )
}

export default ClientLayout
