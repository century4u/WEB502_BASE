import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Trang chủ
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/List">
                  Danh sách
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Add">
                  Thêm mới
                </Link>
              </li>
            </ul>
           
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Đăng ký
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>
        </div>


      </nav>

     

      <div className="container py-4">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-variant text-white-50 text-center py-3 mt-auto">
        <div className="container">
          <small>© {new Date().getFullYear()} WEB502 Base</small>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
