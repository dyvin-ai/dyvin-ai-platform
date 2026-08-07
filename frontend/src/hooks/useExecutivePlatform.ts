import { useQuery } from '@tanstack/react-query';
import { executivePlatformApi } from '@services/api/executive-platform.api';

export function useExecutiveOverview() {
  return useQuery({
    queryKey: ['executive-platform', 'overview'],
    queryFn: () => executivePlatformApi.getOverview(),
  });
}

export function useExplainabilityNodes() {
  return useQuery({
    queryKey: ['executive-platform', 'explainability'],
    queryFn: () => executivePlatformApi.getExplainabilityNodes(),
  });
}

export function useCommandCenterTelemetry() {
  return useQuery({
    queryKey: ['executive-platform', 'command-center'],
    queryFn: () => executivePlatformApi.getCommandCenterTelemetry(),
    refetchInterval: 10000,
  });
}

export function useStrategicDecisions() {
  return useQuery({
    queryKey: ['executive-platform', 'strategic-decisions'],
    queryFn: () => executivePlatformApi.getStrategicDecisions(),
  });
}
