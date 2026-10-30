import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationModule } from '../notification/notification.module';
import { VisibilityAnalyticsModule } from '../visibility-analytics/visibility-analytics.module';
import { CompetitorModule } from '../competitor/competitor.module';
import { CitationModule } from '../citation/citation.module';
import { AISearchModule } from '../ai-search/ai-search.module';
import { StrategyIntelligenceModule } from '../strategy-intelligence/strategy-intelligence.module';
import { AgentIntelligenceModule } from '../agent-intelligence/agent-intelligence.module';
import { ReportProcessor } from './processors/report.processor';
import { REPORT_QUEUES } from './report.constants';
import { ReportController } from './report.controller';
import { AnalyticsService } from './services/analytics.service';
import { DashboardService } from './services/dashboard.service';
import { ReportEngineService } from './services/report-engine.service';
import { ReportExporterService } from './services/report-exporter.service';
import { ReportGeneratorService } from './services/report-generator.service';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    NotificationModule,
    VisibilityAnalyticsModule,
    CompetitorModule,
    CitationModule,
    AISearchModule,
    StrategyIntelligenceModule,
    AgentIntelligenceModule,
    BullModule.registerQueue(
      { name: REPORT_QUEUES.REPORT_GENERATION },
      { name: REPORT_QUEUES.ANALYTICS_ENGINE },
      { name: REPORT_QUEUES.EXPORT_ENGINE },
    ),
  ],
  controllers: [ReportController],
  providers: [
    DashboardService,
    AnalyticsService,
    ReportGeneratorService,
    ReportExporterService,
    ReportEngineService,
    ReportProcessor,
  ],
  exports: [
    ReportEngineService,
    DashboardService,
    AnalyticsService,
    ReportGeneratorService,
    ReportExporterService,
  ],
})
export class ReportModule {}
