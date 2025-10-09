import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './pages/Layout'
import ClientLayout from './pages/ClientLayout'
import AdminLayout from './pages/AdminLayout'
import ProductsAdmin from './pages/admin/ProductsAdmin'
import Dashboard from './pages/admin/Dashboard'
import UsersAdmin from './pages/admin/UsersAdmin'
import List from './pages/List'
import Add from './pages/Add'
import Edit from './pages/Edit'
import ProductDetail from './pages/ProductDetail'
import Users from './components/User'
import AuthProvider from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        {/* Public client routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Navigate to="/List" replace />} />
          <Route path="List" element={<List />} />
          <Route path="users" element={<Users />} />
          <Route path="Add" element={<Add />} />
          <Route path="Edit/:id?" element={<Edit />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin routes (example) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="edit/:id?" element={<Edit />} />
          </Route>
        </Route>

        {/* Legacy layout fallback (kept for compatibility) */}
        <Route path="/Layout/*" element={<Layout />} />

        <Route path="*" element={<Navigate to="/List" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
