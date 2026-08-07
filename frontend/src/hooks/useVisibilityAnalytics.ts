import { useQuery } from '@tanstack/react-query';
import * as visibilityApi from '@services/api/visibility.api';

export function useVisibilityScore(organizationId?: string) {
  return useQuery({
    queryKey: ['visibilityScore', organizationId],
    queryFn: () => visibilityApi.getVisibilityScore(organizationId!),
    enabled: Boolean(organizationId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useVisibilityHistory(profileId?: string, days = 30) {
  return useQuery({
    queryKey: ['visibilityHistory', profileId, days],
    queryFn: () => visibilityApi.getVisibilityHistory(profileId!, days),
    enabled: Boolean(profileId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useVisibilityTrends(profileId?: string) {
  return useQuery({
    queryKey: ['visibilityTrends', profileId],
    queryFn: () => visibilityApi.getVisibilityTrends(profileId!),
    enabled: Boolean(profileId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['visibilityLeaderboard'],
    queryFn: () => visibilityApi.getLeaderboard(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useVisibilityBenchmarks(industry?: string) {
  return useQuery({
    queryKey: ['visibilityBenchmarks', industry],
    queryFn: () => visibilityApi.getVisibilityBenchmarks(industry),
    staleTime: 5 * 60 * 1000,
  });
}

export function useVisibilityInsights(profileId?: string) {
  return useQuery({
    queryKey: ['visibilityInsights', profileId],
    queryFn: () => visibilityApi.getVisibilityInsights(profileId!),
    enabled: Boolean(profileId),
    staleTime: 5 * 60 * 1000,
  });
}
