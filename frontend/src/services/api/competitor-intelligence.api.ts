import { apiClient } from './client';
import type {
  CompetitorItem,
  CreateCompetitorInput,
  UpdateCompetitorInput,
  CompetitorComparisonItem,
  IndustryBenchmarkItem,
  CompetitorInsightItem,
} from '@app-types/competitor-intelligence.types';

export const competitorApi = {
  createCompetitor: async (payload: CreateCompetitorInput): Promise<CompetitorItem> => {
    const { data } = await apiClient.post<CompetitorItem>('/api/v1/competitors', payload);
    return data;
  },

  getCompetitors: async (organizationId?: string): Promise<CompetitorItem[]> => {
    const { data } = await apiClient.get<CompetitorItem[]>('/api/v1/competitors', {
      params: { organizationId },
    });
    return data;
  },

  getComparisons: async (competitorId?: string): Promise<CompetitorComparisonItem[]> => {
    const { data } = await apiClient.get<CompetitorComparisonItem[]>('/api/v1/competitors/comparisons', {
      params: { competitorId },
    });
    return data;
  },

  getBenchmarks: async (industry?: string): Promise<IndustryBenchmarkItem> => {
    const { data } = await apiClient.get<IndustryBenchmarkItem>('/api/v1/competitors/benchmarks', {
      params: { industry },
    });
    return data;
  },

  getInsights: async (competitorId?: string): Promise<CompetitorInsightItem[]> => {
    const { data } = await apiClient.get<CompetitorInsightItem[]>('/api/v1/competitors/insights', {
      params: { competitorId },
    });
    return data;
  },

  runComparison: async (payload: { competitorId: string; targetUrl?: string }) => {
    const { data } = await apiClient.post('/api/v1/competitors/compare', payload);
    return data;
  },

  deleteCompetitor: async (id: string) => {
    const { data } = await apiClient.delete(`/api/v1/competitors/${id}`);
    return data;
  },
};
