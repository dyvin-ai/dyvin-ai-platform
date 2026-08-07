import { apiClient } from './client';
import type {
  BillingPlan,
  SubscriptionOverview,
  UsageMetric,
  InvoiceItem,
  TenantItem,
  SupportTicketItem,
  FeatureFlagItem,
  AuditLogEntry,
} from '@app-types/platform-admin.types';

export const platformAdminApi = {
  // Billing endpoints
  getPlans: async (): Promise<BillingPlan[]> => {
    const { data } = await apiClient.get<BillingPlan[]>('/billing/plans');
    return data;
  },

  getSubscription: async (orgId: string): Promise<SubscriptionOverview> => {
    const { data } = await apiClient.get<SubscriptionOverview>('/billing/subscription', {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getUsage: async (orgId: string): Promise<UsageMetric[]> => {
    const { data } = await apiClient.get<UsageMetric[]>('/billing/usage', {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  getInvoices: async (orgId: string): Promise<InvoiceItem[]> => {
    const { data } = await apiClient.get<InvoiceItem[]>('/billing/invoices', {
      headers: { 'x-organization-id': orgId },
    });
    return data;
  },

  // Admin platform endpoints
  getTenants: async (): Promise<TenantItem[]> => {
    const { data } = await apiClient.get<TenantItem[]>('/api/v1/admin/tenants');
    return data;
  },

  getSupportTickets: async (tenantId?: string): Promise<SupportTicketItem[]> => {
    const { data } = await apiClient.get<SupportTicketItem[]>('/api/v1/admin/support', {
      params: tenantId ? { tenantId } : undefined,
    });
    return data;
  },

  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    const { data } = await apiClient.get<AuditLogEntry[]>('/api/v1/admin/audit');
    return data;
  },

  getAdminHealth: async () => {
    const { data } = await apiClient.get('/api/v1/admin/health');
    return data;
  },

  getAdminUsage: async () => {
    const { data } = await apiClient.get('/api/v1/admin/usage');
    return data;
  },

  getLicenses: async (tenantId?: string) => {
    const { data } = await apiClient.get('/api/v1/admin/licenses', {
      params: tenantId ? { tenantId } : undefined,
    });
    return data;
  },

  // Feature flags
  getFeatureFlags: async (): Promise<FeatureFlagItem[]> => {
    const { data } = await apiClient.get<FeatureFlagItem[]>('/feature-flags');
    return data;
  },
};
