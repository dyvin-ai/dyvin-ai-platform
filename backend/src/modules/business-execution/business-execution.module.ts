import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { BusinessExecutionController } from './business-execution.controller';
import { BusinessExecutionDashboardService } from './services/business-execution-dashboard.service';
import { OpportunityDetectionService } from './services/opportunity-detection.service';
import { RootCauseAnalysisService } from './services/root-cause-analysis.service';
import { StrategyGenerationService } from './services/strategy-generation.service';
import { ContentExecutionService } from './services/content-execution.service';
import { PublishingExecutionService } from './services/publishing-execution.service';
import { WorkforceExecutionService } from './services/workforce-execution.service';
import { OptimizationLoopService } from './services/optimization-loop.service';
import { ExecutiveDecisionService } from './services/executive-decision.service';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessExecutionController],
  providers: [
    BusinessExecutionDashboardService,
    OpportunityDetectionService,
    RootCauseAnalysisService,
    StrategyGenerationService,
    ContentExecutionService,
    PublishingExecutionService,
    WorkforceExecutionService,
    OptimizationLoopService,
    ExecutiveDecisionService,
  ],
  exports: [
    BusinessExecutionDashboardService,
    OpportunityDetectionService,
    RootCauseAnalysisService,
    StrategyGenerationService,
    ContentExecutionService,
    PublishingExecutionService,
    WorkforceExecutionService,
    OptimizationLoopService,
    ExecutiveDecisionService,
  ],
})
export class BusinessExecutionModule {}
