import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useFilterStore } from '@/stores/filterStore'
import { fmt } from '@/lib/utils'
import { StatCard, FilterBar, PageHeader, LoadingState, EmptyState } from '@/components/shared/Components'
import { Package, Truck, RotateCcw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function ShipPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useFilterStore((s) => s.getParams)
  const days = useFilterStore((s) => s.days)

  useEffect(() => {
    setLoading(true)
    setError('')
    api.getShip(params())
      .then(d => setData(d))
      .catch(e => { setError(e.message); setData(null) })
      .finally(() => setLoading(false))
  }, [days])

  if (loading) return <LoadingState />

  if (error || !data || !data.funnel) return (
    <>
      <PageHeader emoji="🚢" title="SHIP — Logística" subtitle="Tracking, entregas y devoluciones" right={<FilterBar />} />
      {error ? (
        <div className="card text-center py-10">
          <p className="text-accent-red mb-2">Error cargando datos</p>
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      ) : <EmptyState title="Sin datos logísticos" message="Sube un archivo de Dropi con datos de entregas para ver esta sección." />}
    </>
  )

  const f = data.funnel || {}
  const byCity = (data.by_city || []).slice(0, 8)

  return (
    <div className="animate-fade-in">
      <PageHeader emoji="🚢" title="SHIP — Logística" subtitle="CONTROLA TU LOGÍSTICA" right={<FilterBar />} />

      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-text-secondary mb-6">Logistics Funnel</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: 'Despachados', value: f.dispatched || 0, color: '#64748b', icon: <Package size={20} /> },
            { label: 'En Tránsito', value: f.in_transit || 0, color: '#f59e0b', icon: <Truck size={20} /> },
            { label: 'Entregados', value: f.delivered || 0, color: '#10b981', icon: <Truck size={20} /> },
            { label: 'Devueltos', value: f.returned || 0, color: '#ef4444', icon: <RotateCcw size={20} /> },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: item.color + '20', color: item.color }}>
                {item.icon}
              </div>
              <p className="text-2xl font-bold font-display">{fmt(item.value)}</p>
              <p className="text-sm text-text-secondary">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {byCity.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Entregas por Ciudad</h3>
          <ResponsiveContainer width="100%" height={Math.max(200, byCity.length * 45)}>
            <BarChart data={byCity} layout="vertical" barCategoryGap="20%">
              <CartesianGrid stroke="#1e2642" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <YAxis type="category" dataKey="city" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} width={100} />
              <Tooltip contentStyle={{ background: '#151b30', border: '1px solid #1e2642', borderRadius: 8 }} />
              <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelados" />
              <Bar dataKey="delivered" stackId="a" fill="#10b981" name="Entregados" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center"><div className="text-xl mb-2">🔍</div><h4 className="font-semibold mb-1">Tracking Table</h4><p className="text-sm text-text-secondary">Seguimiento detallado</p></div>
        <div className="card text-center"><div className="text-xl mb-2">🔄</div><h4 className="font-semibold mb-1">Reconciliación</h4><p className="text-sm text-text-secondary">Alertas de dinero no recuperado</p></div>
        <div className="card text-center"><div className="text-xl mb-2">📊</div><h4 className="font-semibold mb-1">Courier Analysis</h4><p className="text-sm text-text-secondary">Rendimiento por transportadora</p></div>
      </div>
    </div>
  )
}
