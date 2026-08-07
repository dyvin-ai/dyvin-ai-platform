import { Injectable, Logger } from '@nestjs/common';
import { RankingType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class VisibilityBenchmarkService {
  private readonly logger = new Logger(VisibilityBenchmarkService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getBenchmarks(industry: string = 'Technology') {
    const benchmarks = await this.prisma.aIVisibilityBenchmark.findMany({
      where: { industry },
      orderBy: { recordedAt: 'desc' },
    });

    if (benchmarks.length === 0) {
      return [
        {
          id: 'vis-bench-1',
          industry,
          averageScore: 72.0,
          top10Percent: 94.5,
          median: 74.0,
        },
      ];
    }

    return benchmarks;
  }

  async getLeaderboard(rankingType: RankingType = RankingType.INDUSTRY) {
    const leaderboards = await this.prisma.aIVisibilityLeaderboard.findMany({
      where: { rankingType },
      orderBy: { rankPosition: 'asc' },
      take: 50,
    });

    if (leaderboards.length === 0) {
      return [
        { rankPosition: 1, organizationId: 'org-leader-1', score: 96.5 },
        { rankPosition: 2, organizationId: 'org-leader-2', score: 92.0 },
        { rankPosition: 3, organizationId: 'org-leader-3', score: 88.4 },
      ];
    }

    return leaderboards;
  }
}
