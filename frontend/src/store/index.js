import { create } from 'zustand'

export const myStore = create((set) => ({
  times: 0,
  increaseTime: () => set((state) => ({ times: state.times + 1 })),

}))

export const balance = create((set) => ({
    data : null,
    setData : (newData) => set({data : newData})
}))

export const loadingStore = create((set) => ({
    isLoading: true,
    setLoading: (loading) => set({ isLoading: loading }),
  }));