import { apiClient } from './client';
import type {
  ModelConsistencyMetric,
  CompetitorConsistencyItem,
  ResearchThreatItem,
} from '@app-types/consistency-platform.types';

export const consistencyPlatformApi = {
  getModels: async (): Promise<ModelConsistencyMetric[]> => {
    const { data } = await apiClient.get<ModelConsistencyMetric[]>('/api/v1/ai-search/models');
    return data;
  },

  getCompetitors: async (): Promise<CompetitorConsistencyItem[]> => {
    const { data } = await apiClient.get<CompetitorConsistencyItem[]>('/api/v1/ai-search/competitors');
    return data;
  },

  getThreats: async (): Promise<ResearchThreatItem[]> => {
    const { data } = await apiClient.get<ResearchThreatItem[]>('/api/v1/research/threats');
    return data;
  },

  getStatistics: async () => {
    const { data } = await apiClient.get('/api/v1/ai-search/statistics');
    return data;
  },
};
