import { useQuery } from '@tanstack/react-query';
import { platformAdminApi } from '@services/api/platform-admin.api';

export function useBillingPlans() {
  return useQuery({
    queryKey: ['platform-admin', 'billing-plans'],
    queryFn: () => platformAdminApi.getPlans(),
  });
}

export function useBillingSubscription(orgId: string) {
  return useQuery({
    queryKey: ['platform-admin', 'subscription', orgId],
    queryFn: () => platformAdminApi.getSubscription(orgId),
    enabled: !!orgId,
  });
}

export function useBillingUsage(orgId: string) {
  return useQuery({
    queryKey: ['platform-admin', 'usage', orgId],
    queryFn: () => platformAdminApi.getUsage(orgId),
    enabled: !!orgId,
  });
}

export function useBillingInvoices(orgId: string) {
  return useQuery({
    queryKey: ['platform-admin', 'invoices', orgId],
    queryFn: () => platformAdminApi.getInvoices(orgId),
    enabled: !!orgId,
  });
}

export function useAdminTenants() {
  return useQuery({
    queryKey: ['platform-admin', 'tenants'],
    queryFn: () => platformAdminApi.getTenants(),
  });
}

export function useAdminSupportTickets(tenantId?: string) {
  return useQuery({
    queryKey: ['platform-admin', 'support-tickets', tenantId],
    queryFn: () => platformAdminApi.getSupportTickets(tenantId),
  });
}

export function useAdminAuditLogs() {
  return useQuery({
    queryKey: ['platform-admin', 'audit-logs'],
    queryFn: () => platformAdminApi.getAuditLogs(),
  });
}

export function useAdminFeatureFlags() {
  return useQuery({
    queryKey: ['platform-admin', 'feature-flags'],
    queryFn: () => platformAdminApi.getFeatureFlags(),
  });
}
