import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitorApi } from '@services/api/competitor-intelligence.api';
import type { CreateCompetitorInput } from '@app-types/competitor-intelligence.types';

export function useCompetitors(organizationId?: string) {
  return useQuery({
    queryKey: ['competitors', organizationId],
    queryFn: () => competitorApi.getCompetitors(organizationId),
  });
}

export function useCreateCompetitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCompetitorInput) => competitorApi.createCompetitor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
    },
  });
}

export function useCompetitorComparisons(competitorId?: string) {
  return useQuery({
    queryKey: ['competitors', 'comparisons', competitorId],
    queryFn: () => competitorApi.getComparisons(competitorId),
  });
}

export function useCompetitorBenchmarks(industry?: string) {
  return useQuery({
    queryKey: ['competitors', 'benchmarks', industry],
    queryFn: () => competitorApi.getBenchmarks(industry),
  });
}

export function useCompetitorInsights(competitorId?: string) {
  return useQuery({
    queryKey: ['competitors', 'insights', competitorId],
    queryFn: () => competitorApi.getInsights(competitorId),
  });
}

export function useRunComparison() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { competitorId: string; targetUrl?: string }) => competitorApi.runComparison(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors', 'comparisons'] });
    },
  });
}

export function useDeleteCompetitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => competitorApi.deleteCompetitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
    },
  });
}
