import { get, post } from './client';
import type {
  ExecutiveDashboardData,
  WidgetPayload,
  AnalyticsOverview,
  TrendItem,
  ReportItem,
  GenerateReportRequest,
  ExportReportRequest,
  ExportJobResult,
} from '@app-types/report.types';

export async function getExecutiveDashboard(projectId: string): Promise<ExecutiveDashboardData> {
  return get<ExecutiveDashboardData>('/dashboard', { params: { projectId } });
}

export async function getDashboardWidgets(projectId: string): Promise<WidgetPayload[]> {
  return get<WidgetPayload[]>('/dashboard/widgets', { params: { projectId } });
}

export async function getAnalyticsOverview(projectId: string): Promise<AnalyticsOverview> {
  return get<AnalyticsOverview>('/analytics', { params: { projectId } });
}

export async function getTrendAnalysis(projectId: string, periodDays?: number): Promise<TrendItem[]> {
  return get<TrendItem[]>('/analytics/trends', { params: { projectId, periodDays } });
}

export async function getReports(projectId?: string): Promise<ReportItem[]> {
  return get<ReportItem[]>('/reports', { params: { projectId } });
}

export async function getReportDetails(reportId: string): Promise<ReportItem> {
  return get<ReportItem>(`/reports/${reportId}`);
}

export async function generateReport(data: GenerateReportRequest): Promise<ReportItem> {
  return post<ReportItem>('/reports/generate', data);
}

export async function exportReport(data: ExportReportRequest): Promise<ExportJobResult> {
  return post<ExportJobResult>('/reports/export', data);
}
