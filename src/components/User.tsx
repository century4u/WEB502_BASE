import { useEffect, useState } from 'react'

type UserType = { id: number; name: string; email: string }

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((r) => r.json())
      .then((data) => isMounted && setUsers(data || []))
      .catch(() => isMounted && setUsers([]))
      .finally(() => isMounted && setLoading(false))
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <div className="p-4">Đang tải users...</div>

  return (
    <div>
      <h3>Users</h3>
      <ul className="list-group">
        {users.map((u) => (
          <li key={u.id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-bold">{u.name}</div>
                <div className="text-muted small">{u.email}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
