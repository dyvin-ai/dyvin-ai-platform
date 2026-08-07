export interface SloMetricItem {
  name: string;
  targetPercentage: number;
  currentPercentage: number;
  errorBudgetRemainingPercentage: number;
  status: 'HEALTHY' | 'WARNING' | 'BREACHED';
}

export interface AlertItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  source: string;
  triggeredAt: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface IncidentLog {
  id: string;
  incidentTitle: string;
  serviceAffected: string;
  mttrMinutes: number;
  rootCauseSummary: string;
  resolvedAt: string;
}

export interface DependencyHealthItem {
  serviceName: string;
  provider: 'AWS' | 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'REDIS';
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  latencyMs: number;
}
