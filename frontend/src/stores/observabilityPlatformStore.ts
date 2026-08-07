import { create } from 'zustand';

interface ObservabilityPlatformStoreState {
  selectedTraceId: string | null;
  autoRefreshIntervalSeconds: number;
  selectedAlertSeverityFilter: string;
  setSelectedTraceId: (id: string | null) => void;
  setAutoRefreshIntervalSeconds: (interval: number) => void;
  setSelectedAlertSeverityFilter: (severity: string) => void;
}

export const useObservabilityPlatformStore = create<ObservabilityPlatformStoreState>((set) => ({
  selectedTraceId: null,
  autoRefreshIntervalSeconds: 10,
  selectedAlertSeverityFilter: 'ALL',
  setSelectedTraceId: (id) => set({ selectedTraceId: id }),
  setAutoRefreshIntervalSeconds: (interval) => set({ autoRefreshIntervalSeconds: interval }),
  setSelectedAlertSeverityFilter: (severity) => set({ selectedAlertSeverityFilter: severity }),
}));
