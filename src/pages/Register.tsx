import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await auth.register(name, email, password)
      navigate('/admin')
    } catch (err) {
      alert('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: 480 }}>
        <h2>Đăng ký</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Đang...' : 'Đăng ký'}</button>
            <button type="button" className="btn btn-link" onClick={() => navigate('/login')}>Đăng nhập</button>
          </div>
        </form>
      </div>
    </div>
  )
}
