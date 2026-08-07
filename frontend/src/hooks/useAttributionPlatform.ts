import { useQuery } from '@tanstack/react-query';
import { attributionPlatformApi } from '@services/api/attribution-platform.api';

export function useAttributionOverview(orgId?: string) {
  return useQuery({
    queryKey: ['attribution-platform', 'overview', orgId],
    queryFn: () => attributionPlatformApi.getOverview(orgId),
  });
}

export function useRevenueImpact() {
  return useQuery({
    queryKey: ['attribution-platform', 'revenue-impact'],
    queryFn: () => attributionPlatformApi.getRevenueImpact(),
  });
}

export function usePipelineVelocity() {
  return useQuery({
    queryKey: ['attribution-platform', 'pipeline-velocity'],
    queryFn: () => attributionPlatformApi.getPipelineVelocity(),
  });
}

export function useAttributionStats() {
  return useQuery({
    queryKey: ['attribution-platform', 'statistics'],
    queryFn: () => attributionPlatformApi.getStatistics(),
  });
}
