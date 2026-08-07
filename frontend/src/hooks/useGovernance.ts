import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi } from '@services/api/governance.api';

export function useGovernanceDashboard() {
  return useQuery({
    queryKey: ['governance', 'dashboard'],
    queryFn: () => governanceApi.getDashboard(),
  });
}

export function useGovernancePolicies(orgId?: string) {
  return useQuery({
    queryKey: ['governance', 'policies', orgId],
    queryFn: () => governanceApi.getPolicies(orgId),
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { organizationId: string; policyName: string; policyType?: string }) =>
      governanceApi.createPolicy(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'policies'] });
      queryClient.invalidateQueries({ queryKey: ['governance', 'dashboard'] });
    },
  });
}

export function useGovernanceApprovals(orgId?: string) {
  return useQuery({
    queryKey: ['governance', 'approvals', orgId],
    queryFn: () => governanceApi.getApprovals(orgId),
  });
}

export function useApproveWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { organizationId: string; workflowName: string; approverRole?: string }) =>
      governanceApi.approveWorkflow(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', 'approvals'] });
      queryClient.invalidateQueries({ queryKey: ['governance', 'dashboard'] });
    },
  });
}

export function useGovernanceRisk() {
  return useQuery({
    queryKey: ['governance', 'risk'],
    queryFn: () => governanceApi.getRisk(),
  });
}

export function useGovernanceCompliance() {
  return useQuery({
    queryKey: ['governance', 'compliance'],
    queryFn: () => governanceApi.getCompliance(),
  });
}

export function useGovernanceExplainability(decisionId?: string) {
  return useQuery({
    queryKey: ['governance', 'explainability', decisionId],
    queryFn: () => governanceApi.getExplainability(decisionId),
  });
}

export function useGovernanceAudit() {
  return useQuery({
    queryKey: ['governance', 'audit'],
    queryFn: () => governanceApi.getAudit(),
  });
}
