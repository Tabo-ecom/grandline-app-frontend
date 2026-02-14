import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useFilterStore } from '@/stores/filterStore'
import { fmtCurrency, fmt } from '@/lib/utils'
import { StatCard, FilterBar, PageHeader, LoadingState, EmptyState } from '@/components/shared/Components'
import { Target, Zap, CalendarDays } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function WheelPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useFilterStore((s) => s.getParams)
  const days = useFilterStore((s) => s.days)

  useEffect(() => {
    setLoading(true)
    setError('')
    api.getWheel(params())
      .then(d => setData(d))
      .catch(e => { setError(e.message); setData(null) })
      .finally(() => setLoading(false))
  }, [days])

  if (loading) return <LoadingState />

  if (error || !data || !data.kpis) return (
    <>
      <PageHeader emoji="☸️" title="WHEEL — Operaciones" subtitle="Estrategia, metas y proyecciones" right={<FilterBar />} />
      {error ? (
        <div className="card text-center py-10">
          <p className="text-accent-red mb-2">Error cargando datos</p>
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      ) : <EmptyState />}
    </>
  )

  const k = data.kpis || {}
  const vel = data.velocity || {}
  const goal = data.monthly_goal || {}
  const daily = data.daily_breakdown || []

  return (
    <div className="animate-fade-in">
      <PageHeader emoji="☸️" title="WHEEL — Operaciones" subtitle="LOS NÚMEROS NO MIENTEN" right={<FilterBar />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Ingresos Netos" value={fmtCurrency(k.net_revenue || 0)} icon={<Zap size={18} />} />
        <StatCard label="AOV (Ticket Promedio)" value={fmtCurrency(k.aov || 0)} icon={<Target size={18} />} />
        <StatCard label="Velocidad Diaria" value={fmtCurrency(vel.avg_daily_revenue || 0)} change={`${fmt(vel.avg_daily_orders || 0)} órdenes/día`} changeType="up" />
        <StatCard label="Días Restantes" value={goal.days_left || '—'} change={goal.on_track ? '✅ On track' : '⚠️ Revisar ritmo'} changeType={goal.on_track ? 'up' : 'down'} icon={<CalendarDays size={18} />} />
      </div>

      {daily.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Proyección de Velocidad</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={daily}>
              <CartesianGrid stroke="#1e2642" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={{ background: '#151b30', border: '1px solid #1e2642', borderRadius: 8 }} />
              <Line type="monotone" dataKey="gross_revenue" stroke="#f59e0b" strokeWidth={2} dot={false} name="Ventas" />
              <Line type="monotone" dataKey="real_profit" stroke="#10b981" strokeWidth={2} dot={false} name="Ganancia" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center"><div className="text-xl mb-2">🎯</div><h4 className="font-semibold mb-1">Set Goals</h4><p className="text-sm text-text-secondary">Define metas mensuales — Próximamente</p></div>
        <div className="card text-center"><div className="text-xl mb-2">🧮</div><h4 className="font-semibold mb-1">Price Calculator</h4><p className="text-sm text-text-secondary">Costo + Margen — Próximamente</p></div>
        <div className="card text-center"><div className="text-xl mb-2">📈</div><h4 className="font-semibold mb-1">Scalability Sim</h4><p className="text-sm text-text-secondary">Escenarios What-if — Próximamente</p></div>
      </div>
    </div>
  )
}
