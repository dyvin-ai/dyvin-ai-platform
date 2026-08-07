import { create } from 'zustand';

interface UnderstandingStoreState {
  selectedResponseId: string | null;
  selectedModelFilter: string;
  isHallucinationOnly: boolean;
  setSelectedResponseId: (id: string | null) => void;
  setSelectedModelFilter: (model: string) => void;
  setIsHallucinationOnly: (hallucinationOnly: boolean) => void;
}

export const useUnderstandingStore = create<UnderstandingStoreState>((set) => ({
  selectedResponseId: null,
  selectedModelFilter: 'ALL',
  isHallucinationOnly: false,
  setSelectedResponseId: (id) => set({ selectedResponseId: id }),
  setSelectedModelFilter: (model) => set({ selectedModelFilter: model }),
  setIsHallucinationOnly: (hallucinationOnly) => set({ isHallucinationOnly: hallucinationOnly }),
}));
