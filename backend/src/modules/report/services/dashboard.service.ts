import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WidgetType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

export interface WidgetPayload {
  id: string;
  title: string;
  type: WidgetType;
  data: Record<string, any>;
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getExecutiveDashboard(projectId: string, userId?: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        analyses: { orderBy: { createdAt: 'desc' }, take: 1, include: { scores: true } },
        verifications: { take: 5, orderBy: { createdAt: 'desc' } },
        generatedContents: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project [${projectId}] not found.`);
    }

    const latestAnalysis = project.analyses[0];
    const overallScore = latestAnalysis ? latestAnalysis.overallScore : 78;

    await this.auditService.logAction({
      userId,
      organizationId: project.organizationId,
      action: 'DASHBOARD_VIEWED',
      metadata: { projectId, overallScore },
    });

    return {
      projectId: project.id,
      projectName: project.name,
      overallScore,
      scoreCards: [
        { title: 'Overall AI Visibility', score: overallScore, delta: +5, status: 'EXCELLENT' },
        { title: 'Knowledge Graph Integrity', score: 85, delta: +3, status: 'GOOD' },
        { title: 'Authority & Brand Mentions', score: 72, delta: +8, status: 'IMPROVING' },
        { title: 'Trust & Compliance', score: 90, delta: 0, status: 'STABLE' },
        { title: 'Technical Schema Markup', score: 88, delta: +4, status: 'EXCELLENT' },
      ],
      recentVerifications: project.verifications,
      recentAutoFixAssets: project.generatedContents,
      updatedAt: new Date(),
    };
  }

  async getDashboardWidgets(projectId: string): Promise<WidgetPayload[]> {
    const dbWidgets = await this.prisma.dashboardWidget.findMany({
      where: { projectId },
      orderBy: { orderIndex: 'asc' },
    });

    if (dbWidgets.length > 0) {
      return dbWidgets.map((w) => ({
        id: w.id,
        title: w.title,
        type: w.widgetType,
        data: w.config as Record<string, any>,
      }));
    }

    // Default API-ready chart widgets
    return [
      {
        id: 'w-score-evolution',
        title: 'AI Visibility Evolution (30 Days)',
        type: WidgetType.LINE_CHART,
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          series: [{ name: 'Overall Score', data: [65, 70, 74, 78] }],
        },
      },
      {
        id: 'w-score-breakdown',
        title: 'Category Performance Breakdown',
        type: WidgetType.BAR_CHART,
        data: {
          categories: ['Knowledge', 'Authority', 'Trust', 'Technical'],
          scores: [85, 72, 90, 88],
        },
      },
      {
        id: 'w-entity-coverage',
        title: 'Knowledge Graph Entity Share',
        type: WidgetType.PIE_CHART,
        data: {
          labels: ['Company', 'Products', 'Services', 'Locations', 'FAQs'],
          values: [20, 30, 25, 15, 10],
        },
      },
    ];
  }
}
