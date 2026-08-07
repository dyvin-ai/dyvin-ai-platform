import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reportApi from '@services/api/report.api';
import type { GenerateReportRequest, ExportReportRequest } from '@app-types/report.types';
import toast from 'react-hot-toast';

export function useExecutiveDashboard(projectId?: string) {
  return useQuery({
    queryKey: ['executiveDashboard', projectId],
    queryFn: () => reportApi.getExecutiveDashboard(projectId!),
    enabled: Boolean(projectId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardWidgets(projectId?: string) {
  return useQuery({
    queryKey: ['dashboardWidgets', projectId],
    queryFn: () => reportApi.getDashboardWidgets(projectId!),
    enabled: Boolean(projectId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsOverview(projectId?: string) {
  return useQuery({
    queryKey: ['analyticsOverview', projectId],
    queryFn: () => reportApi.getAnalyticsOverview(projectId!),
    enabled: Boolean(projectId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTrendAnalysis(projectId?: string, periodDays = 30) {
  return useQuery({
    queryKey: ['trendAnalysis', projectId, periodDays],
    queryFn: () => reportApi.getTrendAnalysis(projectId!, periodDays),
    enabled: Boolean(projectId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReports(projectId?: string) {
  return useQuery({
    queryKey: ['reports', projectId],
    queryFn: () => reportApi.getReports(projectId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useReportDetails(reportId?: string) {
  return useQuery({
    queryKey: ['reportDetails', reportId],
    queryFn: () => reportApi.getReportDetails(reportId!),
    enabled: Boolean(reportId),
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateReportRequest) => reportApi.generateReport(data),
    onSuccess: (newReport) => {
      toast.success(`Report "${newReport.title}" generated successfully`);
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to generate report');
    },
  });
}

export function useExportReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExportReportRequest) => reportApi.exportReport(data),
    onSuccess: (job) => {
      toast.success(`Report exported as ${job.format}. Download starting...`);
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      if (job.downloadUrl) {
        window.open(job.downloadUrl, '_blank');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to export report');
    },
  });
}
