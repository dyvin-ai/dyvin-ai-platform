import { apiClient } from './client';
import type {
  UnifiedBrandScoreSummary,
  ExplainabilityDecisionNode,
  GlobalCommandCenterTelemetry,
  ExecutiveStrategicDecision,
} from '@app-types/executive-platform.types';

export const executivePlatformApi = {
  getOverview: async (): Promise<UnifiedBrandScoreSummary> => {
    const { data } = await apiClient.get<UnifiedBrandScoreSummary>('/api/v1/intelligence/global');
    return data;
  },

  getExplainabilityNodes: async (): Promise<ExplainabilityDecisionNode[]> => {
    const { data } = await apiClient.get<ExplainabilityDecisionNode[]>('/api/v1/intelligence/global/sources');
    return data;
  },

  getCommandCenterTelemetry: async (): Promise<GlobalCommandCenterTelemetry> => {
    const { data } = await apiClient.get<GlobalCommandCenterTelemetry>('/api/v1/admin/health');
    return data;
  },

  getStrategicDecisions: async (): Promise<ExecutiveStrategicDecision[]> => {
    const { data } = await apiClient.get<ExecutiveStrategicDecision[]>('/api/v1/intelligence/global/trends');
    return data;
  },
};
