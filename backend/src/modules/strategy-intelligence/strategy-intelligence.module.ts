import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { CompetitorModule } from '../competitor/competitor.module';
import { CitationModule } from '../citation/citation.module';
import { AISearchModule } from '../ai-search/ai-search.module';
import { VisibilityAnalyticsModule } from '../visibility-analytics/visibility-analytics.module';
import { RootCauseEngineService } from './services/root-cause-engine.service';
import { StrategyEngineService } from './services/strategy-engine.service';
import { ImpactRoiService } from './services/impact-roi.service';
import { ExecutionPlannerService } from './services/execution-planner.service';
import { StrategyQueue } from './queues/strategy.queue';
import {
  StrategyAnalysisWorker,
  ForecastWorker,
  ImpactWorker,
  ROIWorker,
  ExecutionPlanWorker,
} from './workers/strategy.worker';
import { StrategyIntelligenceController } from './strategy-intelligence.controller';
import { InsightsController } from './insights.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    CompetitorModule,
    CitationModule,
    AISearchModule,
    VisibilityAnalyticsModule,
    BullModule.registerQueue(
      { name: 'strategy-analysis' },
      { name: 'strategy-forecast' },
      { name: 'strategy-impact' },
      { name: 'strategy-roi' },
      { name: 'strategy-execution-plan' },
    ),
  ],
  controllers: [StrategyIntelligenceController, InsightsController],
  providers: [
    RootCauseEngineService,
    StrategyEngineService,
    ImpactRoiService,
    ExecutionPlannerService,
    StrategyQueue,
    StrategyAnalysisWorker,
    ForecastWorker,
    ImpactWorker,
    ROIWorker,
    ExecutionPlanWorker,
  ],
  exports: [
    RootCauseEngineService,
    StrategyEngineService,
    ImpactRoiService,
    ExecutionPlannerService,
  ],
})
export class StrategyIntelligenceModule {}
