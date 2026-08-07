import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceDashboardService } from './services/governance-dashboard.service';
import { PolicyEngineService } from './services/policy-engine.service';
import { ApprovalWorkflowService } from './services/approval-workflow.service';
import { ResponsibleAIService } from './services/responsible-ai.service';
import { ExplainabilityService } from './services/explainability.service';
import { RiskManagementService } from './services/risk-management.service';
import { ComplianceService } from './services/compliance.service';
import { AuditCenterService } from './services/audit-center.service';
import { TrustCenterService } from './services/trust-center.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase Y: Enterprise AI Governance Spec', () => {
  let dashboardService: GovernanceDashboardService;
  let policyService: PolicyEngineService;
  let approvalService: ApprovalWorkflowService;
  let responsibleAiService: ResponsibleAIService;
  let explainabilityService: ExplainabilityService;
  let riskService: RiskManagementService;
  let complianceService: ComplianceService;
  let auditService: AuditCenterService;
  let trustService: TrustCenterService;

  const mockPrismaService = {
    governancePolicy: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'pol-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'pol-1', policyName: 'Zero PII Leakage' }]),
    },
    governanceApproval: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'appr-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'appr-1', status: 'APPROVED' }]),
    },
    responsibleAIScore: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'resp-1', ...data })),
    },
    explainabilityRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'exp-1', ...data })),
    },
    governanceRiskRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'risk-1', ...data })),
    },
    governanceAuditRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'aud-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'aud-1', actionSummary: 'Policy Created' }]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceDashboardService,
        PolicyEngineService,
        ApprovalWorkflowService,
        ResponsibleAIService,
        ExplainabilityService,
        RiskManagementService,
        ComplianceService,
        AuditCenterService,
        TrustCenterService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    dashboardService = module.get<GovernanceDashboardService>(GovernanceDashboardService);
    policyService = module.get<PolicyEngineService>(PolicyEngineService);
    approvalService = module.get<ApprovalWorkflowService>(ApprovalWorkflowService);
    responsibleAiService = module.get<ResponsibleAIService>(ResponsibleAIService);
    explainabilityService = module.get<ExplainabilityService>(ExplainabilityService);
    riskService = module.get<RiskManagementService>(RiskManagementService);
    complianceService = module.get<ComplianceService>(ComplianceService);
    auditService = module.get<AuditCenterService>(AuditCenterService);
    trustService = module.get<TrustCenterService>(TrustCenterService);
  });

  it('should enforce AI policies and process approval workflows', async () => {
    const policy = await policyService.createPolicy('org-1', 'Zero PII Leakage Policy');
    expect(policy.policyName).toBe('Zero PII Leakage Policy');
    expect(policy.isEnforced).toBe(true);

    const approval = await approvalService.approveWorkflow('org-1', 'Publish FAQ Schema Campaign', 'EXECUTIVE_APPROVER');
    expect(approval.status).toBe('APPROVED');
  });

  it('should evaluate Responsible AI safety ratings and decision explainability', async () => {
    const resp = await responsibleAiService.evaluateResponsibleAI();
    expect(resp.safetyRating).toBe(99.5);

    const exp = await explainabilityService.recordExplainability('dec-1', 'FAQ Schema recommendation based on ChatGPT citations');
    expect(exp.confidencePct).toBe(97.8);
  });

  it('should manage risk scores and check SOC2/ISO27001 compliance', async () => {
    const risk = await riskService.calculateRisk();
    expect(risk.riskScore).toBe(12.4);

    const comp = await complianceService.getComplianceStatus();
    expect(comp.soc2Ready).toBe(true);
    expect(comp.iso27001Ready).toBe(true);
  });

  it('should record immutable audit logs and track Trust Center security metrics', async () => {
    const audit = await auditService.recordAudit('Policy Enforcement Activated', 'user-admin');
    expect(audit.actionSummary).toBe('Policy Enforcement Activated');

    const trust = await trustService.getTrustStatus();
    expect(trust.trustIndex).toBe(99.4);
  });

  it('should provide executive governance dashboard metrics', async () => {
    const overview = await dashboardService.getDashboardOverview();
    expect(overview.policyComplianceScore).toBe(99.8);
  });
});
