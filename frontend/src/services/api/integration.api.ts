import { get, post } from './client';
import type { ConnectedIntegration, IntegrationProvider, IntegrationStatus } from '@app-types/integration.types';

export async function getIntegrations(organizationId?: string): Promise<ConnectedIntegration[]> {
  return get<ConnectedIntegration[]>('/api/v1/integrations', { params: { organizationId } });
}

export async function getProviders(): Promise<IntegrationProvider[]> {
  return get<IntegrationProvider[]>('/api/v1/integrations/providers');
}

export async function getIntegrationStatus(organizationId?: string): Promise<IntegrationStatus> {
  return get<IntegrationStatus>('/api/v1/integrations/status', { params: { organizationId } });
}

export async function connectIntegration(data: { providerId: string; authData: Record<string, any> }): Promise<ConnectedIntegration> {
  return post<ConnectedIntegration>('/api/v1/integrations/connect', data);
}

export async function disconnectIntegration(integrationId: string): Promise<{ success: boolean }> {
  return post<{ success: boolean }>('/api/v1/integrations/disconnect', { integrationId });
}

export async function syncIntegration(integrationId: string, direction?: string) {
  return post('/api/v1/integrations/sync', { integrationId, direction });
}
