import { apiClient } from './client';
import type {
  AttributionMetricSummary,
  RevenueImpactItem,
  PipelineStageVelocity,
} from '@app-types/attribution-platform.types';

export const attributionPlatformApi = {
  getOverview: async (orgId?: string): Promise<AttributionMetricSummary> => {
    const { data } = await apiClient.get<AttributionMetricSummary>('/api/v1/execution/dashboard', {
      params: { orgId },
    });
    return data;
  },

  getRevenueImpact: async (): Promise<RevenueImpactItem[]> => {
    const { data } = await apiClient.get<RevenueImpactItem[]>('/api/v1/execution/opportunities');
    return data;
  },

  getPipelineVelocity: async (): Promise<PipelineStageVelocity[]> => {
    const { data } = await apiClient.get<PipelineStageVelocity[]>('/api/v1/execution/strategies');
    return data;
  },

  getStatistics: async () => {
    const { data } = await apiClient.get('/api/v1/execution/statistics');
    return data;
  },
};
