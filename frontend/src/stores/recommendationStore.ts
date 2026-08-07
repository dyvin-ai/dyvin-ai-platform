import { create } from 'zustand';

interface RecommendationStoreState {
  selectedAnalysisId: string | null;
  selectedRecommendationId: string | null;
  isEvidenceDrawerOpen: boolean;
  activeCategoryFilter: string;
  setSelectedAnalysisId: (id: string | null) => void;
  setSelectedRecommendationId: (id: string | null) => void;
  setIsEvidenceDrawerOpen: (open: boolean) => void;
  setActiveCategoryFilter: (category: string) => void;
}

export const useRecommendationStore = create<RecommendationStoreState>((set) => ({
  selectedAnalysisId: null,
  selectedRecommendationId: null,
  isEvidenceDrawerOpen: false,
  activeCategoryFilter: 'ALL',
  setSelectedAnalysisId: (id) => set({ selectedAnalysisId: id }),
  setSelectedRecommendationId: (id) => set({ selectedRecommendationId: id }),
  setIsEvidenceDrawerOpen: (open) => set({ isEvidenceDrawerOpen: open }),
  setActiveCategoryFilter: (category) => set({ activeCategoryFilter: category }),
}));
