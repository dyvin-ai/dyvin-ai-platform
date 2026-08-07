import { apiClient } from './client';
import type {
  AiSearchOverview,
  AiSearchVisibilityTrend,
  AiSearchPromptItem,
  CitationOverview,
  RetrievalAnalytics,
  ModelGeoComparison,
  CompetitorBenchmark,
  DomainAnalyticsItem,
  UrlAnalyticsItem,
  KeywordGeoItem,
  GeoRecommendationItem,
} from '@app-types/ai-search.types';

export const aiSearchApi = {
  getDashboard: async (): Promise<AiSearchOverview> => {
    const { data } = await apiClient.get<AiSearchOverview>('/api/v1/ai-search/dashboard');
    return data;
  },

  getVisibility: async (orgId?: string): Promise<AiSearchVisibilityTrend[]> => {
    const { data } = await apiClient.get<AiSearchVisibilityTrend[]>('/api/v1/ai-search/visibility', {
      params: { orgId },
    });
    return data;
  },

  getPrompts: async (orgId?: string): Promise<AiSearchPromptItem[]> => {
    const { data } = await apiClient.get<AiSearchPromptItem[]>('/api/v1/ai-search/prompts', {
      params: { orgId },
    });
    return data;
  },

  trackPrompt: async (payload: { organizationId: string; promptText: string; modelName?: string }): Promise<AiSearchPromptItem> => {
    const { data } = await apiClient.post<AiSearchPromptItem>('/api/v1/ai-search/prompts', payload);
    return data;
  },

  getCitations: async (): Promise<CitationOverview> => {
    const { data } = await apiClient.get<CitationOverview>('/api/v1/ai-search/citations');
    return data;
  },

  getRetrieval: async (): Promise<RetrievalAnalytics> => {
    const { data } = await apiClient.get<RetrievalAnalytics>('/api/v1/ai-search/retrieval');
    return data;
  },

  getModels: async (): Promise<ModelGeoComparison[]> => {
    const { data } = await apiClient.get<ModelGeoComparison[]>('/api/v1/ai-search/models');
    return data;
  },

  getCompetitors: async (): Promise<CompetitorBenchmark[]> => {
    const { data } = await apiClient.get<CompetitorBenchmark[]>('/api/v1/ai-search/competitors');
    return data;
  },

  getDomains: async (): Promise<DomainAnalyticsItem[]> => {
    const { data } = await apiClient.get<DomainAnalyticsItem[]>('/api/v1/ai-search/domains');
    return data;
  },

  getUrls: async (): Promise<UrlAnalyticsItem[]> => {
    const { data } = await apiClient.get<UrlAnalyticsItem[]>('/api/v1/ai-search/urls');
    return data;
  },

  getKeywords: async (): Promise<KeywordGeoItem[]> => {
    const { data } = await apiClient.get<KeywordGeoItem[]>('/api/v1/ai-search/keywords');
    return data;
  },

  uploadKeywords: async (payload: { fileName: string; keywordsCount?: number }) => {
    const { data } = await apiClient.post('/api/v1/ai-search/keywords/upload', payload);
    return data;
  },

  getRecommendations: async (): Promise<GeoRecommendationItem[]> => {
    const { data } = await apiClient.get<GeoRecommendationItem[]>('/api/v1/ai-search/recommendations');
    return data;
  },

  executeAction: async (actionType: string) => {
    const { data } = await apiClient.post('/api/v1/ai-search/actions', { actionType });
    return data;
  },
};
