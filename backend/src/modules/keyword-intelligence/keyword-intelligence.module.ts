import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { KeywordImportService } from './services/keyword-import.service';
import { KeywordClusterService } from './services/keyword-cluster.service';
import { KeywordOpportunityService } from './services/keyword-opportunity.service';
import { PromptGeneratorService } from './services/prompt-generator.service';
import { KeywordCampaignService } from './services/keyword-campaign.service';
import { KeywordQueue } from './queues/keyword.queue';
import { KeywordImportWorker, KeywordClusterWorker, KeywordCampaignWorker } from './workers/keyword.worker';
import { KeywordIntelligenceController } from './keyword-intelligence.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    BullModule.registerQueue(
      { name: 'keyword-import' },
      { name: 'keyword-clustering' },
      { name: 'campaign-execution' },
      { name: 'embedding-generation' },
      { name: 'prompt-generation' },
    ),
  ],
  controllers: [KeywordIntelligenceController],
  providers: [
    KeywordImportService,
    KeywordClusterService,
    KeywordOpportunityService,
    PromptGeneratorService,
    KeywordCampaignService,
    KeywordQueue,
    KeywordImportWorker,
    KeywordClusterWorker,
    KeywordCampaignWorker,
  ],
  exports: [
    KeywordImportService,
    KeywordClusterService,
    KeywordOpportunityService,
    PromptGeneratorService,
    KeywordCampaignService,
  ],
})
export class KeywordIntelligenceModule {}
