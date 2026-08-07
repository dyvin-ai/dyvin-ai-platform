import { apiClient } from './client';
import type {
  StrategyRecommendationItem,
  StrategyEvidenceItem,
  StrategyExecutionPlanItem,
  RootCauseDiagnosis,
  StrategyForecastData,
  ImpactRoiData,
} from '@app-types/recommendation-platform.types';

export const recommendationPlatformApi = {
  getRecommendations: async (analysisId?: string): Promise<StrategyRecommendationItem[]> => {
    const { data } = await apiClient.get<StrategyRecommendationItem[]>('/api/v1/recommendations', {
      params: { analysisId },
    });
    return data;
  },

  getRecommendationDetails: async (id: string): Promise<StrategyRecommendationItem> => {
    const { data } = await apiClient.get<StrategyRecommendationItem>(`/api/v1/recommendations/${id}`);
    return data;
  },

  getEvidence: async (recommendationId: string): Promise<StrategyEvidenceItem[]> => {
    const { data } = await apiClient.get<StrategyEvidenceItem[]>('/api/v1/strategy/evidence', {
      params: { recommendationId },
    });
    return data;
  },

  getRootCauses: async (organizationId: string): Promise<RootCauseDiagnosis[]> => {
    const { data } = await apiClient.get<RootCauseDiagnosis[]>('/api/v1/strategy/root-causes', {
      params: { organizationId },
    });
    return data;
  },

  getImpactROI: async (strategyId: string): Promise<ImpactRoiData> => {
    const { data } = await apiClient.get<ImpactRoiData>('/api/v1/strategy/impact', {
      params: { strategyId },
    });
    return data;
  },

  getExecutionPlan: async (strategyId: string): Promise<StrategyExecutionPlanItem[]> => {
    const { data } = await apiClient.get<StrategyExecutionPlanItem[]>('/api/v1/strategy/execution-plan', {
      params: { strategyId },
    });
    return data;
  },

  getForecast: async (strategyId?: string): Promise<StrategyForecastData> => {
    const { data } = await apiClient.get<StrategyForecastData>('/api/v1/strategy/forecast', {
      params: { strategyId },
    });
    return data;
  },
};
