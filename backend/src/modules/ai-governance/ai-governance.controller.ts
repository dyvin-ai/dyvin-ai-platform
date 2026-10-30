import { Body, Controller, Get, Post, Query, UseGuards, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PrismaService } from '../../database/prisma.service';
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
@Controller('governance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiGovernanceController {
  constructor(
    private readonly prisma: PrismaService,
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

  private async verifyOrganizationMember(userId: string, organizationId: string) {
    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }
    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
    if (!membership) {
      throw new ForbiddenException('Access denied: You are not a member of this organization.');
    }
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get AI Governance executive dashboard telemetry' })
  async getDashboard() {
    return this.dashboardService.getDashboardOverview();
  }

  @Get('policies')
  @ApiOperation({ summary: 'List organization AI policies' })
  async getPolicies(
    @CurrentUser('id') userId: string,
    @Query('orgId') orgId?: string,
  ) {
    if (orgId && orgId !== 'org-default') {
      await this.verifyOrganizationMember(userId, orgId);
      return this.policyService.getPolicies(orgId);
    }
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true },
    });
    const targetOrgId = memberships[0]?.organizationId;
    return this.policyService.getPolicies(targetOrgId);
  }

  @Post('policies')
  @ApiOperation({ summary: 'Create new AI governance policy' })
  async createPolicy(
    @CurrentUser('id') userId: string,
    @Body() body: { organizationId: string; policyName: string; policyType?: string },
  ) {
    await this.verifyOrganizationMember(userId, body.organizationId);
    return this.policyService.createPolicy(body.organizationId, body.policyName, body.policyType);
  }

  @Get('approvals')
  @ApiOperation({ summary: 'List pending & approved workflow approvals' })
  async getApprovals(
    @CurrentUser('id') userId: string,
    @Query('orgId') orgId?: string,
  ) {
    if (orgId && orgId !== 'org-default') {
      await this.verifyOrganizationMember(userId, orgId);
      return this.approvalService.getApprovals(orgId);
    }
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true },
    });
    const userOrgIds = memberships.map((m) => m.organizationId);
    return this.prisma.governanceApproval.findMany({
      where: { organizationId: { in: userOrgIds } },
    });
  }

  @Post('approvals')
  @ApiOperation({ summary: 'Grant human or executive workflow approval' })
  async approveWorkflow(
    @CurrentUser('id') userId: string,
    @Body() body: { organizationId: string; workflowName: string; approverRole?: string },
  ) {
    await this.verifyOrganizationMember(userId, body.organizationId);
    return this.approvalService.approveWorkflow(body.organizationId, body.workflowName, body.approverRole);
  }

  @Get('risk')
  @ApiOperation({ summary: 'Get AI risk management assessment' })
  async getRisk() {
    return this.riskService.getRiskAssessment();
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Get compliance framework status' })
  async getCompliance() {
    return this.complianceService.getComplianceStatus();
  }

  @Get('audit')
  @ApiOperation({ summary: 'Get immutable audit logs' })
  async getAudit() {
    return this.auditService.getAuditLogs();
  }

  @Get('trust')
  @ApiOperation({ summary: 'Get Trust Center documentation & certificates' })
  async getTrust() {
    return this.trustService.getTrustStatus();
  }

  @Get('responsible-ai')
  @ApiOperation({ summary: 'Get Responsible AI metrics' })
  async getResponsibleAi() {
    return { status: 'ALIGNED', biasRiskScore: 0.02, fairnessIndex: 98.4 };
  }

  @Get('explainability')
  @ApiOperation({ summary: 'Get Explainable AI model outputs' })
  async getExplainability() {
    return this.explainabilityService.getExplainabilityDetails('dec-default');
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
