import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { ReportType, ExportFormat } from '@app-types/report.types';
import { useGenerateReport, useExportReport } from '@hooks/useReports';
import { FileText, Download, Sparkles } from 'lucide-react';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function ReportGeneratorModal({ isOpen, onClose, projectId }: ReportGeneratorModalProps) {
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState<ReportType>(ReportType.EXECUTIVE);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(ExportFormat.PDF);

  const { mutateAsync: generateReport, isPending: isGenerating } = useGenerateReport();
  const { mutateAsync: exportReport, isPending: isExporting } = useExportReport();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const report = await generateReport({
        projectId,
        reportType,
        title: title.trim() || undefined,
      });

      if (report?.id) {
        await exportReport({
          reportId: report.id,
          format: exportFormat,
        });
      }

      onClose();
    } catch {
      // Error handled by custom hooks
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FileText className="w-5 h-5 text-primary" /> Generate & Export Report
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <Input
            label="Report Title (Optional)"
            placeholder="e.g. Q3 AI Visibility Audit Report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Report Scope / Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full p-2 bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={ReportType.EXECUTIVE}>Executive Summary Report</option>
              <option value={ReportType.TECHNICAL}>Technical Schema Markup Report</option>
              <option value={ReportType.KNOWLEDGE}>Knowledge Graph Audit</option>
              <option value={ReportType.VERIFICATION}>Verification & Auto-Fix Audit</option>
              <option value={ReportType.FULL_AUDIT}>Full Board Audit</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Export Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              className="w-full p-2 bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={ExportFormat.PDF}>PDF Document (.pdf)</option>
              <option value={ExportFormat.CSV}>CSV Spreadsheet (.csv)</option>
              <option value={ExportFormat.EXCEL}>Excel Workbook (.xlsx)</option>
              <option value={ExportFormat.JSON}>Raw JSON Payload (.json)</option>
              <option value={ExportFormat.MARKDOWN}>Markdown Document (.md)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isGenerating || isExporting}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Generate & Download
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
