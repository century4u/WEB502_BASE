import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Product = { id?: number | string; name: string; price?: number; image?: string }
type SimpleUser = { id?: number | string; name?: string; email?: string }

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<SimpleUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      axios.get<Product[]>('http://localhost:3000/products').then((r) => r.data).catch(() => []),
      axios.get<SimpleUser[]>('https://jsonplaceholder.typicode.com/users').then((r) => r.data).catch(() => []),
    ])
      .then(([prods, us]) => {
        if (!mounted) return
        setProducts(prods || [])
        setUsers(us || [])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div>Đang tải dashboard…</div>

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Sản phẩm</h6>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="mb-0">{products.length}</h3>
                  <div className="text-muted small">Tổng sản phẩm</div>
                </div>
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="6" height="18" rx="1" fill="#0d6efd"/>
                    <rect x="10" y="8" width="4" height="13" rx="1" fill="#6c757d"/>
                    <rect x="16" y="13" width="4" height="8" rx="1" fill="#adb5bd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Người dùng</h6>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="mb-0">{users.length}</h3>
                  <div className="text-muted small">Tổng người dùng (mẫu)</div>
                </div>
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.5 0 4-1.5 4-4s-1.5-4-4-4-4 1.5-4 4 1.5 4 4 4z" fill="#198754"/>
                    <path d="M4 20c0-3.3 4.5-5 8-5s8 1.7 8 5v1H4v-1z" fill="#6c757d"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Hành động nhanh</h6>
              <div className="d-flex gap-2 mt-2">
                <Link to="/admin/products" className="btn btn-primary">Thêm / Quản lý sản phẩm</Link>
                <Link to="/admin/users" className="btn btn-outline-secondary">Quản lý người dùng</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5>Sản phẩm mới</h5>
              {products.length === 0 ? (
                <div className="text-muted">Không có sản phẩm</div>
              ) : (
                <div className="list-group">
                  {products.slice(0, 6).map((p) => (
                    <div key={String(p.id)} className="list-group-item d-flex align-items-center gap-3">
                      {p.image ? (
                        <img src={String(p.image)} alt={p.name} style={{ width: 64, height: 48, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 64, height: 48, background: '#f1f3f5' }} />
                      )}
                      <div>
                        <div className="fw-semibold">{p.name}</div>
                        {typeof p.price === 'number' && <div className="text-primary small">{p.price.toLocaleString('vi-VN')}₫</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5>Người dùng hàng đầu</h5>
              <ul className="list-unstyled mb-0">
                {users.slice(0, 6).map((u) => (
                  <li key={String(u.id)} className="py-2 border-bottom">
                    <div className="fw-medium">{u.name}</div>
                    <div className="small text-muted">{u.email}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
