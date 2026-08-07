import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as integrationApi from '@services/api/integration.api';
import toast from 'react-hot-toast';

export function useIntegrations(organizationId?: string) {
  return useQuery({
    queryKey: ['integrations', organizationId],
    queryFn: () => integrationApi.getIntegrations(organizationId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useIntegrationProviders() {
  return useQuery({
    queryKey: ['integrationProviders'],
    queryFn: () => integrationApi.getProviders(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useIntegrationStatus(organizationId?: string) {
  return useQuery({
    queryKey: ['integrationStatus', organizationId],
    queryFn: () => integrationApi.getIntegrationStatus(organizationId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useConnectIntegration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { providerId: string; authData: Record<string, any> }) =>
      integrationApi.connectIntegration(data),
    onSuccess: () => {
      toast.success('Integration connected successfully');
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to connect integration');
    },
  });
}

export function useSyncIntegration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integrationId, direction }: { integrationId: string; direction?: string }) =>
      integrationApi.syncIntegration(integrationId, direction),
    onSuccess: () => {
      toast.success('Synchronization job queued');
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });
}
