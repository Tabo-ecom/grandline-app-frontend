import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard, Compass, Coins, Ship, Sun,
  Settings, Upload, LogOut, Menu, X, ChevronDown,
  Bot
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'MODULES', type: 'section' },
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', emoji: '🏠' },
  { path: '/wheel', icon: Compass, label: 'WHEEL', emoji: '☸️', sub: 'Operaciones' },
  { path: '/berry', icon: Coins, label: 'BERRY', emoji: '💰', sub: 'Finanzas' },
  { path: '/ship', icon: Ship, label: 'SHIP', emoji: '🚢', sub: 'Logística' },
  { path: '/sunny', icon: Sun, label: 'SUNNY', emoji: '☀️', sub: 'Publicidad' },
  { label: 'divider', type: 'divider' },
  { path: '/settings', icon: Settings, label: 'Settings', emoji: '⚙️' },
  { path: '/upload', icon: Upload, label: 'Upload Data', emoji: '📁' },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, org, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-bg-900 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-bg-800 to-bg-900 border-r border-border flex flex-col',
        'transition-transform duration-300 lg:translate-x-0 lg:static',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center font-display font-bold text-bg-900 text-sm">
            G
          </div>
          <div>
            <h1 className="font-display font-bold text-sm">{org?.name || 'Grand Line'}</h1>
            <p className="text-[11px] text-text-muted">{org?.main_currency || 'COP'}</p>
          </div>
          <button className="lg:hidden ml-auto text-text-muted" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => {
            if (item.type === 'section') {
              return <p key={i} className="px-3 pt-4 pb-2 text-[11px] font-semibold text-text-muted uppercase tracking-widest">{item.label}</p>
            }
            if (item.type === 'divider') {
              return <div key={i} className="my-3 border-t border-border" />
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-700'
                )}
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-bg-600 rounded-full flex items-center justify-center text-xs font-bold text-text-secondary">
              {user?.display_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.display_name || 'Usuario'}</p>
              <p className="text-[11px] text-text-muted truncate">{user?.role || 'owner'}</p>
            </div>
            <button onClick={handleLogout} className="text-text-muted hover:text-accent-red transition-colors" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-bg-800">
          <button onClick={() => setSidebarOpen(true)} className="text-text-secondary">
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-sm">Grand Line</span>
          <div className="w-6" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* VEGA AI Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-accent-orange rounded-full shadow-glow-orange flex items-center justify-center text-white hover:scale-110 transition-transform z-30" title="VEGA — Tu oficial al mando">
        <Bot size={24} />
      </button>
    </div>
  )
}
