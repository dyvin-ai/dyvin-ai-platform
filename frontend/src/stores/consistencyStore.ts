import { create } from 'zustand';

interface ConsistencyStoreState {
  selectedConflictId: string | null;
  selectedSeverityFilter: string;
  isDiffViewerOpen: boolean;
  setSelectedConflictId: (id: string | null) => void;
  setSelectedSeverityFilter: (severity: string) => void;
  setIsDiffViewerOpen: (open: boolean) => void;
}

export const useConsistencyStore = create<ConsistencyStoreState>((set) => ({
  selectedConflictId: null,
  selectedSeverityFilter: 'ALL',
  isDiffViewerOpen: false,
  setSelectedConflictId: (id) => set({ selectedConflictId: id }),
  setSelectedSeverityFilter: (severity) => set({ selectedSeverityFilter: severity }),
  setIsDiffViewerOpen: (open) => set({ isDiffViewerOpen: open }),
}));
