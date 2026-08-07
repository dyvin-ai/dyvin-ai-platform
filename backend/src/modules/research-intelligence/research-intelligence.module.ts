import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { DiscoveryEngineService } from './services/discovery-engine.service';
import { TrendOpportunityService } from './services/trend-opportunity.service';
import { ResearchAgentService } from './services/research-agent.service';
import { ResearchReportService } from './services/research-report.service';
import { ResearchQueue } from './queues/research.queue';
import {
  DiscoveryWorker,
  AnalysisWorker,
  TrendWorker,
  ReportWorker,
  AlertWorker,
} from './workers/research.worker';
import { ResearchIntelligenceController } from './research-intelligence.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    BullModule.registerQueue(
      { name: 'research-discovery' },
      { name: 'research-analysis' },
      { name: 'research-trends' },
      { name: 'research-report' },
      { name: 'research-alert' },
    ),
  ],
  controllers: [ResearchIntelligenceController],
  providers: [
    DiscoveryEngineService,
    TrendOpportunityService,
    ResearchAgentService,
    ResearchReportService,
    ResearchQueue,
    DiscoveryWorker,
    AnalysisWorker,
    TrendWorker,
    ReportWorker,
    AlertWorker,
  ],
  exports: [
    DiscoveryEngineService,
    TrendOpportunityService,
    ResearchAgentService,
    ResearchReportService,
  ],
})
export class ResearchIntelligenceModule {}
