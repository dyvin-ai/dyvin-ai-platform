import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AIModule } from '../ai/ai.module';
import { AuditModule } from '../audit/audit.module';
import { BillingModule } from '../billing/billing.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { AISearchController } from './ai-search.controller';
import { AISearchQueue } from './queues/ai-search.queue';
import { AISearchAnalyticsService } from './services/ai-search-analytics.service';
import { AISearchMonitorService } from './services/ai-search-monitor.service';
import { PromptExecutionService } from './services/prompt-execution.service';
import { PromptLibraryService } from './services/prompt-library.service';
import { AISearchWorker } from './workers/ai-search.worker';

@Module({
  imports: [
    AIModule,
    AuditModule,
    BillingModule,
    NotificationModule,
    FeatureFlagModule,
    BullModule.registerQueue({
      name: AISearchQueue.QUEUE_NAME,
    }),
  ],
  controllers: [AISearchController],
  providers: [
    PromptLibraryService,
    PromptExecutionService,
    AISearchMonitorService,
    AISearchAnalyticsService,
    AISearchQueue,
    AISearchWorker,
  ],
  exports: [
    PromptLibraryService,
    PromptExecutionService,
    AISearchMonitorService,
    AISearchAnalyticsService,
    AISearchQueue,
  ],
})
export class AISearchModule {}
