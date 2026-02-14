import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Compass } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', display_name: '', org_name: '', main_currency: 'COP',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const register = useAuthStore((s) => s.register)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-900 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl mb-4">
            <Compass className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold">Crear cuenta</h1>
          <p className="text-text-secondary mt-2">Comienza a controlar tu e-commerce</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Tu nombre</label>
            <input value={form.display_name} onChange={set('display_name')} className="input-field" placeholder="Capitán Luffy" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Nombre del negocio</label>
            <input value={form.org_name} onChange={set('org_name')} className="input-field" placeholder="Mi Tienda" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input type="email" value={form.email} onChange={set('email')} className="input-field" placeholder="tu@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Contraseña</label>
            <input type="password" value={form.password} onChange={set('password')} className="input-field" placeholder="Mínimo 6 caracteres" required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Moneda principal</label>
            <select value={form.main_currency} onChange={set('main_currency')} className="input-field">
              <option value="COP">COP — Peso Colombiano</option>
              <option value="MXN">MXN — Peso Mexicano</option>
              <option value="USD">USD — Dólar</option>
              <option value="PEN">PEN — Sol Peruano</option>
              <option value="CLP">CLP — Peso Chileno</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-50">
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-8 text-center text-text-secondary text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Ingresar</Link>
        </p>
      </div>
    </div>
  )
}
