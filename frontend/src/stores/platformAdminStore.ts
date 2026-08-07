import { create } from 'zustand';

interface PlatformAdminStoreState {
  activeTenantFilter: string;
  selectedPlanCode: string | null;
  supportTicketDraft: { subject: string; priority: string } | null;
  featureFlagSearchQuery: string;
  setActiveTenantFilter: (filter: string) => void;
  setSelectedPlanCode: (code: string | null) => void;
  setSupportTicketDraft: (draft: { subject: string; priority: string } | null) => void;
  setFeatureFlagSearchQuery: (query: string) => void;
}

export const usePlatformAdminStore = create<PlatformAdminStoreState>((set) => ({
  activeTenantFilter: 'ALL',
  selectedPlanCode: null,
  supportTicketDraft: null,
  featureFlagSearchQuery: '',
  setActiveTenantFilter: (filter) => set({ activeTenantFilter: filter }),
  setSelectedPlanCode: (code) => set({ selectedPlanCode: code }),
  setSupportTicketDraft: (draft) => set({ supportTicketDraft: draft }),
  setFeatureFlagSearchQuery: (query) => set({ featureFlagSearchQuery: query }),
}));
