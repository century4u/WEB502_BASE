import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import sampleProducts from '../../data/sampleProducts'

type Product = {
  id?: number | string
  name: string
  price?: number
  image?: string
  description?: string
}

const API = 'http://localhost:3000/products'

export default function ProductsAdmin() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    axios
      .get<Product[]>(API)
      .then((res) => {
        if (!isMounted) return
        setItems(res.data || [])
      })
      .catch(() => {
        // fallback to sample data
        if (!isMounted) return
        setItems(sampleProducts.slice(0, 20))
      })
      .finally(() => isMounted && setLoading(false))
    return () => {
      isMounted = false
    }
  }, [])

  function editItem(p: Product) {
    setEditing(p)
  }

  function deleteItem(id?: number | string) {
    if (!id) return
    if (!confirm('Xóa sản phẩm này?')) return
    axios
      .delete(`${API}/${id}`)
      .then(() => setItems((s) => s.filter((x) => String(x.id) !== String(id))))
      .catch(() => alert('Không thể xóa (server chưa chạy)'))
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const form = new FormData(f)
    const payload: Product = {
      name: String(form.get('name') || '').trim(),
      price: Number(form.get('price') || 0) || undefined,
      image: String(form.get('image') || '').trim() || undefined,
      description: String(form.get('description') || '').trim() || undefined,
    }

    if (!payload.name) return alert('Tên là bắt buộc')

    if (editing?.id) {
      axios
        .put(`${API}/${editing.id}`, payload)
        .then((res) => {
          setItems((s) => s.map((it) => (String(it.id) === String(res.data.id) ? res.data : it)))
          setEditing(null)
        })
        .catch(() => alert('Không thể cập nhật (server chưa chạy)'))
    } else {
      axios
        .post(API, payload)
        .then((res) => setItems((s) => [res.data, ...s]))
        .catch(() => alert('Không thể tạo (server chưa chạy)'))
    }
    f.reset()
  }

  if (loading) return <div>Đang tải...</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quản lý sản phẩm</h3>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/')}>Xem site</button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={onSubmit} className="row g-2">
            <div className="col-md-4">
              <input name="name" defaultValue={editing?.name || ''} className="form-control" placeholder="Tên sản phẩm" />
            </div>
            <div className="col-md-2">
              <input name="price" defaultValue={editing?.price ?? ''} className="form-control" placeholder="Giá" type="number" />
            </div>
            <div className="col-md-3">
              <input name="image" defaultValue={editing?.image || ''} className="form-control" placeholder="URL ảnh" />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-primary">{editing ? 'Cập nhật' : 'Tạo mới'}</button>
              {editing && <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(null)}>Huỷ</button>}
            </div>
            <div className="col-12">
              <textarea name="description" defaultValue={editing?.description || ''} className="form-control mt-2" placeholder="Mô tả" rows={2} />
            </div>
          </form>
        </div>
      </div>

      <div className="row g-3">
        {items.map((p) => (
          <div key={String(p.id ?? Math.random())} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              {p.image ? <img src={String(p.image)} className="card-img-top" style={{ height: 160, objectFit: 'cover' }} /> : null}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                {typeof p.price === 'number' && <div className="text-primary mb-2">{p.price.toLocaleString('vi-VN')}₫</div>}
                <p className="text-muted small flex-grow-1">{p.description}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => editItem(p)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteItem(p.id)}>Xóa</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
