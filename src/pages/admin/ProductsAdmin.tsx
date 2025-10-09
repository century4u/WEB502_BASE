import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
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

  // pagination
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(6)
  const [total, setTotal] = useState(0)

  // search
  const [searchTerm, setSearchTerm] = useState('') // controlled input
  const [q, setQ] = useState('') // debounced query used for fetch
  const searchRef = useRef<number | null>(null)
  // price filter inputs
  const [minPriceInput, setMinPriceInput] = useState<string>('')
  const [maxPriceInput, setMaxPriceInput] = useState<string>('')
  const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null)
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true
    fetchData({ page, perPage, q, minPriceFilter, maxPriceFilter, signal: () => isMounted })
    return () => {
      isMounted = false
    }
  }, [page, perPage, q, minPriceFilter, maxPriceFilter])

  async function fetchData(opts: { page: number; perPage: number; q?: string; minPriceFilter?: number | null; maxPriceFilter?: number | null; signal?: () => boolean | void }) {
    const { page: p, perPage: limit, q: qq, minPriceFilter: minF, maxPriceFilter: maxF, signal } = opts
    setLoading(true)
    const params: any = { _page: p, _limit: limit }
    if (qq) params.q = qq
    if (minF !== null && minF !== undefined) params.price_gte = minF
    if (maxF !== null && maxF !== undefined) params.price_lte = maxF
    try {
      const res = await axios.get<Product[]>(API, { params })
      if (signal && signal() === false) return
      setItems(res.data || [])
      const totalHeader = res.headers['x-total-count'] || res.headers['X-Total-Count']
      setTotal(totalHeader ? Number(totalHeader) : res.data.length)
    } catch (e) {
      // fallback
      setItems(sampleProducts.slice(0, 20))
      setTotal(sampleProducts.length)
    } finally {
      setLoading(false)
    }
  }

  // debounce searchTerm -> q
  useEffect(() => {
    if (searchRef.current) window.clearTimeout(searchRef.current)
    // debounce 400ms
    searchRef.current = window.setTimeout(() => {
      setPage(1)
      setQ(searchTerm.trim())
    }, 400)

    return () => {
      if (searchRef.current) window.clearTimeout(searchRef.current)
    }
  }, [searchTerm])

  function doSearch() {
    // cancel pending debounce and run search immediately
    if (searchRef.current) {
      window.clearTimeout(searchRef.current)
      searchRef.current = null
    }
    setPage(1)
    setQ(searchTerm.trim())
  }

  function applyPriceFilter() {
    const min = minPriceInput ? Number(minPriceInput) : null
    const max = maxPriceInput ? Number(maxPriceInput) : null
    setMinPriceFilter(Number.isFinite(min as number) ? min : null)
    setMaxPriceFilter(Number.isFinite(max as number) ? max : null)
    setPage(1)
    fetchData({ page: 1, perPage, q, minPriceFilter: Number.isFinite(min as number) ? min : null, maxPriceFilter: Number.isFinite(max as number) ? max : null })
  }

  function clearPriceFilter() {
    setMinPriceInput('')
    setMaxPriceInput('')
    setMinPriceFilter(null)
    setMaxPriceFilter(null)
    setPage(1)
    fetchData({ page: 1, perPage, q, minPriceFilter: null, maxPriceFilter: null })
  }

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
        <h3></h3>
        <div className="d-flex align-items-center">
          <input
            className="form-control d-inline-block me-2"
            style={{ width: 260 }}
            placeholder="Tìm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } }}
          />
          <button className="btn btn-primary me-2" onClick={doSearch}>Tìm</button>
          <input className="form-control me-2" style={{ width: 120 }} placeholder="Giá từ" value={minPriceInput} onChange={(e) => setMinPriceInput(e.target.value)} />
          <input className="form-control me-2" style={{ width: 120 }} placeholder="Giá đến" value={maxPriceInput} onChange={(e) => setMaxPriceInput(e.target.value)} />
          <button className="btn btn-outline-primary me-2" onClick={applyPriceFilter}>Áp dụng</button>
          <button className="btn btn-outline-secondary me-2" onClick={clearPriceFilter}>Xóa bộ lọc</button>
          <a className="btn btn-outline-secondary btn-sm" href="/">Xem site</a>
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

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th style={{ width: 100 }}>Ảnh</th>
              <th>Tên</th>
              <th style={{ width: 140 }}>Danh mục</th>
              <th style={{ width: 140 }}>Giá</th>
              <th style={{ width: 100 }}>Tồn kho</th>
              <th style={{ width: 180 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">Chưa có sản phẩm</td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={String(p.id ?? Math.random())}>
                  <td>{p.id}</td>
                  <td>
                    {p.image ? (
                      <img src={String(p.image)} alt={p.name} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ width: 80, height: 60, borderRadius: 6 }}>
                        <small className="text-muted">No image</small>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="fw-semibold">{p.name}</div>
                    <div className="small text-muted">{p.description}</div>
                  </td>
                  <td>{(p as any).category ?? '-'}</td>
                  <td>{typeof p.price === 'number' ? p.price.toLocaleString('vi-VN') + '₫' : '-'}</td>
                  <td>{(p as any).stock ?? '-'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => editItem(p)}>Sửa</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteItem(p.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="d-flex align-items-center justify-content-between mt-4">
        <div>
          <label className="me-2">Hiển thị</label>
          <select className="form-select d-inline-block w-auto" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
          <span className="ms-3 text-muted">Tổng: {total}</span>
        </div>

        <div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(Math.max(1, page - 1))}>«</button>
              </li>
              {Array.from({ length: Math.max(1, Math.ceil(total / perPage)) }, (_, i) => i + 1).map((p) => (
                <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                </li>
              ))}
              <li className={`page-item ${page >= Math.ceil(total / perPage) ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(Math.min(Math.ceil(total / perPage), page + 1))}>»</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
