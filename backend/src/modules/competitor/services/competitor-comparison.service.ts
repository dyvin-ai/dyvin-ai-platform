import { Injectable, Logger } from '@nestjs/common';
import { ComparisonPeriod } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

export interface RunComparisonInput {
  competitorId: string;
  brandScore?: number;
  period?: ComparisonPeriod;
}

@Injectable()
export class CompetitorComparisonService {
  private readonly logger = new Logger(CompetitorComparisonService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async runComparison(input: RunComparisonInput) {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id: input.competitorId },
      include: { visibilities: { take: 5, orderBy: { recordedAt: 'desc' } }, citations: true },
    });

    if (!competitor) {
      throw new Error(`Competitor [${input.competitorId}] not found.`);
    }

    const brandScore = input.brandScore || 85.0;
    const latestVis = competitor.visibilities[0]?.visibilityScore || Math.floor(Math.random() * 30) + 60;
    const competitorScore = parseFloat(latestVis.toFixed(2));

    const total = brandScore + competitorScore;
    const winRate = total > 0 ? parseFloat(((brandScore / total) * 100).toFixed(2)) : 50.0;
    const lossRate = parseFloat((100 - winRate).toFixed(2));

    const comparison = await this.prisma.competitorComparison.create({
      data: {
        competitorId: input.competitorId,
        period: input.period || ComparisonPeriod.WEEKLY,
        brandScore,
        competitorScore,
        winRate,
        lossRate,
        metricsJson: {
          visibilityDiff: brandScore - competitorScore,
          citationCount: competitor.citations.length,
          sourceDiversity: 0.85,
        },
      },
      include: { competitor: true },
    });

    await this.auditService.logAction({
      action: 'COMPETITOR_COMPARISON_RUN',
      metadata: { competitorId: input.competitorId, winRate, lossRate },
    });

    return comparison;
  }

  async getComparisons(competitorId?: string) {
    return this.prisma.competitorComparison.findMany({
      where: competitorId ? { competitorId } : undefined,
      include: { competitor: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
