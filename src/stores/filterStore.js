import { create } from 'zustand'

export const useFilterStore = create((set) => ({
  days: 3,
  country: '',
  store_id: '',
  product_group: '',

  setDays: (days) => set({ days }),
  setCountry: (country) => set({ country }),
  setStore: (store_id) => set({ store_id }),
  setProductGroup: (product_group) => set({ product_group }),
  getParams: () => {
    const state = useFilterStore.getState()
    const p = {}
    if (state.days) p.days = state.days
    if (state.country) p.country = state.country
    if (state.store_id) p.store_id = state.store_id
    if (state.product_group) p.product_group = state.product_group
    return p
  },
}))
