import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { CitationController } from './citation.controller';
import { CitationQueue } from './queues/citation.queue';
import { CitationAnalyticsService } from './services/citation-analytics.service';
import { CitationAuthorityService } from './services/citation-authority.service';
import { CitationNormalizationService } from './services/citation-normalization.service';
import { CitationParserService } from './services/citation-parser.service';
import { CitationTimelineService } from './services/citation-timeline.service';
import { CitationWorker } from './workers/citation.worker';

@Module({
  imports: [
    AuditModule,
    FeatureFlagModule,
    BullModule.registerQueue(
      { name: CitationQueue.PARSER_QUEUE },
      { name: CitationQueue.AUTHORITY_QUEUE },
      { name: CitationQueue.NORMALIZER_QUEUE },
    ),
  ],
  controllers: [CitationController],
  providers: [
    CitationNormalizationService,
    CitationAuthorityService,
    CitationParserService,
    CitationTimelineService,
    CitationAnalyticsService,
    CitationQueue,
    CitationWorker,
  ],
  exports: [
    CitationNormalizationService,
    CitationAuthorityService,
    CitationParserService,
    CitationTimelineService,
    CitationAnalyticsService,
    CitationQueue,
  ],
})
export class CitationModule {}
