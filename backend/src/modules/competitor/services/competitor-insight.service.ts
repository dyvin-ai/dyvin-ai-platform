import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { NotificationDispatcherService } from '../../notification/services/notification-dispatcher.service';

@Injectable()
export class CompetitorInsightService {
  private readonly logger = new Logger(CompetitorInsightService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationDispatcher: NotificationDispatcherService,
  ) {}

  async generateInsight(competitorId: string, insightType: string, description: string) {
    const insight = await this.prisma.competitorInsight.create({
      data: {
        competitorId,
        insightType,
        description,
      },
      include: { competitor: true },
    });

    if (insightType === 'COMPETITOR_OVERTOOK_BRAND' || insightType === 'NEW_COMPETITOR_DISCOVERED') {
      try {
        await this.notificationDispatcher.dispatch({
          userId: insight.competitor.organizationId,
          title: `Competitor Alert: ${insight.competitor.name}`,
          message: description,
        });
      } catch {
        this.logger.warn(`Failed to dispatch notification for competitor alert.`);
      }
    }

    return insight;
  }

  async getInsights(competitorId?: string) {
    return this.prisma.competitorInsight.findMany({
      where: competitorId ? { competitorId } : undefined,
      include: { competitor: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
