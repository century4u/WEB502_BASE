import axios from 'axios'
import { useEffect, useState } from 'react'

type User = { id?: number | string; name: string; email: string }

const API = 'http://localhost:3000/users'

export default function UsersAdmin() {
  const [items, setItems] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<User | null>(null)

  useEffect(() => {
    let mounted = true
    axios
      .get<User[]>(API)
      .then((r) => mounted && setItems(r.data || []))
      .catch(() => {
        // fallback small dataset
        if (!mounted) return
        setItems([
          { id: 1, name: 'Người dùng A', email: 'a@example.com' },
          { id: 2, name: 'Người dùng B', email: 'b@example.com' },
        ])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  function onEdit(u: User) {
    setEditing(u)
  }

  function onDelete(id?: number | string) {
    if (!id) return
    if (!confirm('Xác nhận xóa người dùng?')) return
    axios
      .delete(`${API}/${id}`)
      .then(() => setItems((s) => s.filter((x) => String(x.id) !== String(id))))
      .catch(() => alert('Không thể xóa (server không chạy)'))
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const fd = new FormData(f)
    const payload: User = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
    }
    if (!payload.name || !payload.email) return alert('Tên và email là bắt buộc')

    if (editing?.id) {
      axios
        .put(`${API}/${editing.id}`, payload)
        .then((r) => setItems((s) => s.map((it) => (String(it.id) === String(r.data.id) ? r.data : it))))
        .catch(() => alert('Không thể cập nhật'))
    } else {
      axios
        .post(API, payload)
        .then((r) => setItems((s) => [r.data, ...s]))
        .catch(() => alert('Không thể tạo người dùng'))
    }

    f.reset()
    setEditing(null)
  }

  if (loading) return <div>Đang tải người dùng…</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quản lý người dùng</h3>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={onSubmit} className="row g-2">
            <div className="col-md-4">
              <input name="name" defaultValue={editing?.name || ''} className="form-control" placeholder="Tên" />
            </div>
            <div className="col-md-4">
              <input name="email" defaultValue={editing?.email || ''} className="form-control" placeholder="Email" />
            </div>
            <div className="col-md-4 d-flex gap-2">
              <button className="btn btn-primary">{editing ? 'Cập nhật' : 'Tạo mới'}</button>
              {editing && (
                <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(null)}>
                  Huỷ
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="list-group">
        {items.map((u) => (
          <div key={String(u.id)} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold">{u.name}</div>
              <div className="small text-muted">{u.email}</div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(u)}>
                Sửa
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(u.id)}>
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
