import { Injectable, Logger } from '@nestjs/common';
import { BenchmarkCategory } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CompetitorBenchmarkService {
  private readonly logger = new Logger(CompetitorBenchmarkService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getBenchmarks(industry: string = 'Technology') {
    const benchmarks = await this.prisma.competitorBenchmark.findMany({
      where: { industry },
      orderBy: { createdAt: 'desc' },
    });

    if (benchmarks.length === 0) {
      return [
        {
          id: 'bench-1',
          category: BenchmarkCategory.INDUSTRY_AVERAGE,
          industry,
          averageScore: 68.5,
          topScore: 92.0,
        },
        {
          id: 'bench-2',
          category: BenchmarkCategory.TOP_PERFORMER,
          industry,
          averageScore: 88.0,
          topScore: 98.0,
        },
      ];
    }

    return benchmarks;
  }

  async getLeaderboard(organizationId?: string) {
    const competitors = await this.prisma.competitor.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { comparisons: { take: 1, orderBy: { createdAt: 'desc' } } },
    });

    const leaderboard = competitors.map((c) => {
      const comp = c.comparisons[0];
      return {
        competitorId: c.id,
        name: c.name,
        domain: c.domain,
        type: c.type,
        score: comp ? comp.competitorScore : 70.0,
        winRateAgainstBrand: comp ? comp.lossRate : 50.0,
      };
    });

    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard;
  }
}
