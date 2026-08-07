import { Injectable, Logger } from '@nestjs/common';
import { ExportFormat, ReportType } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { DashboardService } from './dashboard.service';
import { ReportExporterService } from './report-exporter.service';
import { ReportGeneratorService } from './report-generator.service';

@Injectable()
export class ReportEngineService {
  private readonly logger = new Logger(ReportEngineService.name);

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly analyticsService: AnalyticsService,
    private readonly reportGenerator: ReportGeneratorService,
    private readonly reportExporter: ReportExporterService,
  ) {}

  getExecutiveDashboard(projectId: string, userId?: string) {
    return this.dashboardService.getExecutiveDashboard(projectId, userId);
  }

  getDashboardWidgets(projectId: string) {
    return this.dashboardService.getDashboardWidgets(projectId);
  }

  getAnalyticsOverview(projectId: string) {
    return this.analyticsService.getAnalyticsOverview(projectId);
  }

  getTrendAnalysis(projectId: string, periodDays?: number) {
    return this.analyticsService.getTrendAnalysis(projectId, periodDays);
  }

  getReports(projectId?: string) {
    return this.reportGenerator.getReports(projectId);
  }

  getReportDetails(reportId: string) {
    return this.reportGenerator.getReportDetails(reportId);
  }

  generateReport(projectId: string, reportType?: ReportType, title?: string, userId?: string) {
    return this.reportGenerator.generateReport({ projectId, reportType, title }, userId);
  }

  exportReport(reportId: string, format?: ExportFormat, userId?: string) {
    return this.reportExporter.exportReport({ reportId, format }, userId);
  }
}
