import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { VisibilityQueue } from './queues/visibility.queue';
import { VisibilityAnomalyService } from './services/visibility-anomaly.service';
import { VisibilityBenchmarkService } from './services/visibility-benchmark.service';
import { VisibilityForecastService } from './services/visibility-forecast.service';
import { VisibilityInsightService } from './services/visibility-insight.service';
import { VisibilityScoreService } from './services/visibility-score.service';
import { VisibilityTimelineService } from './services/visibility-timeline.service';
import { VisibilityAnalyticsController } from './visibility-analytics.controller';
import { VisibilityWorker } from './workers/visibility.worker';

@Module({
  imports: [
    AuditModule,
    FeatureFlagModule,
    BullModule.registerQueue(
      { name: VisibilityQueue.SCORE_QUEUE },
      { name: VisibilityQueue.FORECAST_QUEUE },
      { name: VisibilityQueue.ANOMALY_QUEUE },
      { name: VisibilityQueue.DASHBOARD_QUEUE },
    ),
  ],
  controllers: [VisibilityAnalyticsController],
  providers: [
    VisibilityScoreService,
    VisibilityTimelineService,
    VisibilityForecastService,
    VisibilityAnomalyService,
    VisibilityBenchmarkService,
    VisibilityInsightService,
    VisibilityQueue,
    VisibilityWorker,
  ],
  exports: [
    VisibilityScoreService,
    VisibilityTimelineService,
    VisibilityForecastService,
    VisibilityAnomalyService,
    VisibilityBenchmarkService,
    VisibilityInsightService,
    VisibilityQueue,
  ],
})
export class VisibilityAnalyticsModule {}
