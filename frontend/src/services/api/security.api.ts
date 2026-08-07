import { client } from './client';
import type {
  SecurityDashboardData,
  ThreatItem,
  SecurityIncident,
  RiskOverview,
  BlockedSummary,
  SessionSecuritySummary,
  DeviceStats,
  IpReputationStats,
  SecurityAuditItem,
  SecurityStats,
} from '@app-types/security.types';

export async function getDashboard(): Promise<SecurityDashboardData> {
  const res = await client.get<SecurityDashboardData>('/api/v1/security/dashboard');
  return res.data;
}

export async function getThreats(): Promise<ThreatItem[]> {
  const res = await client.get<ThreatItem[]>('/api/v1/security/threats');
  return res.data;
}

export async function getIncidents(): Promise<SecurityIncident[]> {
  const res = await client.get<SecurityIncident[]>('/api/v1/security/incidents');
  return res.data;
}

export async function getRisk(): Promise<RiskOverview> {
  const res = await client.get<RiskOverview>('/api/v1/security/risk');
  return res.data;
}

export async function getBlockedSummary(): Promise<BlockedSummary> {
  const res = await client.get<BlockedSummary>('/api/v1/security/blocked');
  return res.data;
}

export async function getSessionsSummary(): Promise<SessionSecuritySummary> {
  const res = await client.get<SessionSecuritySummary>('/api/v1/security/sessions');
  return res.data;
}

export async function getDevicesStats(): Promise<DeviceStats> {
  const res = await client.get<DeviceStats>('/api/v1/security/devices');
  return res.data;
}

export async function getIpReputation(): Promise<IpReputationStats> {
  const res = await client.get<IpReputationStats>('/api/v1/security/ip-reputation');
  return res.data;
}

export async function getSecurityAudit(): Promise<SecurityAuditItem[]> {
  const res = await client.get<SecurityAuditItem[]>('/api/v1/security/audit');
  return res.data;
}

export async function getSecurityStatistics(): Promise<SecurityStats> {
  const res = await client.get<SecurityStats>('/api/v1/security/statistics');
  return res.data;
}

export async function revokeSession(sessionId: string): Promise<{ success: boolean }> {
  const res = await client.post<{ success: boolean }>('/api/v1/security/revoke-session', {
    sessionId,
  });
  return res.data;
}

export async function unlockAccount(email: string): Promise<{ success: boolean }> {
  const res = await client.post<{ success: boolean }>('/api/v1/security/unlock-account', {
    email,
  });
  return res.data;
}
