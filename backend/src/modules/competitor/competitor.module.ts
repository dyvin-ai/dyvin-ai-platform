import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { CompetitorController } from './competitor.controller';
import { CompetitorQueue } from './queues/competitor.queue';
import { CompetitorBenchmarkService } from './services/competitor-benchmark.service';
import { CompetitorComparisonService } from './services/competitor-comparison.service';
import { CompetitorInsightService } from './services/competitor-insight.service';
import { CompetitorManagementService } from './services/competitor-management.service';
import { CompetitorTrendService } from './services/competitor-trend.service';
import { CompetitorWorker } from './workers/competitor.worker';

@Module({
  imports: [
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    BullModule.registerQueue(
      { name: CompetitorQueue.ANALYSIS_QUEUE },
      { name: CompetitorQueue.COMPARISON_QUEUE },
      { name: CompetitorQueue.TREND_QUEUE },
    ),
  ],
  controllers: [CompetitorController],
  providers: [
    CompetitorManagementService,
    CompetitorComparisonService,
    CompetitorBenchmarkService,
    CompetitorInsightService,
    CompetitorTrendService,
    CompetitorQueue,
    CompetitorWorker,
  ],
  exports: [
    CompetitorManagementService,
    CompetitorComparisonService,
    CompetitorBenchmarkService,
    CompetitorInsightService,
    CompetitorTrendService,
    CompetitorQueue,
  ],
})
export class CompetitorModule {}
