import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ResearchReportService {
  private readonly logger = new Logger(ResearchReportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateReport(projectId: string, reportType: string = 'DAILY_BRIEF') {
    this.logger.log(`Generating research report (${reportType}) for project ${projectId}`);

    const report = await this.prisma.researchReport.create({
      data: {
        projectId,
        title: `Automated AI Intelligence ${reportType}`,
        reportType,
        contentBody: `# ${reportType} Report\n\nExecutive Intelligence Digest generated automatically by Dyvin AI Research Intelligence Platform.`,
      },
    });

    return report;
  }

  async getReports(projectId?: string) {
    return this.prisma.researchReport.findMany({
      where: projectId ? { projectId } : undefined,
      take: 50,
    });
  }
}
