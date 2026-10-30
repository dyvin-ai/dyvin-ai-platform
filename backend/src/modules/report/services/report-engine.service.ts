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

  getReports(projectId?: string, organizationId?: string) {
    return this.reportGenerator.getReports(projectId, organizationId);
  }

  getReportDetails(reportId: string, organizationId?: string) {
    return this.reportGenerator.getReportDetails(reportId, organizationId);
  }

  generateReport(
    projectId: string,
    reportType?: ReportType,
    title?: string,
    userId?: string,
    organizationId?: string,
    periodDays?: number,
    periodStart?: string,
    periodEnd?: string,
  ) {
    return this.reportGenerator.generateReport(
      { projectId, reportType, title, periodDays, periodStart, periodEnd },
      userId,
      organizationId,
    );
  }

  exportReport(reportId: string, format?: ExportFormat, userId?: string, organizationId?: string) {
    return this.reportExporter.exportReport({ reportId, format }, userId, organizationId);
  }

  getExports(reportId: string, organizationId?: string) {
    return this.reportExporter.getExports(reportId, organizationId);
  }

  getExportFile(reportId: string, exportId: string, organizationId?: string, userId?: string) {
    return this.reportExporter.getExportFile(reportId, exportId, organizationId, userId);
  }

  deleteReport(reportId: string, organizationId?: string, userId?: string) {
    return this.reportGenerator.deleteReport(reportId, organizationId, userId);
  }
}
