import { useQuery, useMutation } from '@tanstack/react-query';
import { understandingPlatformApi } from '@services/api/understanding-platform.api';

export function useIntelligenceHistory(take?: number) {
  return useQuery({
    queryKey: ['understanding-platform', 'history', take],
    queryFn: () => understandingPlatformApi.getHistory(take),
  });
}

export function useIntelligenceResponses(organizationId?: string) {
  return useQuery({
    queryKey: ['understanding-platform', 'responses', organizationId],
    queryFn: () => understandingPlatformApi.getResponses(organizationId),
  });
}

export function useIntelligenceCitations(organizationId?: string) {
  return useQuery({
    queryKey: ['understanding-platform', 'citations', organizationId],
    queryFn: () => understandingPlatformApi.getCitations(organizationId),
  });
}

export function useCrossModelStats() {
  return useQuery({
    queryKey: ['understanding-platform', 'models'],
    queryFn: () => understandingPlatformApi.getModels(),
  });
}

export function useWarehouseStats() {
  return useQuery({
    queryKey: ['understanding-platform', 'warehouse'],
    queryFn: () => understandingPlatformApi.getWarehouseStats(),
  });
}

export function useReplayResponse() {
  return useMutation({
    mutationFn: (responseId: string) => understandingPlatformApi.replayResponse(responseId),
  });
}
