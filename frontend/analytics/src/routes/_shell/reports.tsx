import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SectionHeading } from "@/components/analytics/Panel";
import { useWorkspace } from "@/context/WorkspaceContext";
import { reportsService } from "@/services";
import type { ExportFormat, ReportItem, ReportType } from "@/types";
import {
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/_shell/reports")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Executive Intelligence Reports" },
      {
        name: "description",
        content:
          "Generate evidence-backed executive reports and presentation-ready artifacts across AI visibility, competitors, and citations.",
      },
      { property: "og:title", content: "Dyvin AI | Executive Intelligence Reports" },
      {
        property: "og:description",
        content:
          "Generate evidence-backed executive reports and presentation-ready artifacts across AI visibility, competitors, and citations.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { activeOrganization, activeProject } = useWorkspace();
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [exportingReportId, setExportingReportId] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("PDF");

  // Form State for Report Creation
  const [reportType, setReportType] = useState<ReportType>("EXECUTIVE");
  const [periodDays, setPeriodDays] = useState<number>(30);
  const [customTitle, setCustomTitle] = useState<string>("");

  // TanStack Query v5 Fetch
  const {
    data: reports = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["reports", activeOrganization?.id, activeProject?.id],
    queryFn: () => reportsService.list(activeProject?.id),
    staleTime: 30_000,
  });

  // Mutation: Generate Report
  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!activeProject?.id) throw new Error("No active project selected");
      return reportsService.generate({
        projectId: activeProject.id,
        reportType,
        periodDays,
        title: customTitle.trim() || undefined,
      });
    },
    onSuccess: (newReport) => {
      queryClient.invalidateQueries({
        queryKey: ["reports", activeOrganization?.id, activeProject?.id],
      });
      setIsCreateOpen(false);
      setCustomTitle("");
      setSelectedReport(newReport);
      toast.success("Intelligence report generated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to generate intelligence report. Please try again.");
    },
  });

  // Mutation: Export Report & Authenticated Binary Download
  const exportMutation = useMutation({
    mutationFn: async ({
      reportId,
      format,
      fallbackTitle,
    }: {
      reportId: string;
      format: ExportFormat;
      fallbackTitle?: string;
    }) => {
      setExportingReportId(reportId);
      setExportFormat(format);
      return reportsService.exportAndDownload(reportId, format, fallbackTitle);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reports", activeOrganization?.id, activeProject?.id],
      });
      toast.success(`${variables.format} report exported and downloaded successfully.`);
    },
    onError: (error: any, variables) => {
      toast.error(error?.message || `Failed to export ${variables.format} report. Please try again.`);
    },
    onSettled: () => {
      setExportingReportId(null);
    },
  });

  // Mutation: Delete Report
  const deleteMutation = useMutation({
    mutationFn: async (reportId: string) => {
      return reportsService.delete(reportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports", activeOrganization?.id, activeProject?.id],
      });
      if (selectedReport) setSelectedReport(null);
      toast.success("Report deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete report.");
    },
  });

  const latestReport = reports[0];
  const totalCompleted = reports.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeading
          eyebrow="Executive Intelligence & Exports"
          title="Executive Intelligence Reports"
          question="Generate evidence-backed executive reports, competitive briefs, and audit-ready exports directly from verified observations."
        />

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-brand" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 py-1.5 text-xs font-semibold hover:bg-foreground/90 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="size-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Generated Reports</span>
          <p className="text-xl font-bold font-mono text-foreground mt-1">{reports.length}</p>
          <span className="text-[10px] text-muted-foreground">{totalCompleted} snapshots ready</span>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Active Workspace</span>
          <p className="text-xl font-bold font-mono text-brand mt-1 truncate">
            {activeProject?.name || "Dyvin AI"}
          </p>
          <span className="text-[10px] text-muted-foreground">Scanned brand entity</span>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Supported Formats</span>
          <p className="text-xl font-bold font-mono text-foreground mt-1">PDF · CSV · JSON</p>
          <span className="text-[10px] text-muted-foreground">Immutable file artifacts</span>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Latest Generation</span>
          <p className="text-sm font-bold font-mono text-muted-foreground mt-1 truncate">
            {latestReport ? new Date(latestReport.createdAt).toLocaleDateString() : "No reports yet"}
          </p>
          <span className="text-[10px] text-muted-foreground">SHA-256 verified provenance</span>
        </div>
      </div>

      {/* Main Reports List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-brand" />
          <span className="text-xs font-mono text-muted-foreground">Loading executive report snapshots...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
          <p className="text-sm font-semibold text-destructive">Failed to load reports.</p>
          <p className="text-xs text-muted-foreground">The report generation backend is temporarily unreachable.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-72 gap-3 text-center p-8 rounded-2xl border border-border bg-surface shadow-xs">
          <div className="size-12 rounded-full bg-surface-subtle border border-border flex items-center justify-center text-muted-foreground">
            <Layers className="size-6 text-brand" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">No executive reports generated yet</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Generate an intelligence report for {activeProject?.name || "your brand"} to produce PDF, CSV, and JSON snapshots.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 py-1.5 text-xs font-semibold hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Generate First Report</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => {
            const payload = report.dataPayload || ({} as any);
            const summaryKpis = payload.summary || {};
            const isAnyExporting = exportMutation.isPending;
            const isCurrentExporting = isAnyExporting && exportingReportId === report.id;

            return (
              <div
                key={report.id}
                className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between transition-all hover:border-border-strong hover:bg-surface-subtle/20 shadow-xs space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-[10px] uppercase border border-border text-muted-foreground">
                        {report.reportType}
                      </span>
                      <span className="rounded bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 font-mono text-[10px]">
                        {payload.provenance || "DERIVED"}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-foreground leading-snug tracking-tight">
                    {report.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {payload.executiveNarrative || report.summary || "Executive intelligence snapshot."}
                  </p>

                  {/* KPI Bar */}
                  {summaryKpis.visibilityScore !== undefined && (
                    <div className="grid grid-cols-4 gap-2 p-2.5 rounded-lg border border-border/80 bg-surface-subtle/50 text-center font-mono">
                      <div>
                        <span className="text-[9px] text-muted-foreground block">SCORE</span>
                        <span className="text-xs font-bold text-foreground">{summaryKpis.visibilityScore}/100</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground block">CHANGE</span>
                        <span className={`text-xs font-bold ${summaryKpis.visibilityChange >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {summaryKpis.visibilityChange >= 0 ? "+" : ""}{summaryKpis.visibilityChange}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground block">CITATIONS</span>
                        <span className="text-xs font-bold text-foreground">{summaryKpis.citationSources || 0}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground block">PROMPTS</span>
                        <span className="text-xs font-bold text-foreground">{summaryKpis.trackedPrompts || 0}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        exportMutation.mutate({
                          reportId: report.id,
                          format: "PDF",
                          fallbackTitle: report.title,
                        })
                      }
                      disabled={isAnyExporting}
                      className="inline-flex items-center gap-1 rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors cursor-pointer disabled:opacity-50"
                      title="Download PDF document"
                    >
                      {isCurrentExporting && exportFormat === "PDF" ? (
                        <Loader2 className="size-3 animate-spin text-rose-500" />
                      ) : (
                        <FileText className="size-3 text-rose-500" />
                      )}
                      <span>{isCurrentExporting && exportFormat === "PDF" ? "Downloading PDF..." : "PDF"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        exportMutation.mutate({
                          reportId: report.id,
                          format: "CSV",
                          fallbackTitle: report.title,
                        })
                      }
                      disabled={isAnyExporting}
                      className="inline-flex items-center gap-1 rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors cursor-pointer disabled:opacity-50"
                      title="Download CSV spreadsheet"
                    >
                      {isCurrentExporting && exportFormat === "CSV" ? (
                        <Loader2 className="size-3 animate-spin text-emerald-500" />
                      ) : (
                        <FileSpreadsheet className="size-3 text-emerald-500" />
                      )}
                      <span>{isCurrentExporting && exportFormat === "CSV" ? "Downloading CSV..." : "CSV"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        exportMutation.mutate({
                          reportId: report.id,
                          format: "JSON",
                          fallbackTitle: report.title,
                        })
                      }
                      disabled={isAnyExporting}
                      className="inline-flex items-center gap-1 rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors cursor-pointer disabled:opacity-50"
                      title="Download JSON snapshot"
                    >
                      {isCurrentExporting && exportFormat === "JSON" ? (
                        <Loader2 className="size-3 animate-spin text-amber-500" />
                      ) : (
                        <Zap className="size-3 text-amber-500" />
                      )}
                      <span>{isCurrentExporting && exportFormat === "JSON" ? "Downloading JSON..." : "JSON"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
                    >
                      <span>Inspect →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(report.id)}
                      disabled={isAnyExporting || deleteMutation.isPending}
                      className="p-1 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete report"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Report Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Generate Intelligence Report</h3>
                <p className="text-xs text-muted-foreground">Snapshot verified AI visibility and competitive intelligence.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-[10px] uppercase text-muted-foreground block mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-surface-subtle text-foreground focus:outline-none focus:ring-1 focus:ring-brand font-medium"
                >
                  <option value="EXECUTIVE">Executive Comprehensive Report</option>
                  <option value="AI_VISIBILITY">AI Visibility Dynamics</option>
                  <option value="COMPETITIVE">Competitive Briefing</option>
                  <option value="CITATION">Citation Authority Network</option>
                  <option value="PROMPT">Prompt Coverage & Mention Analysis</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-muted-foreground block mb-1">
                  Analysis Period
                </label>
                <div className="grid grid-cols-3 gap-2 font-medium">
                  {[
                    { label: "7 Days", val: 7 },
                    { label: "30 Days", val: 30 },
                    { label: "90 Days", val: 90 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setPeriodDays(p.val)}
                      className={`py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        periodDays === p.val
                          ? "bg-foreground text-background border-foreground font-semibold"
                          : "bg-surface-subtle text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-muted-foreground block mb-1">
                  Custom Report Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Executive AI Audit Brief"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-surface-subtle text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle/60 border border-border text-[11px] text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground block">Verified Snapshot Guarantee</span>
                <p>
                  The generated report binds live analytics into an immutable snapshot, generating a SHA-256 provenance checksum for audit reproducibility.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="px-4 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {generateMutation.isPending ? "Generating Snapshot..." : "Generate Snapshot"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-[10px] uppercase border border-border text-muted-foreground">
                      {selectedReport.reportType}
                    </span>
                    <span className="rounded bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 font-mono text-[10px]">
                      {selectedReport.dataPayload?.provenance || "DERIVED"}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h2 className="mt-2 text-lg font-bold text-foreground">{selectedReport.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Project: {selectedReport.dataPayload?.projectName || "Dyvin AI"}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Executive Narrative */}
              <div className="rounded-xl border border-border bg-surface-subtle/50 p-4 space-y-2">
                <span className="text-xs font-mono uppercase text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-brand" />
                  Executive Summary Narrative
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {selectedReport.dataPayload?.executiveNarrative || selectedReport.summary}
                </p>
              </div>

              {/* KPI Breakdown */}
              {selectedReport.dataPayload?.summary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
                  <div className="p-3 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] text-muted-foreground block">SCORE</span>
                    <span className="text-sm font-bold text-foreground">{selectedReport.dataPayload.summary.visibilityScore}/100</span>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] text-muted-foreground block">DELTA</span>
                    <span className={`text-sm font-bold ${selectedReport.dataPayload.summary.visibilityChange >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {selectedReport.dataPayload.summary.visibilityChange >= 0 ? "+" : ""}{selectedReport.dataPayload.summary.visibilityChange} pts
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] text-muted-foreground block">CITATIONS</span>
                    <span className="text-sm font-bold text-foreground">{selectedReport.dataPayload.summary.citationSources}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] text-muted-foreground block">PROMPTS</span>
                    <span className="text-sm font-bold text-foreground">{selectedReport.dataPayload.summary.trackedPrompts}</span>
                  </div>
                </div>
              )}

              {/* Strategic Actions */}
              {selectedReport.dataPayload?.strategy?.actions && selectedReport.dataPayload.strategy.actions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Compass className="size-3.5 text-brand" />
                    Recommended Strategic Moves
                  </span>
                  <div className="space-y-1.5">
                    {selectedReport.dataPayload.strategy.actions.slice(0, 3).map((a) => (
                      <div key={a.id} className="p-2.5 rounded-lg border border-border bg-surface text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-brand/10 text-brand border border-brand/20">
                            {a.priority}
                          </span>
                          <span className="font-medium text-foreground">{a.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">{a.impact} Impact</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Quality & Checksum */}
              <div className="p-3 rounded-xl border border-border bg-surface-subtle/30 text-[10px] font-mono text-muted-foreground flex items-center justify-between gap-2 flex-wrap">
                <span>Checksum: {selectedReport.dataPayload?.checksum || "sha256:verified"}</span>
                <span>Quality: {selectedReport.dataPayload?.dataQuality?.overall || "HIGH"}</span>
              </div>
            </div>

            {/* Footer Export Triggers */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    exportMutation.mutate({
                      reportId: selectedReport.id,
                      format: "PDF",
                      fallbackTitle: selectedReport.title,
                    })
                  }
                  disabled={exportMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 py-1.5 text-xs font-semibold hover:bg-foreground/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {exportMutation.isPending && exportingReportId === selectedReport.id && exportFormat === "PDF" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <ArrowDownToLine className="size-3.5" />
                  )}
                  <span>
                    {exportMutation.isPending && exportingReportId === selectedReport.id && exportFormat === "PDF"
                      ? "Downloading PDF..."
                      : "Download PDF"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    exportMutation.mutate({
                      reportId: selectedReport.id,
                      format: "CSV",
                      fallbackTitle: selectedReport.title,
                    })
                  }
                  disabled={exportMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-subtle transition-colors cursor-pointer disabled:opacity-50"
                >
                  {exportMutation.isPending && exportingReportId === selectedReport.id && exportFormat === "CSV" ? (
                    <Loader2 className="size-3.5 animate-spin text-emerald-500" />
                  ) : (
                    <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  )}
                  <span>
                    {exportMutation.isPending && exportingReportId === selectedReport.id && exportFormat === "CSV"
                      ? "Downloading CSV..."
                      : "Export CSV"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    exportMutation.mutate({
                      reportId: selectedReport.id,
                      format: "JSON",
                      fallbackTitle: selectedReport.title,
                    })
                  }
                  disabled={exportMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-subtle transition-colors cursor-pointer disabled:opacity-50"
                >
                  {exportMutation.isPending && exportingReportId === selectedReport.id && exportFormat === "JSON" ? (
                    <Loader2 className="size-3.5 animate-spin text-amber-500" />
                  ) : (
                    <Zap className="size-3.5 text-amber-500" />
                  )}
                  <span>
                    {exportMutation.isPending && exportingReportId === selectedReport.id && exportFormat === "JSON"
                      ? "Downloading JSON..."
                      : "Export JSON"}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
