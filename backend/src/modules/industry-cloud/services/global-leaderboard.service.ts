import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class GlobalLeaderboardService {
  private readonly logger = new Logger(GlobalLeaderboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard(category = 'SAAS') {
    return {
      category,
      rankings: [
        { rank: 1, domain: 'github.com', score: 98.4, badge: 'GOLD_LEADER' },
        { rank: 2, domain: 'stripe.com', score: 96.8, badge: 'SILVER_LEADER' },
        { rank: 3, domain: 'vercel.com', score: 95.2, badge: 'BRONZE_LEADER' },
      ],
    };
  }
}
