import { useFilterStore } from '@/stores/filterStore'
import { cn } from '@/lib/utils'

// ─── Stat Card ───────────────────────────────────────────────
export function StatCard({ label, value, change, changeType, icon, className }) {
  return (
    <div className={cn('card group', className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="stat-label">{label}</span>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-bg-700 flex items-center justify-center text-text-muted group-hover:bg-bg-600 transition-colors">
            {icon}
          </div>
        )}
      </div>
      <p className="stat-value">{value}</p>
      {change && (
        <p className={changeType === 'up' ? 'stat-change-up mt-1' : 'stat-change-down mt-1'}>
          {change}
        </p>
      )}
    </div>
  )
}

// ─── Filter Bar ──────────────────────────────────────────────
export function FilterBar() {
  const { days, setDays } = useFilterStore()
  const dayOptions = [3, 7, 15, 30]

  return (
    <div className="flex items-center gap-2">
      {dayOptions.map((d) => (
        <button
          key={d}
          onClick={() => setDays(d)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
            days === d
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'text-text-muted hover:text-text-secondary hover:bg-bg-700'
          )}
        >
          {d}d
        </button>
      ))}
    </div>
  )
}

// ─── Loading Skeleton ────────────────────────────────────────
export function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-flat">
            <div className="h-4 w-24 bg-bg-600 rounded mb-4" />
            <div className="h-8 w-32 bg-bg-600 rounded" />
          </div>
        ))}
      </div>
      <div className="card-flat h-80">
        <div className="h-4 w-48 bg-bg-600 rounded mb-4" />
        <div className="h-64 bg-bg-700 rounded" />
      </div>
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────
export function EmptyState({ title, message, action }) {
  return (
    <div className="card-flat text-center py-16">
      <div className="text-4xl mb-4">📭</div>
      <h3 className="text-lg font-semibold mb-2">{title || 'Sin datos'}</h3>
      <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">
        {message || 'Sube un archivo de Dropi para comenzar a ver tus métricas.'}
      </p>
      {action}
    </div>
  )
}

// ─── Page Header ─────────────────────────────────────────────
export function PageHeader({ emoji, title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="module-title flex items-center gap-2">
          {emoji && <span className="text-2xl">{emoji}</span>}
          {title}
        </h1>
        {subtitle && <p className="module-subtitle">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

// ─── Alert Item ──────────────────────────────────────────────
export function AlertItem({ alert, onResolve }) {
  return (
    <div className="flex items-start justify-between p-3 bg-bg-700 rounded-lg border border-border">
      <div className="flex items-start gap-2">
        <span className="text-accent-orange mt-0.5">⚠️</span>
        <div>
          <p className="text-sm">{alert.message}</p>
          {alert.recommendation && (
            <p className="text-xs text-text-muted mt-1">{alert.recommendation}</p>
          )}
        </div>
      </div>
      {onResolve && (
        <button
          onClick={() => onResolve(alert.id)}
          className="text-xs text-primary hover:underline whitespace-nowrap ml-3"
        >
          ✅ Resolver
        </button>
      )}
    </div>
  )
}
