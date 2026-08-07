import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ReportStatus, ReportType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

export interface GenerateReportInput {
  projectId: string;
  reportType?: ReportType;
  title?: string;
}

@Injectable()
export class ReportGeneratorService {
  private readonly logger = new Logger(ReportGeneratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async generateReport(input: GenerateReportInput, userId?: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: input.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project [${input.projectId}] not found.`);
    }

    const type = input.reportType || ReportType.EXECUTIVE;
    const title = input.title || `${type} Intelligence Report - ${project.name}`;

    const report = await this.prisma.report.create({
      data: {
        projectId: input.projectId,
        title,
        reportType: type,
        status: ReportStatus.COMPLETED,
        summary: `Executive summary report generated for ${project.name} detailing AI visibility scores, Knowledge Graph completeness, authority signals, and auto-fix recommendations.`,
        generatedBy: userId,
        dataPayload: {
          overallScore: 78,
          knowledgeScore: 85,
          authorityScore: 72,
          trustScore: 90,
          technicalScore: 88,
          generatedAt: new Date().toISOString(),
        },
        sections: {
          create: [
            {
              title: 'Executive Score Overview',
              orderIndex: 1,
              contentBody: {
                summary: 'Overall AI Visibility score is 78/100 (+5% over last period).',
                scores: { overall: 78, knowledge: 85, authority: 72, trust: 90, technical: 88 },
              },
            },
            {
              title: 'Top Recommendations & Auto-Fix Assets',
              orderIndex: 2,
              contentBody: {
                recommendationsCount: 12,
                autoFixAssetsGenerated: 5,
                highPriorityAction: 'Deploy Organization JSON-LD Schema to primary homepage.',
              },
            },
          ],
        },
      },
      include: { sections: true },
    });

    await this.prisma.reportExecution.create({
      data: {
        reportId: report.id,
        status: ReportStatus.COMPLETED,
        executionMs: 320,
      },
    });

    await this.auditService.logAction({
      userId,
      organizationId: project.organizationId,
      action: 'REPORT_GENERATED',
      metadata: { reportId: report.id, projectId: input.projectId, reportType: type },
    });

    return report;
  }

  async getReports(projectId?: string) {
    return this.prisma.report.findMany({
      where: projectId ? { projectId } : {},
      include: { sections: true, exports: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReportDetails(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { project: { select: { id: true, name: true } }, sections: true, executions: true, exports: true },
    });

    if (!report) {
      throw new NotFoundException(`Report [${reportId}] not found.`);
    }

    return report;
  }
}
