import { Route, Routes } from 'react-router-dom'
import LandingLayout from './layouts/LandingLayout'
import Landing from './pages/Landing'
import BlogLayout from './layouts/BlogLayout'
import Blog from './pages/Blog'
import BlogDashboard from './pages/Dashboard/Blog/Blog'
import BlogForm from './pages/Dashboard/Blog/Form'
import DetailBlog from './pages/DetailBlog'
import NotFoundPage from './pages/NotFoundPage'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/blog" element={<BlogDashboard />} />
          <Route path="/dashboard/blog/create" element={<BlogForm />} />
          <Route path="/dashboard/blog/edit/:id" element={<BlogForm />} />

        </Route>
      </Route>

      <Route element={<BlogLayout />}>
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<DetailBlog />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
