import { get } from './client';

export interface CustomerDashboardData {
  organizationId: string;
  warehouseStatus: string;
  tenantMemorySize: string;
  knowledgeNodesCount: number;
}

export async function getCustomerIntelligenceDashboard(orgId?: string): Promise<CustomerDashboardData> {
  return get<CustomerDashboardData>('/api/v1/customer-intelligence/dashboard', { params: { orgId } });
}

export async function getCustomerTimeline(orgId?: string) {
  return get('/api/v1/customer-intelligence/timeline', { params: { orgId } });
}

export async function getCustomerMemory(orgId?: string) {
  return get('/api/v1/customer-intelligence/memory', { params: { orgId } });
}

export async function getCustomerKnowledge(orgId?: string) {
  return get('/api/v1/customer-intelligence/knowledge', { params: { orgId } });
}

export async function getCustomerWarehouse(orgId?: string) {
  return get('/api/v1/customer-intelligence/warehouse', { params: { orgId } });
}

export async function verifyCustomerPrivacy(orgId?: string) {
  return get('/api/v1/customer-intelligence/privacy', { params: { orgId } });
}
