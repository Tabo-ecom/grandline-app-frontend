import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/layout/Layout'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import WheelPage from '@/pages/WheelPage'
import BerryPage from '@/pages/BerryPage'
import ShipPage from '@/pages/ShipPage'
import SunnyPage from '@/pages/SunnyPage'
import SettingsPage from '@/pages/SettingsPage'
import UploadPage from '@/pages/UploadPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-text-secondary text-sm">Cargando...</span>
        </div>
      </div>
    )
  }
  return isAuthenticated ? children : <Navigate to="/login" />
}

export default function App() {
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="wheel" element={<WheelPage />} />
                <Route path="berry" element={<BerryPage />} />
                <Route path="ship" element={<ShipPage />} />
                <Route path="sunny" element={<SunnyPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="upload" element={<UploadPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
