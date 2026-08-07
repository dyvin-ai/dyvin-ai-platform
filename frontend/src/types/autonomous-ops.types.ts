export interface OpsComponentHealth {
  componentName: string;
  status: 'UP' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  uptimePercentage: number;
}

export interface SreIncidentItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'RESOLVED' | 'INVESTIGATING' | 'MONITORING';
  autoRemediated: boolean;
  timestamp: string;
}

export interface CopilotChatMessage {
  id: string;
  sender: 'USER' | 'COPILOT';
  messageText: string;
  actionSuggested?: string;
  timestamp: string;
}

export interface CapacityForecastMetric {
  resourceName: string;
  currentUtilizationPercentage: number;
  projected30DayUtilization: number;
  recommendation: string;
}
