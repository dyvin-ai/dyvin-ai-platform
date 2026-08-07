import { apiClient } from './client';
import type {
  VisibilityProfile,
  CitationItem,
  CitationTimeline,
  CitationTrend,
  TopCitingDomain,
  VisibilityForecast,
} from '@app-types/brand.types';

export const brandApi = {
  getOverview: async (organizationId: string): Promise<VisibilityProfile> => {
    const { data } = await apiClient.get<VisibilityProfile>('/api/v1/visibility', {
      params: { organizationId },
    });
    return data;
  },

  getScore: async (organizationId: string): Promise<VisibilityProfile> => {
    const { data } = await apiClient.get<VisibilityProfile>('/api/v1/visibility/score', {
      params: { organizationId },
    });
    return data;
  },

  getHistory: async (profileId: string, days?: number): Promise<CitationTimeline[]> => {
    const { data } = await apiClient.get<CitationTimeline[]>('/api/v1/visibility/history', {
      params: { profileId, days },
    });
    return data;
  },

  getTrends: async (profileId: string): Promise<CitationTrend> => {
    const { data } = await apiClient.get<CitationTrend>('/api/v1/visibility/trends', {
      params: { profileId },
    });
    return data;
  },

  getForecast: async (profileId: string, days?: number): Promise<VisibilityForecast> => {
    const { data } = await apiClient.get<VisibilityForecast>('/api/v1/visibility/forecast', {
      params: { profileId, days },
    });
    return data;
  },

  getCitations: async (aiSearchProjectId?: string): Promise<CitationItem[]> => {
    const { data } = await apiClient.get<CitationItem[]>('/api/v1/citations', {
      params: { aiSearchProjectId },
    });
    return data;
  },

  getCitationTimeline: async (aiSearchProjectId?: string, days?: number): Promise<CitationTimeline[]> => {
    const { data } = await apiClient.get<CitationTimeline[]>('/api/v1/citations/timeline', {
      params: { aiSearchProjectId, days },
    });
    return data;
  },

  getTopDomains: async (): Promise<TopCitingDomain[]> => {
    const { data } = await apiClient.get<TopCitingDomain[]>('/api/v1/citations/domains');
    return data;
  },
};
