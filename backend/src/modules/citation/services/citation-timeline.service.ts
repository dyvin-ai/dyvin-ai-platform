import { Injectable, Logger } from '@nestjs/common';
import { CitationTrendDirection } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CitationTimelineService {
  private readonly logger = new Logger(CitationTimelineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getTimeline(aiSearchProjectId?: string, rangeDays: number = 30) {
    const sinceDate = new Date(Date.now() - rangeDays * 86400000);

    const citations = await this.prisma.citation.findMany({
      where: {
        aiSearchProjectId: aiSearchProjectId ? aiSearchProjectId : undefined,
        createdAt: { gte: sinceDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    const dateMap = new Map<string, number>();

    for (const c of citations) {
      const day = c.createdAt.toISOString().split('T')[0];
      dateMap.set(day, (dateMap.get(day) || 0) + 1);
    }

    const timelineData = Array.from(dateMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return {
      rangeDays,
      totalCount: citations.length,
      timeline: timelineData,
    };
  }

  async getTrends(aiSearchProjectId?: string) {
    const recent = await this.getTimeline(aiSearchProjectId, 7);
    const previous = await this.getTimeline(aiSearchProjectId, 14);

    const recentCount = recent.totalCount;
    const previousCount = previous.totalCount - recentCount;

    let trendDirection: CitationTrendDirection = CitationTrendDirection.STABLE;
    let growthRatePct = 0;

    if (previousCount > 0) {
      growthRatePct = parseFloat((((recentCount - previousCount) / previousCount) * 100).toFixed(2));
      if (growthRatePct > 5) trendDirection = CitationTrendDirection.RISING;
      else if (growthRatePct < -5) trendDirection = CitationTrendDirection.DECLINING;
    } else if (recentCount > 0) {
      trendDirection = CitationTrendDirection.RISING;
      growthRatePct = 100;
    }

    return {
      recent7Days: recentCount,
      previous7Days: previousCount,
      growthRatePct,
      trendDirection,
      velocityPerDay: parseFloat((recentCount / 7).toFixed(2)),
    };
  }
}
