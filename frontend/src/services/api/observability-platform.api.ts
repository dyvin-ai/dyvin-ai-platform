import { apiClient } from './client';
import type {
  SloMetricItem,
  AlertItem,
  IncidentLog,
  DependencyHealthItem,
} from '@app-types/observability-platform.types';

export const observabilityPlatformApi = {
  getHealth: async () => {
    const { data } = await apiClient.get('/api/v1/ops/health');
    return data;
  },

  getStatus: async () => {
    const { data } = await apiClient.get('/api/v1/ops/status');
    return data;
  },

  getSlo: async (): Promise<SloMetricItem[]> => {
    const { data } = await apiClient.get<SloMetricItem[]>('/api/v1/ops/slo');
    return data;
  },

  getSla: async () => {
    const { data } = await apiClient.get('/api/v1/ops/sla');
    return data;
  },

  getAlerts: async (): Promise<AlertItem[]> => {
    const { data } = await apiClient.get<AlertItem[]>('/api/v1/ops/alerts');
    return data;
  },

  getIncidents: async (): Promise<IncidentLog[]> => {
    const { data } = await apiClient.get<IncidentLog[]>('/api/v1/ops/incidents');
    return data;
  },

  getCapacity: async () => {
    const { data } = await apiClient.get('/api/v1/ops/capacity');
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

  getDependencies: async (): Promise<DependencyHealthItem[]> => {
    const { data } = await apiClient.get<DependencyHealthItem[]>('/api/v1/ops/dependencies');
    return data;
  },

  getPrometheusMetricsText: async (): Promise<string> => {
    const { data } = await apiClient.get<string>('/metrics', {
      headers: { Accept: 'text/plain' },
    });
    return data;
  },
};
