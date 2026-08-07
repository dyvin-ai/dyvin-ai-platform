import { useQuery } from '@tanstack/react-query';
import { autonomousOpsApi } from '@services/api/autonomous-ops.api';

export function useAutonomousOpsHealth() {
  return useQuery({
    queryKey: ['autonomous-ops', 'health'],
    queryFn: () => autonomousOpsApi.getHealth(),
    refetchInterval: 15000,
  });
}

export function useAutonomousOpsIncidents() {
  return useQuery({
    queryKey: ['autonomous-ops', 'incidents'],
    queryFn: () => autonomousOpsApi.getIncidents(),
  });
}

export function useAutonomousOpsCapacity() {
  return useQuery({
    queryKey: ['autonomous-ops', 'capacity'],
    queryFn: () => autonomousOpsApi.getCapacity(),
  });
}

export function useAutonomousOpsCosts() {
  return useQuery({
    queryKey: ['autonomous-ops', 'costs'],
    queryFn: () => autonomousOpsApi.getCosts(),
  });
}

export function useAutonomousOpsPerformance() {
  return useQuery({
    queryKey: ['autonomous-ops', 'performance'],
    queryFn: () => autonomousOpsApi.getPerformance(),
  });
}
