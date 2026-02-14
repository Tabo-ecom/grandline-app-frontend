export function fmt(n, decimals = 0) {
  if (n == null || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}

export function fmtCurrency(n, currency = 'COP', decimals) {
  if (n == null || isNaN(n)) return '—'
  const d = decimals ?? (Math.abs(n) >= 1000 ? 0 : 2)
  if (currency === 'COP') {
    return '$' + fmt(n, d)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(n)
}

export function fmtPct(n, decimals = 1) {
  if (n == null || isNaN(n)) return '—'
  return `${n >= 0 ? '+' : ''}${n.toFixed(decimals)}%`
}

export function fmtCompact(n) {
  if (n == null || isNaN(n)) return '—'
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function getStatusColor(status) {
  const map = {
    delivered: '#10b981',
    cancelled: '#ef4444',
    returned: '#f59e0b',
    transit: '#3b82f6',
    novelty: '#8b5cf6',
    pending: '#64748b',
  }
  return map[status] || '#64748b'
}

export const STATUS_COLORS = {
  delivered: '#10b981',
  cancelled: '#ef4444',
  returned: '#f59e0b',
  transit: '#3b82f6',
  novelty: '#8b5cf6',
  pending: '#64748b',
}

export const CHART_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#84cc16']
