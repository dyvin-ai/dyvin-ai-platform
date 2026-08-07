export interface ConnectedIntegration {
  id: string;
  organizationId: string;
  providerId: string;
  providerName: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'NEEDS_REAUTH' | 'SYNCING';
  authType: 'OAUTH2' | 'API_KEY' | 'WEBHOOK';
  connectedAt: string;
  lastSyncedAt?: string;
}

export interface IntegrationProvider {
  id: string;
  name: string;
  category: 'CRM' | 'CMS' | 'ANALYTICS' | 'COMMUNICATION' | 'STORAGE';
  iconUrl?: string;
  authType: 'OAUTH2' | 'API_KEY';
}

export interface IntegrationStatus {
  totalConnected: number;
  activeSyncJobs: number;
  failedSyncJobs: number;
  healthScore: number;
}
