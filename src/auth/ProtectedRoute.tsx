import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function ProtectedRoute({ redirect = '/login' }: { redirect?: string }) {
  const auth = useAuth()
  if (!auth.isAuthenticated) return <Navigate to={redirect} replace />
  return <Outlet />
}
