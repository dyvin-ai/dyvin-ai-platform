import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SourceLeaderboardService {
  private readonly logger = new Logger(SourceLeaderboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard() {
    const leaderboards = await this.prisma.sourceLeaderboard.findMany({
      orderBy: { rankPosition: 'asc' },
      take: 50,
    });

    if (leaderboards.length === 0) {
      return [
        { rankPosition: 1, sourceId: 'src-1', domain: 'docs.stripe.com', score: 98.5 },
        { rankPosition: 2, sourceId: 'src-2', domain: 'github.com', score: 94.0 },
        { rankPosition: 3, sourceId: 'src-3', domain: 'wikipedia.org', score: 91.2 },
      ];
    }

    return leaderboards;
  }
}
