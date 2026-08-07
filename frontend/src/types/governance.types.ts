export interface GovernanceOverview {
  complianceScore: number; // 0 - 100
  activePoliciesCount: number;
  pendingApprovalsCount: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  soc2Status: 'COMPLIANT' | 'AUDIT_IN_PROGRESS' | 'ACTION_REQUIRED';
  iso27001Status: 'COMPLIANT' | 'AUDIT_IN_PROGRESS';
  gdprStatus: 'COMPLIANT';
}

export interface GovernancePolicyItem {
  id: string;
  organizationId: string;
  policyName: string;
  policyType: 'SAFETY' | 'PRIVACY' | 'BIAS' | 'SECURITY' | 'DATA_RETENTION';
  status: 'ENFORCED' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
}

export interface WorkflowApprovalItem {
  id: string;
  organizationId: string;
  workflowName: string;
  requestedBy: string;
  approverRole: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export interface RiskAssessment {
  overallRiskScore: number;
  riskCategories: {
    category: string;
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    mitigationStatus: string;
  }[];
}

export interface ComplianceStatus {
  soc2Score: number;
  iso27001Score: number;
  gdprScore: number;
  hipaaScore: number;
  lastAuditDate: string;
  passedChecks: number;
  totalChecks: number;
}

export interface DecisionExplainability {
  decisionId: string;
  actionTaken: string;
  modelConfidence: number;
  reasoningChain: string[];
  factorsConsidered: { factor: string; weight: number }[];
  auditProvenance: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  hashProvenance: string;
}
