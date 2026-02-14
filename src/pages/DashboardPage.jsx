import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { useFilterStore } from '@/stores/filterStore'
import { fmtCurrency, fmt, fmtPct, STATUS_COLORS, CHART_COLORS } from '@/lib/utils'
import { StatCard, FilterBar, PageHeader, LoadingState, EmptyState, AlertItem } from '@/components/shared/Components'
import { DollarSign, Package, Truck, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-700 border border-border rounded-lg p-3 shadow-card text-sm">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {fmtCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useFilterStore((s) => s.getParams)
  const days = useFilterStore((s) => s.days)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const d = await api.getDashboard(params())
      setData(d)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [days])

  if (loading) return <LoadingState />

  if (!data?.kpis || data.kpis.n_total === 0) {
    return (
      <>
        <PageHeader emoji="🏠" title="Command Center" subtitle={`Last ${days} days`} right={<FilterBar />} />
        <EmptyState
          title="Sin datos aún"
          message="Sube tu primer archivo de Dropi para ver tu centro de comando."
          action={
            <button onClick={() => navigate('/upload')} className="btn-primary">
              📁 Subir archivo
            </button>
          }
        />
      </>
    )
  }

  const k = data.kpis
  const daily = data.daily_breakdown || []
  const statusData = [
    { name: 'Entregado', value: k.n_delivered, color: STATUS_COLORS.delivered },
    { name: 'En tránsito', value: k.n_transit || 0, color: STATUS_COLORS.transit },
    { name: 'Devuelto', value: k.n_returned, color: STATUS_COLORS.returned },
    { name: 'Cancelado', value: k.n_cancelled, color: STATUS_COLORS.cancelled },
  ].filter((d) => d.value > 0)

  const alerts = data.alerts || { finance: [], logistics: [], ads: [] }

  const handleResolve = async (id) => {
    try {
      await api.resolveAlert(id)
      load()
    } catch {}
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        emoji="🏠"
        title="Command Center"
        subtitle={`Últimos ${days} días · Todos los países · Todas las marcas`}
        right={<FilterBar />}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Ventas Brutas"
          value={fmtCurrency(k.gross_revenue)}
          icon={<DollarSign size={18} />}
        />
        <StatCard
          label="Órdenes Despachadas"
          value={fmt(k.n_total)}
          icon={<Package size={18} />}
        />
        <StatCard
          label="Órdenes Entregadas"
          value={fmt(k.n_delivered)}
          change={`${(k.delivery_rate || 0).toFixed(1)}% tasa`}
          changeType="up"
          icon={<Truck size={18} />}
        />
        <StatCard
          label="Ganancia Real Neta"
          value={fmtCurrency(k.real_profit)}
          change={fmtPct(k.margin_pct)}
          changeType={k.real_profit >= 0 ? 'up' : 'down'}
          icon={<TrendingUp size={18} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Daily Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Ventas vs Ganancia por Día</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={daily} barCategoryGap="20%">
              <CartesianGrid stroke="#1e2642" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="gross_revenue" name="Ventas" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="real_profit" name="Ganancia" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie */}
        <div className="card">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Estado Logístico</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(alerts.finance.length > 0 || alerts.logistics.length > 0 || alerts.ads.length > 0) && (
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <span>⚡</span> Alertas Activas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: '💰 FINANZAS', items: alerts.finance },
              { title: '🚢 LOGÍSTICA', items: alerts.logistics },
              { title: '☀️ ADS', items: alerts.ads },
            ].map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  {group.title}
                </p>
                <div className="space-y-2">
                  {group.items.length > 0 ? (
                    group.items.map((a) => (
                      <AlertItem key={a.id} alert={a} onResolve={handleResolve} />
                    ))
                  ) : (
                    <p className="text-xs text-text-muted p-3 bg-bg-700 rounded-lg">Todo bien ✅</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
