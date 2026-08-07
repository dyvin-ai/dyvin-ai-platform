import { apiClient } from './client';
import type {
  OpsComponentHealth,
  SreIncidentItem,
  CapacityForecastMetric,
} from '@app-types/autonomous-ops.types';

export const autonomousOpsApi = {
  getHealth: async (): Promise<OpsComponentHealth[]> => {
    const { data } = await apiClient.get<OpsComponentHealth[]>('/api/v1/ops/health');
    return data;
  },

  getIncidents: async (): Promise<SreIncidentItem[]> => {
    const { data } = await apiClient.get<SreIncidentItem[]>('/api/v1/ops/incidents');
    return data;
  },

  getCapacity: async (): Promise<CapacityForecastMetric[]> => {
    const { data } = await apiClient.get<CapacityForecastMetric[]>('/api/v1/ops/capacity');
    return data;
  },

  getCosts: async () => {
    const { data } = await apiClient.get('/api/v1/ops/costs');
    return data;
  },

  getPerformance: async () => {
    const { data } = await apiClient.get('/api/v1/ops/performance');
    return data;
  },
};
