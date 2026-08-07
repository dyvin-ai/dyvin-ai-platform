import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationApi } from '@services/api/recommendation-intelligence.api';

export function useRecommendations(analysisId?: string) {
  return useQuery({
    queryKey: ['recommendations', analysisId],
    queryFn: () => recommendationApi.getRecommendations(analysisId),
  });
}

export function useRecommendationDetails(id: string) {
  return useQuery({
    queryKey: ['recommendations', 'detail', id],
    queryFn: () => recommendationApi.getRecommendationDetails(id),
    enabled: !!id,
  });
}

export function useRecommendationEvidence(id: string) {
  return useQuery({
    queryKey: ['recommendations', 'evidence', id],
    queryFn: () => recommendationApi.getEvidence(id),
    enabled: !!id,
  });
}

export function useRecommendationDependencies(id: string) {
  return useQuery({
    queryKey: ['recommendations', 'dependencies', id],
    queryFn: () => recommendationApi.getDependencies(id),
    enabled: !!id,
  });
}

export function useGenerateRecommendations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (analysisId: string) => recommendationApi.generateRecommendations(analysisId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
}
