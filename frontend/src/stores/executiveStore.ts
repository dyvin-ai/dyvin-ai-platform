import { create } from 'zustand';

interface ExecutiveStoreState {
  selectedNodeId: string | null;
  autoRefreshCommandCenter: boolean;
  selectedUrgencyFilter: string;
  setSelectedNodeId: (id: string | null) => void;
  setAutoRefreshCommandCenter: (refresh: boolean) => void;
  setSelectedUrgencyFilter: (urgency: string) => void;
}

export const useExecutiveStore = create<ExecutiveStoreState>((set) => ({
  selectedNodeId: null,
  autoRefreshCommandCenter: true,
  selectedUrgencyFilter: 'ALL',
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setAutoRefreshCommandCenter: (refresh) => set({ autoRefreshCommandCenter: refresh }),
  setSelectedUrgencyFilter: (urgency) => set({ selectedUrgencyFilter: urgency }),
}));
