import React, { useState } from 'react';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { useOrgStore } from '@stores/orgStore';
import { useExecutiveDashboard, useDashboardWidgets } from '@hooks/useReports';
import { useRevenueMetrics, useForecasts, useExecutiveKPIs } from '@hooks/useBusinessIntelligence';
import { ScoreCard } from '@components/analytics/ScoreCard';
import { CategoryBreakdownBar } from '@components/analytics/CategoryBreakdownBar';
import { RevenueKPIWidget } from '@components/analytics/RevenueKPIWidget';
import { PredictiveForecastWidget } from '@components/analytics/PredictiveForecastWidget';
import { ReportGeneratorModal } from '@components/modals/ReportGeneratorModal';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { PageLoader } from '@components/feedback/PageLoader';
import { LayoutDashboard, FileText, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OverviewPage() {
  const { activeWorkspace } = useWorkspaceStore();
  const { activeOrg } = useOrgStore();
  const projectId = activeWorkspace?.id ?? '';

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data: dashboard, isLoading: isDashboardLoading, error: dashboardError, refetch } = useExecutiveDashboard(projectId);
  const { data: widgets } = useDashboardWidgets(projectId);
  const { data: revenueMetrics, isLoading: isRevenueLoading } = useRevenueMetrics();
  const { data: forecast, isLoading: isForecastLoading } = useForecasts();
  const { data: kpis } = useExecutiveKPIs();

  if (!projectId) {
    return (
      <div className="p-12 text-center space-y-3">
        <LayoutDashboard className="w-10 h-10 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold text-foreground">No Active Workspace Selected</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Please select or create a workspace using the header workspace selector to view Executive Intelligence.
        </p>
      </div>
    );
  }

  if (isDashboardLoading) {
    return <PageLoader label="Loading Executive Intelligence Dashboard..." />;
  }

  if (dashboardError) {
    return (
      <div className="p-8 text-center border border-danger/30 rounded-2xl bg-danger/5 space-y-3">
        <AlertCircle className="w-8 h-8 text-danger mx-auto" />
        <h3 className="text-sm font-bold text-foreground">Failed to Load Dashboard Intelligence</h3>
        <p className="text-xs text-muted-foreground">Unable to connect to NestJS Business Intelligence services.</p>
        <Button size="sm" onClick={() => refetch()}>Retry Connection</Button>
      </div>
    );
  }

  const categoryWidget = widgets?.find((w) => w.id === 'w-score-breakdown');
  const categories = categoryWidget?.data?.categories ?? ['Knowledge', 'Authority', 'Trust', 'Technical'];
  const scores = categoryWidget?.data?.scores ?? [85, 72, 90, 88];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-heading-md font-extrabold text-foreground tracking-tight">
              Executive Dashboard Overview
            </h1>
            <Badge variant="default" size="sm">
              <Sparkles className="w-3 h-3 mr-1 inline" /> Real-time
            </Badge>
          </div>
          <p className="text-body-xs text-muted-foreground">
            {activeOrg?.name} • {activeWorkspace?.name || 'Workspace'} AI Visibility & Financial Intelligence Digest.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsReportModalOpen(true)}
          leftIcon={<FileText className="w-3.5 h-3.5" />}
        >
          Export Intelligence Report
        </Button>
      </div>

      {/* Revenue KPI Bar */}
      <RevenueKPIWidget metrics={revenueMetrics} isLoading={isRevenueLoading} />

      {/* Score Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dashboard?.scoreCards?.map((card) => (
          <ScoreCard key={card.title} item={card} />
        )) ?? (
          <div className="col-span-5 p-4 text-center text-xs text-muted-foreground">
            No score cards available.
          </div>
        )}
      </div>

      {/* Analytics & Forecast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdownBar categories={categories} scores={scores} />
        <PredictiveForecastWidget forecast={forecast} isLoading={isForecastLoading} />
      </div>

      {/* Recent Verifications & Fixes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-border bg-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Recent AI Verification Audits
          </h3>
          <div className="divide-y divide-border/60 text-xs">
            {dashboard?.recentVerifications?.length === 0 ? (
              <p className="py-3 text-muted-foreground italic">No recent verifications recorded.</p>
            ) : (
              dashboard?.recentVerifications?.map((v) => (
                <div key={v.id} className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-foreground">{v.targetUrl}</span>
                  <Badge variant={v.passed ? 'success' : 'warning'} size="sm">
                    {v.passed ? 'PASSED' : 'FLAGGED'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" /> Executive KPI Scorecard
          </h3>
          <div className="divide-y divide-border/60 text-xs">
            {kpis?.map((kpi) => (
              <div key={kpi.name} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground">{kpi.name}</span>
                  <span className="text-muted-foreground text-[11px] block">{kpi.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">{kpi.value}</span>
                  <Badge variant={kpi.status === 'ON_TRACK' || kpi.status === 'EXCEEDED' ? 'success' : 'warning'} size="sm" className="ml-2">
                    {kpi.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}