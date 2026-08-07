import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
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
