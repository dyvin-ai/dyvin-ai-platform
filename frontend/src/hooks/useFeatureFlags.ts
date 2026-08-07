import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as featureFlagApi from '@services/api/feature-flag.api';
import type {
  CreateFeatureFlagRequest,
  UpdateFeatureFlagRequest,
} from '@app-types/feature-flag.types';

export function useFeatureFlags() {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: featureFlagApi.getFeatureFlags,
  });
}

export function useEvaluateFeatureFlag(
  key: string,
  params?: { organizationId?: string; country?: string; plan?: string }
) {
  return useQuery({
    queryKey: ['feature-flag-evaluate', key, params],
    queryFn: () => featureFlagApi.evaluateFeatureFlag(key, params),
    enabled: Boolean(key),
  });
}

export function useCreateFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeatureFlagRequest) => featureFlagApi.createFeatureFlag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
    },
  });
}

export function useUpdateFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeatureFlagRequest }) =>
      featureFlagApi.updateFeatureFlag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
    },
  });
}

export function useDeleteFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureFlagApi.deleteFeatureFlag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
    },
  });
}
