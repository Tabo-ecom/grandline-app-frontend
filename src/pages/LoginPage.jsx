import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff, Compass } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-900 flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-bg-800 via-bg-900 to-bg-800">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent-orange rounded-full blur-[96px]" />
        </div>
        <div className="relative z-10 text-center px-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 border border-primary/20 rounded-2xl mb-8">
            <Compass className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-display font-bold text-text-primary mb-4 tracking-tight">
            Grand Line
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-md mx-auto">
            El sistema operativo para tu negocio de e-commerce.
            Controla tus números, logística y publicidad en un solo lugar.
          </p>
          <div className="mt-12 flex items-center justify-center gap-8 text-text-muted text-sm">
            <span>☸️ Operaciones</span>
            <span>💰 Finanzas</span>
            <span>🚢 Logística</span>
            <span>☀️ Publicidad</span>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl mb-4">
              <Compass className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold">Grand Line</h1>
          </div>

          <h2 className="text-2xl font-display font-bold mb-2">Bienvenido de vuelta</h2>
          <p className="text-text-secondary mb-8">Ingresa a tu centro de comando</p>

          {error && (
            <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-bg-900 border-t-transparent rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-text-secondary text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
