import { create } from 'zustand'

type UIState = {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  commandOpen: boolean
  darkMode: boolean
  selectedCompanyId: string
  toggleSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  setCommandOpen: (open: boolean) => void
  toggleTheme: () => void
  setSelectedCompanyId: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  commandOpen: false,
  darkMode: false,
  selectedCompanyId: 'c1',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  setCommandOpen: (open) => set({ commandOpen: open }),
  toggleTheme: () =>
    set((state) => {
      const next = !state.darkMode
      document.documentElement.classList.toggle('dark', next)
      return { darkMode: next }
    }),
  setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),
}))
