import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useFilterStore } from '@/stores/filterStore'
import { fmtCurrency, fmt } from '@/lib/utils'
import { StatCard, FilterBar, PageHeader, LoadingState, EmptyState } from '@/components/shared/Components'
import { DollarSign, TrendingUp, Zap } from 'lucide-react'

export default function SunnyPage() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useFilterStore((s) => s.getParams)
  const days = useFilterStore((s) => s.days)

  useEffect(() => {
    setLoading(true)
    setError('')
    api.getFbInsights(params())
      .then(d => setInsights(d))
      .catch(e => { setError(e.message); setInsights(null) })
      .finally(() => setLoading(false))
  }, [days])

  if (loading) return <LoadingState />

  const campaigns = insights?.campaigns || []
  const totalSpend = campaigns.reduce((s, c) => s + (c.spend || 0), 0)
  const totalPurchases = campaigns.reduce((s, c) => s + (c.purchases || 0), 0)
  const activeCampaigns = campaigns.length
  const globalRoas = insights?.total_revenue && totalSpend > 0 ? (insights.total_revenue / totalSpend).toFixed(1) : '—'

  const topPerformers = [...campaigns].sort((a, b) => (b.roas || 0) - (a.roas || 0)).slice(0, 3)
  const underPerformers = [...campaigns].sort((a, b) => (a.roas || 0) - (b.roas || 0)).slice(0, 3)

  return (
    <div className="animate-fade-in">
      <PageHeader emoji="☀️" title="SUNNY — Publicidad" subtitle="LANZA Y ESCALA TUS ANUNCIOS" right={<FilterBar />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Ad Spend" value={fmtCurrency(totalSpend)} change={`Last ${days} days`} changeType="up" icon={<DollarSign size={18} />} />
        <StatCard label="Global ROAS" value={typeof globalRoas === 'string' ? globalRoas : `${globalRoas}x`} icon={<TrendingUp size={18} />} />
        <StatCard label="Campañas Activas" value={fmt(activeCampaigns)} icon={<Zap size={18} />} />
      </div>

      {campaigns.length === 0 && !error ? (
        <EmptyState
          title="Sin datos de publicidad"
          message="Conecta tu token de Facebook en Settings y selecciona tus cuentas publicitarias para ver métricas aquí."
        />
      ) : error ? (
        <div className="card text-center py-10 mb-6">
          <p className="text-accent-orange mb-2">No se pudieron cargar los datos de ads</p>
          <p className="text-sm text-text-secondary">Verifica tu token de Facebook en Settings</p>
        </div>
      ) : null}

      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2 mb-4">👍 Top Performers</h3>
            <div className="space-y-2">
              {topPerformers.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-bg-700 rounded-lg">
                  <span className="text-sm truncate flex-1">{c.campaign_name}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-primary">CPA {fmtCurrency(c.cpa)}</span>
                    <span className="badge-green">ROAS {(c.roas || 0).toFixed(1)}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2 mb-4">👎 Underperformers</h3>
            <div className="space-y-2">
              {underPerformers.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-bg-700 rounded-lg">
                  <span className="text-sm truncate flex-1">{c.campaign_name}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-accent-red">CPA {fmtCurrency(c.cpa)}</span>
                    <span className="badge-red">ROAS {(c.roas || 0).toFixed(1)}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card text-center py-8 mb-6 border-dashed border-accent-orange/30">
        <p className="text-lg font-display font-semibold text-accent-orange">🚀 LAUNCHER — Deploy New Campaign</p>
        <p className="text-sm text-text-secondary mt-2">Próximamente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card text-center"><div className="text-xl mb-2">🎨</div><h4 className="font-semibold mb-1">Creative Analysis</h4><p className="text-sm text-text-secondary">Rendimiento por tipo de creative — Próximamente</p></div>
        <div className="card text-center"><div className="text-xl mb-2">⚡</div><h4 className="font-semibold mb-1">Audience Insights</h4><p className="text-sm text-text-secondary">Top segmentos — Próximamente</p></div>
      </div>
    </div>
  )
}
