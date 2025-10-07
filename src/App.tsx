import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './pages/Layout'
import List from './pages/List'
import Add from './pages/Add'
import Edit from './pages/Edit'
import ProductDetail from './pages/ProductDetail'
import Users from './components/User'

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/List" replace />} />
          <Route path="List" element={<List />} />
          <Route path="users" element={<Users />} />
          <Route path="Add" element={<Add />} />
          <Route path="Edit/:id?" element={<Edit />} />
          <Route path="products/:id" element={<ProductDetail />} />
          {/* Optional auth placeholders to match navbar links */}
          <Route path="login" element={<div className="container py-4"><h1>Đăng nhập</h1></div>} />
          <Route path="register" element={<div className="container py-4"><h1>Đăng ký</h1></div>} />
        </Route>
        <Route path="*" element={<Navigate to="/Layout" replace />} />
      </Routes>
    </>
  )
}

export default App
