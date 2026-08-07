import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiSearchApi } from '@services/api/ai-search.api';

export function useAiSearchDashboard() {
  return useQuery({
    queryKey: ['ai-search', 'dashboard'],
    queryFn: () => aiSearchApi.getDashboard(),
  });
}

export function useAiSearchVisibility(orgId?: string) {
  return useQuery({
    queryKey: ['ai-search', 'visibility', orgId],
    queryFn: () => aiSearchApi.getVisibility(orgId),
  });
}

export function useAiSearchPrompts(orgId?: string) {
  return useQuery({
    queryKey: ['ai-search', 'prompts', orgId],
    queryFn: () => aiSearchApi.getPrompts(orgId),
  });
}

export function useTrackPrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { organizationId: string; promptText: string; modelName?: string }) =>
      aiSearchApi.trackPrompt(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-search', 'prompts'] });
      queryClient.invalidateQueries({ queryKey: ['ai-search', 'dashboard'] });
    },
  });
}

export function useAiSearchCitations() {
  return useQuery({
    queryKey: ['ai-search', 'citations'],
    queryFn: () => aiSearchApi.getCitations(),
  });
}

export function useAiSearchModels() {
  return useQuery({
    queryKey: ['ai-search', 'models'],
    queryFn: () => aiSearchApi.getModels(),
  });
}

export function useAiSearchCompetitors() {
  return useQuery({
    queryKey: ['ai-search', 'competitors'],
    queryFn: () => aiSearchApi.getCompetitors(),
  });
}

export function useAiSearchDomains() {
  return useQuery({
    queryKey: ['ai-search', 'domains'],
    queryFn: () => aiSearchApi.getDomains(),
  });
}

export function useAiSearchKeywords() {
  return useQuery({
    queryKey: ['ai-search', 'keywords'],
    queryFn: () => aiSearchApi.getKeywords(),
  });
}

export function useUploadKeywords() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { fileName: string; keywordsCount?: number }) =>
      aiSearchApi.uploadKeywords(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-search', 'keywords'] });
    },
  });
}

export function useAiSearchRecommendations() {
  return useQuery({
    queryKey: ['ai-search', 'recommendations'],
    queryFn: () => aiSearchApi.getRecommendations(),
  });
}

export function useExecuteGeoAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionType: string) => aiSearchApi.executeAction(actionType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-search', 'recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['ai-search', 'dashboard'] });
    },
  });
}
