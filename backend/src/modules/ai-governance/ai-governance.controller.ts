import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GovernanceDashboardService } from './services/governance-dashboard.service';
import { PolicyEngineService } from './services/policy-engine.service';
import { ApprovalWorkflowService } from './services/approval-workflow.service';
import { ResponsibleAIService } from './services/responsible-ai.service';
import { ExplainabilityService } from './services/explainability.service';
import { RiskManagementService } from './services/risk-management.service';
import { ComplianceService } from './services/compliance.service';
import { AuditCenterService } from './services/audit-center.service';
import { TrustCenterService } from './services/trust-center.service';

@ApiTags('Enterprise AI Governance, Compliance & Trust Center')
@Controller('api/v1/governance')
export class AiGovernanceController {
  constructor(
    private readonly dashboardService: GovernanceDashboardService,
    private readonly policyService: PolicyEngineService,
    private readonly approvalService: ApprovalWorkflowService,
    private readonly responsibleAiService: ResponsibleAIService,
    private readonly explainabilityService: ExplainabilityService,
    private readonly riskService: RiskManagementService,
    private readonly complianceService: ComplianceService,
    private readonly auditService: AuditCenterService,
    private readonly trustService: TrustCenterService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get AI Governance executive dashboard telemetry' })
  async getDashboard() {
    return this.dashboardService.getDashboardOverview();
  }

  @Get('policies')
  @ApiOperation({ summary: 'List organization AI policies' })
  async getPolicies(@Query('orgId') orgId?: string) {
    return this.policyService.getPolicies(orgId || 'org-default');
  }

  @Post('policies')
  @ApiOperation({ summary: 'Create new AI governance policy' })
  async createPolicy(@Body() body: { organizationId: string; policyName: string; policyType?: string }) {
    return this.policyService.createPolicy(body.organizationId, body.policyName, body.policyType);
  }

  @Get('approvals')
  @ApiOperation({ summary: 'List pending & approved workflow approvals' })
  async getApprovals(@Query('orgId') orgId?: string) {
    return this.approvalService.getApprovals(orgId || 'org-default');
  }

  @Post('approvals')
  @ApiOperation({ summary: 'Grant human or executive workflow approval' })
  async approveWorkflow(@Body() body: { organizationId: string; workflowName: string; approverRole?: string }) {
    return this.approvalService.approveWorkflow(body.organizationId, body.workflowName, body.approverRole);
  }

  @Get('risk')
  @ApiOperation({ summary: 'Get AI risk management assessment' })
  async getRisk() {
    return this.riskService.getRiskAssessment();
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Get SOC2, ISO27001 & GDPR compliance status' })
  async getCompliance() {
    return this.complianceService.getComplianceStatus();
  }

  @Get('explainability')
  @ApiOperation({ summary: 'Get decision explainability & model reasoning chain' })
  async getExplainability(@Query('decisionId') decisionId?: string) {
    return this.explainabilityService.getExplainabilityDetails(decisionId || 'dec-default');
  }

  @Get('audit')
  @ApiOperation({ summary: 'Get immutable AI audit log history' })
  async getAudit() {
    return this.auditService.getAuditLogs();
  }

  @Get('trust')
  @ApiOperation({ summary: 'Get Trust Center security & health status' })
  async getTrust() {
    return this.trustService.getTrustStatus();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get AI Governance Platform statistics' })
  async getStatistics() {
    return {
      activeEnforcedPolicies: 24,
      totalAuditedActions: 18400,
      governanceStatus: 'ENTERPRISE_SOC2_ISO27001_COMPLIANT',
    };
  }
}
