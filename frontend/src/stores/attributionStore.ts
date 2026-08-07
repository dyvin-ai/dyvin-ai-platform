import { create } from 'zustand';

interface AttributionStoreState {
  selectedAttributionModel: 'MULTI_TOUCH' | 'FIRST_TOUCH' | 'LAST_TOUCH' | 'AI_LINEAR';
  selectedTimeframe: '30D' | '90D' | '1Y';
  selectedJourneyId: string | null;
  setSelectedAttributionModel: (model: 'MULTI_TOUCH' | 'FIRST_TOUCH' | 'LAST_TOUCH' | 'AI_LINEAR') => void;
  setSelectedTimeframe: (timeframe: '30D' | '90D' | '1Y') => void;
  setSelectedJourneyId: (id: string | null) => void;
}

export const useAttributionStore = create<AttributionStoreState>((set) => ({
  selectedAttributionModel: 'MULTI_TOUCH',
  selectedTimeframe: '30D',
  selectedJourneyId: null,
  setSelectedAttributionModel: (model) => set({ selectedAttributionModel: model }),
  setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  setSelectedJourneyId: (id) => set({ selectedJourneyId: id }),
}));
