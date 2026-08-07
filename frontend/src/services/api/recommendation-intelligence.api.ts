import { apiClient } from './client';
import type {
  RecommendationItem,
  RecommendationEvidence,
  RecommendationDependency,
} from '@app-types/recommendation-intelligence.types';

export const recommendationApi = {
  getRecommendations: async (analysisId?: string): Promise<RecommendationItem[]> => {
    const { data } = await apiClient.get<RecommendationItem[]>('/api/v1/recommendations', {
      params: { analysisId },
    });
    return data;
  },

  getRecommendationDetails: async (id: string): Promise<RecommendationItem> => {
    const { data } = await apiClient.get<RecommendationItem>(`/api/v1/recommendations/${id}`);
    return data;
  },

  getEvidence: async (id: string): Promise<RecommendationEvidence[]> => {
    const { data } = await apiClient.get<RecommendationEvidence[]>(`/api/v1/recommendations/${id}/evidence`);
    return data;
  },

  getDependencies: async (id: string): Promise<RecommendationDependency[]> => {
    const { data } = await apiClient.get<RecommendationDependency[]>(`/api/v1/recommendations/${id}/dependencies`);
    return data;
  },

  generateRecommendations: async (analysisId: string) => {
    const { data } = await apiClient.post(`/api/v1/analysis/${analysisId}/recommendations`);
    return data;
  },
};
