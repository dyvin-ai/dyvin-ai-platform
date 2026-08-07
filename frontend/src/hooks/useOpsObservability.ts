import { useQuery } from '@tanstack/react-query';
import * as opsApi from '@services/api/ops.api';

export function useOpsHealth() {
  return useQuery({
    queryKey: ['opsHealth'],
    queryFn: () => opsApi.getOpsHealth(),
    refetchInterval: 5000,
  });
}

export function useOpsPerformance() {
  return useQuery({
    queryKey: ['opsPerformance'],
    queryFn: () => opsApi.getOpsPerformance(),
    refetchInterval: 5000,
  });
}

export function useOpsAlerts() {
  return useQuery({
    queryKey: ['opsAlerts'],
    queryFn: () => opsApi.getOpsAlerts(),
    refetchInterval: 10000,
  });
}
