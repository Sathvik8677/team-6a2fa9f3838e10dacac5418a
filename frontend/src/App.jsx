import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import AskAI from './pages/AskAI'
import RaiseQuery from './pages/RaiseQuery'
import Discussions from './pages/Discussions'
import QueryDetail from './pages/QueryDetail'
import Analytics from './pages/Analytics'
import Announcements from './pages/Announcements'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import FAQBrowser from './pages/FAQBrowser'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminFAQs from './pages/admin/AdminFAQs'
import AdminEscalations from './pages/admin/AdminEscalations'

function ProtectedRoute({ children }) {
  const token = useAuthStore(state => state.token)
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, token } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (token && user && user.role !== 'admin') {
      navigate('/home', { replace: true })
    }
  }, [user, token, navigate])

  if (!token) return <Navigate to="/login" replace />
  if (user && user.role !== 'admin') return <Navigate to="/home" replace />
  return children
}

function PublicRoute({ children }) {
  const token = useAuthStore(state => state.token)
  return !token ? children : <Navigate to="/home" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="ask" element={<AskAI />} />
        <Route path="raise-query" element={<RaiseQuery />} />
        <Route path="discussions" element={<Discussions />} />
        <Route path="discussions/:id" element={<QueryDetail />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="faq" element={<FAQBrowser />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="faqs" element={<AdminFAQs />} />
        <Route path="escalations" element={<AdminEscalations />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}