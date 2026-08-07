export interface SecurityDashboardData {
  securityScore: number;
  enterpriseGrade: string;
  threatsBlocked24h: number;
  activeSessions: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  protectionState: string;
}

export interface ThreatItem {
  id: string;
  type: string;
  sourceIp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'MITIGATED' | 'BLOCKED';
  timestamp: string;
  description: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  resolvedAt?: string | null;
}

export interface RiskOverview {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threatSurface: string;
  protectionState: string;
}

export interface BlockedSummary {
  blockedIpsCount: number;
  blockedRequestsLast24h: number;
  permanentBansCount: number;
  temporaryBansCount: number;
}

export interface SessionSecuritySummary {
  activeSessionsCount: number;
  refreshTokenRotationsLast24h: number;
  suspiciousSessionsCount: number;
  revokedSessionsLast24h: number;
}

export interface DeviceStats {
  registeredDevicesCount: number;
  trustedDevicesCount: number;
  unknownDevicesLast24h: number;
  blockedDevicesCount: number;
}

export interface IpReputationStats {
  torNodesTrackedCount: number;
  vpnProvidersTrackedCount: number;
  maliciousIpFeedsActiveCount: number;
  permanentlyBannedIpsCount: number;
}

export interface SecurityAuditItem {
  id: string;
  action: string;
  actorId?: string;
  actorEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SecurityStats {
  securityScore: number;
  enterpriseGrade: string;
  certifications: string[];
  platformProtectionState: string;
}
