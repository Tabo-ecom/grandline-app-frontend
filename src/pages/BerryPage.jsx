import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useFilterStore } from '@/stores/filterStore'
import { fmtCurrency, fmtPct } from '@/lib/utils'
import { StatCard, FilterBar, PageHeader, LoadingState, EmptyState } from '@/components/shared/Components'
import { DollarSign, CreditCard, Percent } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

export default function BerryPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useFilterStore((s) => s.getParams)
  const days = useFilterStore((s) => s.days)

  useEffect(() => {
    setLoading(true)
    setError('')
    api.getBerry(params())
      .then(d => setData(d))
      .catch(e => { setError(e.message); setData(null) })
      .finally(() => setLoading(false))
  }, [days])

  if (loading) return <LoadingState />

  if (error || !data || !data.kpis) return (
    <>
      <PageHeader emoji="💰" title="BERRY — Finanzas" subtitle="Profit, costos y salud financiera" right={<FilterBar />} />
      {error ? (
        <div className="card text-center py-10">
          <p className="text-accent-red mb-2">Error cargando datos</p>
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      ) : <EmptyState />}
    </>
  )

  const k = data.kpis || {}
  const waterfall = data.waterfall || []
  const getColor = (name) => {
    const map = { Revenue: '#64748b', 'Cancelled Loss': '#ef4444', COGS: '#f59e0b', Shipping: '#3b82f6', 'Ad Spend': '#8b5cf6', Admin: '#ec4899' }
    if (name === 'Net Profit') return (k.real_profit || 0) >= 0 ? '#10b981' : '#ef4444'
    return map[name] || '#64748b'
  }

  return (
    <div className="animate-fade-in">
      <PageHeader emoji="💰" title="BERRY — Finanzas" subtitle="CALCULA TU UTILIDAD REAL" right={<FilterBar />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Ganancia Neta Real" value={fmtCurrency(k.real_profit || 0)} change={fmtPct(k.margin_pct || 0)} changeType={(k.real_profit || 0) >= 0 ? 'up' : 'down'} icon={<DollarSign size={18} />} />
        <StatCard label="Costos Fijos" value={fmtCurrency(data.expenses_total || 0)} change="Mensual" changeType="up" icon={<CreditCard size={18} />} />
        <StatCard label="Margen Actual" value={`${(k.margin_pct || 0).toFixed(1)}%`} change={(k.margin_pct || 0) >= 15 ? 'Por encima del target' : 'Debajo del target'} changeType={(k.margin_pct || 0) >= 15 ? 'up' : 'down'} icon={<Percent size={18} />} />
      </div>

      {waterfall.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Revenue Waterfall</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={waterfall} barCategoryGap="15%">
              <CartesianGrid stroke="#1e2642" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={{ background: '#151b30', border: '1px solid #1e2642', borderRadius: 8 }} formatter={(v) => fmtCurrency(v)} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {waterfall.map((entry, i) => (
                  <Cell key={i} fill={getColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center"><div className="text-xl mb-2">📊</div><h4 className="font-semibold mb-1">P&L Detalle</h4><p className="text-sm text-text-secondary">Desglose por producto</p></div>
        <div className="card text-center"><div className="text-xl mb-2">💳</div><h4 className="font-semibold mb-1">Gastos</h4><p className="text-sm text-text-secondary">Gestiona costos admin/fijos</p></div>
        <div className="card text-center"><div className="text-xl mb-2">📜</div><h4 className="font-semibold mb-1">Historial</h4><p className="text-sm text-text-secondary">Full audit trail</p></div>
      </div>
    </div>
  )
}
