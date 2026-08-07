import { useQuery } from '@tanstack/react-query';
import { observabilityPlatformApi } from '@services/api/observability-platform.api';

export function useObsPlatformHealth() {
  return useQuery({
    queryKey: ['observability-platform', 'health'],
    queryFn: () => observabilityPlatformApi.getHealth(),
    refetchInterval: 10000,
  });
}

export function useObsPlatformSlo() {
  return useQuery({
    queryKey: ['observability-platform', 'slo'],
    queryFn: () => observabilityPlatformApi.getSlo(),
  });
}

export function useObsPlatformAlerts() {
  return useQuery({
    queryKey: ['observability-platform', 'alerts'],
    queryFn: () => observabilityPlatformApi.getAlerts(),
  });
}

export function useObsPlatformIncidents() {
  return useQuery({
    queryKey: ['observability-platform', 'incidents'],
    queryFn: () => observabilityPlatformApi.getIncidents(),
  });
}

export function useObsPlatformCapacity() {
  return useQuery({
    queryKey: ['observability-platform', 'capacity'],
    queryFn: () => observabilityPlatformApi.getCapacity(),
  });
}

export function useObsPlatformDependencies() {
  return useQuery({
    queryKey: ['observability-platform', 'dependencies'],
    queryFn: () => observabilityPlatformApi.getDependencies(),
  });
}

export function useObsPlatformPrometheusMetrics() {
  return useQuery({
    queryKey: ['observability-platform', 'prometheus'],
    queryFn: () => observabilityPlatformApi.getPrometheusMetricsText(),
    refetchInterval: 15000,
  });
}
