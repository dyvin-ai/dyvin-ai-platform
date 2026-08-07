import { apiClient } from './client';
import type {
  AiResponseLedgerItem,
  AiCitationLedgerItem,
  CrossModelStats,
  WarehouseStats,
} from '@app-types/understanding-platform.types';

export const understandingPlatformApi = {
  getHistory: async (take?: number): Promise<AiResponseLedgerItem[]> => {
    const { data } = await apiClient.get<AiResponseLedgerItem[]>('/api/v1/intelligence/history', {
      params: { take },
    });
    return data;
  },

  getResponses: async (organizationId?: string): Promise<AiResponseLedgerItem[]> => {
    const { data } = await apiClient.get<AiResponseLedgerItem[]>('/api/v1/intelligence/responses', {
      params: { organizationId },
    });
    return data;
  },

  getCitations: async (organizationId?: string): Promise<AiCitationLedgerItem[]> => {
    const { data } = await apiClient.get<AiCitationLedgerItem[]>('/api/v1/intelligence/citations', {
      params: { organizationId },
    });
    return data;
  },

  getModels: async (): Promise<CrossModelStats> => {
    const { data } = await apiClient.get<CrossModelStats>('/api/v1/intelligence/models');
    return data;
  },

  getWarehouseStats: async (): Promise<WarehouseStats> => {
    const { data } = await apiClient.get<WarehouseStats>('/api/v1/intelligence/warehouse');
    return data;
  },

  replayResponse: async (responseId: string) => {
    const { data } = await apiClient.get('/api/v1/intelligence/replay', {
      params: { responseId },
    });
    return data;
  },
};
