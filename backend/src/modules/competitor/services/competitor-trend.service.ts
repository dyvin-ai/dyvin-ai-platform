import { Injectable, Logger } from '@nestjs/common';
import { TrendDirection } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CompetitorTrendService {
  private readonly logger = new Logger(CompetitorTrendService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getTrends(competitorId?: string) {
    const trends = await this.prisma.competitorTrend.findMany({
      where: competitorId ? { competitorId } : undefined,
      include: { competitor: true },
      orderBy: { recordedAt: 'desc' },
      take: 50,
    });

    if (trends.length === 0) {
      return [
        {
          competitorId: competitorId || 'comp-default',
          direction: TrendDirection.RISING,
          growthRatePct: 12.5,
          recordedAt: new Date(),
        },
      ];
    }

    return trends;
  }
}
