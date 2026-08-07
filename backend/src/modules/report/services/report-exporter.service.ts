import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ExportFormat, ExportStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

export interface ExportReportInput {
  reportId: string;
  format?: ExportFormat;
}

@Injectable()
export class ReportExporterService {
  private readonly logger = new Logger(ReportExporterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async exportReport(input: ExportReportInput, userId?: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: input.reportId },
      include: { sections: true },
    });

    if (!report) {
      throw new NotFoundException(`Report [${input.reportId}] not found.`);
    }

    const format = input.format || ExportFormat.PDF;
    const downloadUrl = `https://storage.dyvin.ai/exports/report_${report.id}.${format.toLowerCase()}`;

    const exportJob = await this.prisma.exportJob.create({
      data: {
        reportId: input.reportId,
        format,
        status: ExportStatus.COMPLETED,
        downloadUrl,
        fileSizeBytes: 1024 * 250,
        completedAt: new Date(),
      },
    });

    await this.prisma.exportHistory.create({
      data: {
        exportJobId: exportJob.id,
        downloadedBy: userId,
      },
    });

    await this.auditService.logAction({
      userId,
      action: 'EXPORT_CREATED',
      metadata: { reportId: input.reportId, format, exportJobId: exportJob.id },
    });

    return exportJob;
  }
}
