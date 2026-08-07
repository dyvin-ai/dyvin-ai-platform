import { apiClient } from './client';
import type {
  GovernanceOverview,
  GovernancePolicyItem,
  WorkflowApprovalItem,
  RiskAssessment,
  ComplianceStatus,
  DecisionExplainability,
  AuditLogItem,
} from '@app-types/governance.types';

export const governanceApi = {
  getDashboard: async (): Promise<GovernanceOverview> => {
    const { data } = await apiClient.get<GovernanceOverview>('/api/v1/governance/dashboard');
    return data;
  },

  getPolicies: async (orgId?: string): Promise<GovernancePolicyItem[]> => {
    const { data } = await apiClient.get<GovernancePolicyItem[]>('/api/v1/governance/policies', {
      params: { orgId },
    });
    return data;
  },

  createPolicy: async (payload: { organizationId: string; policyName: string; policyType?: string }): Promise<GovernancePolicyItem> => {
    const { data } = await apiClient.post<GovernancePolicyItem>('/api/v1/governance/policies', payload);
    return data;
  },

  getApprovals: async (orgId?: string): Promise<WorkflowApprovalItem[]> => {
    const { data } = await apiClient.get<WorkflowApprovalItem[]>('/api/v1/governance/approvals', {
      params: { orgId },
    });
    return data;
  },

  approveWorkflow: async (payload: { organizationId: string; workflowName: string; approverRole?: string }): Promise<WorkflowApprovalItem> => {
    const { data } = await apiClient.post<WorkflowApprovalItem>('/api/v1/governance/approvals', payload);
    return data;
  },

  getRisk: async (): Promise<RiskAssessment> => {
    const { data } = await apiClient.get<RiskAssessment>('/api/v1/governance/risk');
    return data;
  },

  getCompliance: async (): Promise<ComplianceStatus> => {
    const { data } = await apiClient.get<ComplianceStatus>('/api/v1/governance/compliance');
    return data;
  },

  getExplainability: async (decisionId?: string): Promise<DecisionExplainability> => {
    const { data } = await apiClient.get<DecisionExplainability>('/api/v1/governance/explainability', {
      params: { decisionId },
    });
    return data;
  },

  getAudit: async (): Promise<AuditLogItem[]> => {
    const { data } = await apiClient.get<AuditLogItem[]>('/api/v1/governance/audit');
    return data;
  },

  getTrust: async () => {
    const { data } = await apiClient.get('/api/v1/governance/trust');
    return data;
  },
};
