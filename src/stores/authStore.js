import { create } from 'zustand'
import { api } from '@/lib/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  org: null,
  isLoading: true,
  isAuthenticated: false,

  init: async () => {
    const token = api.getToken()
    if (!token) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }
    try {
      const user = await api.me()
      const org = await api.getOrg()
      set({ user, org, isAuthenticated: true, isLoading: false })
    } catch {
      api.clearToken()
      set({ user: null, org: null, isAuthenticated: false, isLoading: false })
    }
  },

  login: async (email, password) => {
    const data = await api.login(email, password)
    api.setToken(data.token)
    const user = await api.me()
    const org = await api.getOrg()
    set({ user, org, isAuthenticated: true })
  },

  register: async (formData) => {
    const data = await api.register(formData)
    api.setToken(data.token)
    const user = await api.me()
    const org = await api.getOrg()
    set({ user, org, isAuthenticated: true })
  },

  logout: () => {
    api.clearToken()
    set({ user: null, org: null, isAuthenticated: false })
  },
}))
