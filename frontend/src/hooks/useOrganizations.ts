import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useOrgStore } from '@stores/orgStore';
import * as orgApi from '@services/api/org.api';
import type {
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  CreateInvitationRequest,
} from '@app-types/org.types';

const QUERY_KEYS = {
  orgs: ['organizations'] as const,
  org: (id: string) => ['organizations', id] as const,
};

export function useOrganizations() {
  const { setOrganizations } = useOrgStore();

  return useQuery({
    queryKey: QUERY_KEYS.orgs,
    queryFn: async () => {
      const orgs = await orgApi.getUserOrganizations();
      setOrganizations(orgs);
      return orgs;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useOrganization(orgId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.org(orgId),
    queryFn: () => orgApi.getOrganizationDetails(orgId),
    enabled: !!orgId,
  });
}

export const useOrgDetails = useOrganization;

export function useCreateOrganization() {
  const qc = useQueryClient();
  const { addOrganization, setActiveOrg } = useOrgStore();

  return useMutation({
    mutationFn: (data: CreateOrganizationRequest) => orgApi.createOrganization(data),
    onSuccess: (org) => {
      addOrganization(org);
      setActiveOrg(org);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orgs });
      toast.success('Organization created!');
    },
    onError: () => {
      toast.error('Failed to create organization.');
    },
  });
}

export function useUpdateOrganization(orgId: string) {
  const qc = useQueryClient();
  const { updateOrganization } = useOrgStore();

  return useMutation({
    mutationFn: (data: UpdateOrganizationRequest) => orgApi.updateOrganization(orgId, data),
    onSuccess: (updated) => {
      updateOrganization(orgId, updated);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orgs });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.org(orgId) });
      toast.success('Organization updated!');
    },
    onError: () => {
      toast.error('Failed to update organization.');
    },
  });
}

export function useCreateInvitation(orgId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvitationRequest) => orgApi.createInvitation(orgId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.org(orgId) });
      toast.success('Invitation sent!');
    },
    onError: () => {
      toast.error('Failed to send invitation.');
    },
  });
}
