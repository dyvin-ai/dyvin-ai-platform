import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as securityApi from '@services/api/security.api';

export function useSecurityDashboard() {
  return useQuery({
    queryKey: ['security-dashboard'],
    queryFn: securityApi.getDashboard,
    refetchInterval: 30000,
  });
}

export function useSecurityThreats() {
  return useQuery({
    queryKey: ['security-threats'],
    queryFn: securityApi.getThreats,
  });
}

export function useSecurityIncidents() {
  return useQuery({
    queryKey: ['security-incidents'],
    queryFn: securityApi.getIncidents,
  });
}

export function useSecurityRisk() {
  return useQuery({
    queryKey: ['security-risk'],
    queryFn: securityApi.getRisk,
  });
}

export function useBlockedSummary() {
  return useQuery({
    queryKey: ['security-blocked'],
    queryFn: securityApi.getBlockedSummary,
  });
}

export function useSessionsSummary() {
  return useQuery({
    queryKey: ['security-sessions'],
    queryFn: securityApi.getSessionsSummary,
  });
}

export function useDevicesStats() {
  return useQuery({
    queryKey: ['security-devices'],
    queryFn: securityApi.getDevicesStats,
  });
}

export function useIpReputation() {
  return useQuery({
    queryKey: ['security-ip-reputation'],
    queryFn: securityApi.getIpReputation,
  });
}

export function useSecurityAudit() {
  return useQuery({
    queryKey: ['security-audit'],
    queryFn: securityApi.getSecurityAudit,
  });
}

export function useSecurityStatistics() {
  return useQuery({
    queryKey: ['security-statistics'],
    queryFn: securityApi.getSecurityStatistics,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => securityApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['security-dashboard'] });
    },
  });
}
