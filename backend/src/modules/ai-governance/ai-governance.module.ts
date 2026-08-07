import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AiGovernanceController } from './ai-governance.controller';
import { GovernanceDashboardService } from './services/governance-dashboard.service';
import { PolicyEngineService } from './services/policy-engine.service';
import { ApprovalWorkflowService } from './services/approval-workflow.service';
import { ResponsibleAIService } from './services/responsible-ai.service';
import { ExplainabilityService } from './services/explainability.service';
import { RiskManagementService } from './services/risk-management.service';
import { ComplianceService } from './services/compliance.service';
import { AuditCenterService } from './services/audit-center.service';
import { TrustCenterService } from './services/trust-center.service';

@Module({
  imports: [PrismaModule],
  controllers: [AiGovernanceController],
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
  ],
  exports: [
    GovernanceDashboardService,
    PolicyEngineService,
    ApprovalWorkflowService,
    ResponsibleAIService,
    ExplainabilityService,
    RiskManagementService,
    ComplianceService,
    AuditCenterService,
    TrustCenterService,
  ],
})
export class AiGovernanceModule {}
