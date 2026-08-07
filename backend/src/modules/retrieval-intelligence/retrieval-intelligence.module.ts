import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { RetrievalQueue } from './queues/retrieval.queue';
import { RetrievalIntelligenceController } from './retrieval-intelligence.controller';
import { PromptPerformanceService } from './services/prompt-performance.service';
import { RetrievalAnalyticsService } from './services/retrieval-analytics.service';
import { SourceDiscoveryService } from './services/source-discovery.service';
import { SourceLeaderboardService } from './services/source-leaderboard.service';
import { URLDomainPerformanceService } from './services/url-domain-performance.service';
import { RetrievalWorker } from './workers/retrieval.worker';

@Module({
  imports: [
    AuditModule,
    FeatureFlagModule,
    BullModule.registerQueue(
      { name: RetrievalQueue.RETRIEVAL_QUEUE },
      { name: RetrievalQueue.CITATION_QUEUE },
      { name: RetrievalQueue.SOURCE_QUEUE },
      { name: RetrievalQueue.AUTHORITY_QUEUE },
    ),
  ],
  controllers: [RetrievalIntelligenceController],
  providers: [
    SourceDiscoveryService,
    RetrievalAnalyticsService,
    URLDomainPerformanceService,
    PromptPerformanceService,
    SourceLeaderboardService,
    RetrievalQueue,
    RetrievalWorker,
  ],
  exports: [
    SourceDiscoveryService,
    RetrievalAnalyticsService,
    URLDomainPerformanceService,
    PromptPerformanceService,
    SourceLeaderboardService,
    RetrievalQueue,
  ],
})
export class RetrievalIntelligenceModule {}
