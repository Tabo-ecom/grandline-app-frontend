import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { PageHeader } from '@/components/shared/Components'
import { Save, Trash2, Plus, Users, Key, Building, X, Check, Loader2 } from 'lucide-react'

function Section({ title, icon, children }) {
  return (
    <div className="card mb-6">
      <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2 mb-4">{icon} {title}</h3>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { org, user } = useAuthStore()
  const [credentials, setCredentials] = useState([])
  const [fbToken, setFbToken] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Add user form
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', password: '', display_name: '', role: 'viewer' })
  const [userMsg, setUserMsg] = useState('')
  const [users, setUsers] = useState([])

  // FB Accounts
  const [fbAccounts, setFbAccounts] = useState([])
  const [selectedAccounts, setSelectedAccounts] = useState([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)

  useEffect(() => {
    api.getCredentials().then(setCredentials).catch(() => {})
    api.getUsers().then(setUsers).catch(() => {})
  }, [])

  const saveFbToken = async () => {
    setSaving(true); setMsg('')
    try {
      await api.saveCredential({ provider: 'facebook', token: fbToken })
      setMsg('✅ Token guardado')
      setFbToken('')
      const creds = await api.getCredentials()
      setCredentials(creds)
    } catch (err) { setMsg('❌ ' + err.message) }
    finally { setSaving(false) }
  }

  const deleteCred = async (id) => {
    try {
      await api.deleteCredential(id)
      setCredentials(credentials.filter(c => c.id !== id))
    } catch {}
  }

  const loadFbAccounts = async () => {
    setLoadingAccounts(true)
    try {
      const data = await api.getFbAccounts()
      setFbAccounts(data.accounts || data || [])
    } catch (err) { setMsg('❌ ' + err.message) }
    finally { setLoadingAccounts(false) }
  }

  const saveFbSelectedAccounts = async () => {
    try {
      await api.saveFbAccounts(selectedAccounts)
      setMsg('✅ Cuentas publicitarias guardadas')
    } catch (err) { setMsg('❌ ' + err.message) }
  }

  const handleAddUser = async () => {
    setUserMsg('')
    try {
      await api.createUser(newUser)
      setUserMsg('✅ Usuario creado')
      setShowAddUser(false)
      setNewUser({ email: '', password: '', display_name: '', role: 'viewer' })
      const u = await api.getUsers()
      setUsers(u)
    } catch (err) { setUserMsg('❌ ' + err.message) }
  }

  const hasFbCred = credentials.some(c => c.platform === 'facebook')

  return (
    <div className="animate-fade-in max-w-3xl">
      <PageHeader emoji="⚙️" title="Settings" subtitle="Credenciales, usuarios y parámetros" />

      {/* Org Info */}
      <Section title="Organización" icon={<Building size={16} />}>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-text-muted">Nombre</label><p className="text-sm font-medium">{org?.name || '—'}</p></div>
          <div><label className="text-xs text-text-muted">Moneda</label><p className="text-sm font-medium">{org?.main_currency || '—'}</p></div>
          <div><label className="text-xs text-text-muted">Tu rol</label><p className="text-sm font-medium capitalize">{user?.role || '—'}</p></div>
          <div><label className="text-xs text-text-muted">Email</label><p className="text-sm font-medium">{user?.email || '—'}</p></div>
        </div>
      </Section>

      {/* API Credentials */}
      <Section title="API Credentials" icon={<Key size={16} />}>
        {credentials.length > 0 && (
          <div className="space-y-2 mb-4">
            {credentials.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-bg-700 rounded-lg">
                <div>
                  <span className="text-sm font-medium capitalize">{c.platform}</span>
                  <span className="badge-green ml-2 text-xs">Activo</span>
                </div>
                <button onClick={() => deleteCred(c.id)} className="text-text-muted hover:text-accent-red transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm text-text-secondary">Facebook Access Token</label>
          <div className="flex gap-2">
            <input value={fbToken} onChange={e => setFbToken(e.target.value)} className="input-field flex-1" placeholder="Pega tu token de Facebook..." />
            <button onClick={saveFbToken} disabled={!fbToken || saving} className="btn-primary disabled:opacity-50 flex items-center gap-2">
              <Save size={16} /> {saving ? '...' : 'Guardar'}
            </button>
          </div>
          {msg && <p className="text-sm">{msg}</p>}
        </div>

        {/* FB Account selector */}
        {hasFbCred && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-text-secondary font-medium">Cuentas Publicitarias de Facebook</label>
              <button onClick={loadFbAccounts} disabled={loadingAccounts} className="btn-secondary text-xs flex items-center gap-1">
                {loadingAccounts ? <Loader2 size={12} className="animate-spin" /> : null}
                {loadingAccounts ? 'Cargando...' : 'Cargar cuentas'}
              </button>
            </div>
            {fbAccounts.length > 0 && (
              <div className="space-y-2 mb-3">
                {fbAccounts.map(acc => (
                  <label key={acc.id || acc.account_id} className="flex items-center gap-3 p-3 bg-bg-700 rounded-lg cursor-pointer hover:bg-bg-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(acc.id || acc.account_id)}
                      onChange={(e) => {
                        const id = acc.id || acc.account_id
                        setSelectedAccounts(e.target.checked ? [...selectedAccounts, id] : selectedAccounts.filter(a => a !== id))
                      }}
                      className="rounded border-border"
                    />
                    <div>
                      <p className="text-sm font-medium">{acc.name || acc.account_name || acc.id}</p>
                      <p className="text-xs text-text-muted">ID: {acc.id || acc.account_id}</p>
                    </div>
                  </label>
                ))}
                <button onClick={saveFbSelectedAccounts} className="btn-primary text-sm mt-2 flex items-center gap-2">
                  <Check size={14} /> Guardar selección
                </button>
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Team */}
      <Section title="Equipo" icon={<Users size={16} />}>
        {users.length > 0 && (
          <div className="space-y-2 mb-4">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-bg-700 rounded-lg">
                <div>
                  <span className="text-sm font-medium">{u.display_name || u.email}</span>
                  <span className="text-xs text-text-muted ml-2 capitalize">({u.role})</span>
                </div>
                <span className={u.is_active ? 'badge-green text-xs' : 'badge-red text-xs'}>
                  {u.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        )}

        {!showAddUser ? (
          <button onClick={() => setShowAddUser(true)} className="btn-secondary text-sm flex items-center gap-2">
            <Plus size={14} /> Agregar usuario
          </button>
        ) : (
          <div className="p-4 bg-bg-700 rounded-lg border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Nuevo usuario</h4>
              <button onClick={() => setShowAddUser(false)} className="text-text-muted hover:text-text-primary"><X size={16} /></button>
            </div>
            <input value={newUser.display_name} onChange={e => setNewUser({...newUser, display_name: e.target.value})} className="input-field" placeholder="Nombre" />
            <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="input-field" placeholder="Email" />
            <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="input-field" placeholder="Contraseña" />
            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="input-field">
              <option value="viewer">Viewer (solo lectura)</option>
              <option value="admin">Admin</option>
            </select>
            {userMsg && <p className="text-sm">{userMsg}</p>}
            <button onClick={handleAddUser} className="btn-primary text-sm flex items-center gap-2">
              <Plus size={14} /> Crear usuario
            </button>
          </div>
        )}
      </Section>
    </div>
  )
}
