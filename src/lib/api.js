const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-23e31.up.railway.app'

class ApiClient {
  constructor() {
    this.baseUrl = API_URL
    this._isLoginRequest = false
  }

  getToken() { return localStorage.getItem('gl_token') }
  setToken(token) { localStorage.setItem('gl_token', token) }
  clearToken() { localStorage.removeItem('gl_token') }

  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`
    const headers = { ...options.headers }
    if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'
    const token = this.getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(url, { ...options, headers })

    if (res.status === 401 && !this._isLoginRequest) {
      this.clearToken()
      window.location.href = '/login'
      throw new Error('Sesión expirada')
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Error del servidor' }))
      let msg = 'Error del servidor'
      if (typeof err.detail === 'string') msg = err.detail
      else if (Array.isArray(err.detail)) msg = err.detail.map(e => e.msg || JSON.stringify(e)).join(', ')
      else if (err.detail) msg = JSON.stringify(err.detail)
      throw new Error(msg)
    }

    if (res.status === 204) return {}
    const text = await res.text()
    return text ? JSON.parse(text) : {}
  }

  get(path) { return this.request(path) }
  post(path, data) { return this.request(path, { method: 'POST', body: JSON.stringify(data) }) }
  patch(path, data) { return this.request(path, { method: 'PATCH', body: JSON.stringify(data) }) }
  delete(path) { return this.request(path, { method: 'DELETE' }) }

  async uploadFile(path, file) {
    const url = `${this.baseUrl}${path}`
    const formData = new FormData()
    formData.append('file', file)
    const headers = {}
    const token = this.getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(url, { method: 'POST', headers, body: formData })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Error al subir archivo' }))
      throw new Error(typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail))
    }
    return res.json()
  }

  async login(email, password) {
    this._isLoginRequest = true
    try { return await this.post('/api/auth/login', { email, password }) }
    finally { this._isLoginRequest = false }
  }
  register(data) { return this.post('/api/auth/register', data) }
  me() { return this.get('/api/auth/me') }
  getOrg() { return this.get('/api/auth/org') }
  updateOrg(data) { return this.patch('/api/auth/org', data) }
  getUsers() { return this.get('/api/auth/users') }
  createUser(data) { return this.post('/api/auth/users', data) }
  getStores() { return this.get('/api/auth/stores') }
  createStore(data) { return this.post('/api/auth/stores', data) }
  getCredentials() { return this.get('/api/auth/credentials') }
  saveCredential(data) {
    return this.post('/api/auth/credentials', {
      platform: data.provider || data.platform, token: data.token,
      label: data.label || null, extra_data: data.extra_data || null,
    })
  }
  deleteCredential(id) { return this.delete(`/api/auth/credentials/${id}`) }
  uploadOrders(file) { return this.uploadFile('/api/files/upload', file) }
  getFiles() { return this.get('/api/files/list') }
  deleteFile(id) { return this.delete(`/api/files/${id}`) }
  getCountries() { return this.get('/api/files/countries') }
  getDashboard(p = {}) { const q = new URLSearchParams(p).toString(); return this.get(`/api/ops/dashboard${q ? '?' + q : ''}`) }
  getWheel(p = {}) { const q = new URLSearchParams(p).toString(); return this.get(`/api/ops/wheel${q ? '?' + q : ''}`) }
  getBerry(p = {}) { const q = new URLSearchParams(p).toString(); return this.get(`/api/ops/berry${q ? '?' + q : ''}`) }
  getShip(p = {}) { const q = new URLSearchParams(p).toString(); return this.get(`/api/ops/ship${q ? '?' + q : ''}`) }
  addExpense(data) { return this.post('/api/ops/expenses', data) }
  deleteExpense(id) { return this.delete(`/api/ops/expenses/${id}`) }
  resolveAlert(id) { return this.patch(`/api/ops/alerts/${id}/resolve`) }
  getProductMappings(c) { return this.get(`/api/ops/product-mappings?country=${c}`) }
  saveProductMappings(data) { return this.post('/api/ops/product-mappings', data) }
  getCampaignMappings() { return this.get('/api/ops/campaign-mappings') }
  saveCampaignMappings(data) { return this.post('/api/ops/campaign-mappings', data) }
  getFbAccounts() { return this.get('/api/ads/fb/accounts') }
  getFbInsights(p = {}) { const q = new URLSearchParams(p).toString(); return this.get(`/api/ads/fb/insights${q ? '?' + q : ''}`) }
  getFbDailySpend(p = {}) { const q = new URLSearchParams(p).toString(); return this.get(`/api/ads/fb/daily-spend${q ? '?' + q : ''}`) }
  saveFbAccounts(ids) { return this.post('/api/ads/fb/save-accounts', { account_ids: ids }) }
  getRates(base) { return this.get(`/api/currency/rates?base=${base}`) }
}

export const api = new ApiClient()
