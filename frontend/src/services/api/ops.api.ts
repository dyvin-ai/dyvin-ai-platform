import { get } from './client';

export interface OpsHealthRegistryItem {
  component: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  latencyMs: number;
  lastChecked: string;
}

export interface OpsPerformanceAnalytics {
  activeQueues: number;
  runningJobs: number;
  queuedJobs: number;
  failedJobs: number;
  workerHealthPercent: number;
  queueLatencyMs: number;
}

export async function getOpsHealth(): Promise<OpsHealthRegistryItem[]> {
  return get<OpsHealthRegistryItem[]>('/api/v1/ops/health');
}

export async function getOpsPerformance(): Promise<OpsPerformanceAnalytics> {
  return get<OpsPerformanceAnalytics>('/api/v1/ops/performance');
}

export async function getOpsAlerts() {
  return get('/api/v1/ops/alerts');
}
