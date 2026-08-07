import React, { useState } from 'react';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { useReports, useExportReport } from '@hooks/useReports';
import { ReportGeneratorModal } from '@components/modals/ReportGeneratorModal';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { PageLoader } from '@components/feedback/PageLoader';
import { FileText, Plus, Download, Sparkles, Calendar, CheckCircle2, Clock } from 'lucide-react';
import type { ReportItem, ExportFormat } from '@app-types/report.types';

export default function ReportsPage() {
  const { activeWorkspace } = useWorkspaceStore();
  const projectId = activeWorkspace?.id ?? '';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  const { data: reports = [], isLoading, refetch } = useReports(projectId || undefined);
  const { mutateAsync: exportReport, isPending: isExporting } = useExportReport();

  const filteredReports = reports.filter((r) => filterType === 'ALL' || r.reportType === filterType);

  const handleExport = async (reportId: string, format: ExportFormat) => {
    await exportReport({ reportId, format });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-heading-md font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Intelligence Reports & Board Digests
          </h1>
          <p className="text-body-xs text-muted-foreground">
            Generate, view, and export enterprise AI visibility, knowledge, technical, and board audit reports.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Generate New Report
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-xs">
        {['ALL', 'EXECUTIVE', 'TECHNICAL', 'KNOWLEDGE', 'VERIFICATION', 'FULL_AUDIT'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterType === t
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/40'
            }`}
          >
            {t === 'ALL' ? 'All Reports' : t}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {isLoading ? (
        <PageLoader label="Loading Intelligence Reports..." />
      ) : filteredReports.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl space-y-3 bg-card">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">No Intelligence Reports Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Generate your first executive, technical, or verification report for this project.
          </p>
          <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
            Generate Report
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report: ReportItem) => (
            <div
              key={report.id}
              className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm">
                      {report.reportType}
                    </Badge>
                    <h3 className="text-sm font-bold text-foreground">{report.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{report.summary}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={isExporting}
                    onClick={() => handleExport(report.id, 'PDF' as ExportFormat)}
                    leftIcon={<Download className="w-3 h-3" />}
                  >
                    Export PDF
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={isExporting}
                    onClick={() => handleExport(report.id, 'CSV' as ExportFormat)}
                    leftIcon={<Download className="w-3 h-3" />}
                  >
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Sections Preview */}
              {report.sections && report.sections.length > 0 && (
                <div className="pt-3 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {report.sections.map((sec) => (
                    <div key={sec.id} className="p-3 rounded-lg bg-muted/20 border border-border/40 space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" /> {sec.title}
                      </span>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {typeof sec.contentBody === 'object'
                          ? JSON.stringify(sec.contentBody)
                          : String(sec.contentBody)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" /> Generated on{' '}
                  {new Date(report.createdAt).toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-success font-medium">
                  <Clock className="w-3 h-3" /> Status: {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReportGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}