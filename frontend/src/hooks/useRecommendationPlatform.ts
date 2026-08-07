import { useQuery } from '@tanstack/react-query';
import { recommendationPlatformApi } from '@services/api/recommendation-platform.api';

export function useRecommendationList(analysisId?: string) {
  return useQuery({
    queryKey: ['recommendation-platform', 'list', analysisId],
    queryFn: () => recommendationPlatformApi.getRecommendations(analysisId),
  });
}

export function useRecommendationPlatformEvidence(recommendationId: string) {
  return useQuery({
    queryKey: ['recommendation-platform', 'evidence', recommendationId],
    queryFn: () => recommendationPlatformApi.getEvidence(recommendationId),
    enabled: !!recommendationId,
  });
}

export function useRootCauses(organizationId: string) {
  return useQuery({
    queryKey: ['recommendation-platform', 'root-causes', organizationId],
    queryFn: () => recommendationPlatformApi.getRootCauses(organizationId),
    enabled: !!organizationId,
  });
}

export function useImpactROI(strategyId: string) {
  return useQuery({
    queryKey: ['recommendation-platform', 'impact-roi', strategyId],
    queryFn: () => recommendationPlatformApi.getImpactROI(strategyId),
    enabled: !!strategyId,
  });
}

export function useExecutionPlan(strategyId: string) {
  return useQuery({
    queryKey: ['recommendation-platform', 'execution-plan', strategyId],
    queryFn: () => recommendationPlatformApi.getExecutionPlan(strategyId),
    enabled: !!strategyId,
  });
}

export function useStrategyForecast(strategyId?: string) {
  return useQuery({
    queryKey: ['recommendation-platform', 'forecast', strategyId],
    queryFn: () => recommendationPlatformApi.getForecast(strategyId),
  });
}
