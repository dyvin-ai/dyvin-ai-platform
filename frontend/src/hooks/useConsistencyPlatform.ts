import { useQuery } from '@tanstack/react-query';
import { consistencyPlatformApi } from '@services/api/consistency-platform.api';

export function useModelConsistencyComparison() {
  return useQuery({
    queryKey: ['consistency-platform', 'models'],
    queryFn: () => consistencyPlatformApi.getModels(),
  });
}

export function useCompetitorConsistency() {
  return useQuery({
    queryKey: ['consistency-platform', 'competitors'],
    queryFn: () => consistencyPlatformApi.getCompetitors(),
  });
}

export function useConsistencyThreats() {
  return useQuery({
    queryKey: ['consistency-platform', 'threats'],
    queryFn: () => consistencyPlatformApi.getThreats(),
  });
}

export function useConsistencyStats() {
  return useQuery({
    queryKey: ['consistency-platform', 'statistics'],
    queryFn: () => consistencyPlatformApi.getStatistics(),
  });
}
