import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CompetitorVisibilityService {
  private readonly logger = new Logger(CompetitorVisibilityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCompetitorBenchmarks() {
    return [
      { competitorName: 'Dyvin AI (Your Org)', visibilityScore: 84.5, citationCount: 1450 },
      { competitorName: 'Peec AI', visibilityScore: 68.2, citationCount: 720 },
      { competitorName: 'Competitor B', visibilityScore: 54.0, citationCount: 410 },
      { competitorName: 'Industry Average', visibilityScore: 61.5, citationCount: 580 },
    ];
  }
}
