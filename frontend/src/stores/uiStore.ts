import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UiStore {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  globalLoading: boolean;
  globalLoadingMessage: string | null;
  mobileMenuOpen: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      globalLoading: false,
      globalLoadingMessage: null,
      mobileMenuOpen: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setGlobalLoading: (loading, message) =>
        set({ globalLoading: loading, globalLoadingMessage: message ?? null }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'dyvin-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
);
