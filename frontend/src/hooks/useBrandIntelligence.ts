import { useQuery } from '@tanstack/react-query';
import { brandApi } from '@services/api/brand.api';

export function useBrandOverview(organizationId: string) {
  return useQuery({
    queryKey: ['brand', 'overview', organizationId],
    queryFn: () => brandApi.getOverview(organizationId),
    enabled: !!organizationId,
  });
}

export function useBrandVisibilityHistory(profileId: string, days?: number) {
  return useQuery({
    queryKey: ['brand', 'history', profileId, days],
    queryFn: () => brandApi.getHistory(profileId, days),
    enabled: !!profileId,
  });
}

export function useBrandVisibilityTrends(profileId: string) {
  return useQuery({
    queryKey: ['brand', 'trends', profileId],
    queryFn: () => brandApi.getTrends(profileId),
    enabled: !!profileId,
  });
}

export function useVisibilityForecast(profileId: string, days?: number) {
  return useQuery({
    queryKey: ['brand', 'forecast', profileId, days],
    queryFn: () => brandApi.getForecast(profileId, days),
    enabled: !!profileId,
  });
}

export function useCitations(aiSearchProjectId?: string) {
  return useQuery({
    queryKey: ['brand', 'citations', aiSearchProjectId],
    queryFn: () => brandApi.getCitations(aiSearchProjectId),
  });
}

export function useCitationTopDomains() {
  return useQuery({
    queryKey: ['brand', 'top-domains'],
    queryFn: () => brandApi.getTopDomains(),
  });
}
