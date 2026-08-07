import { Injectable, Logger } from '@nestjs/common';
import { ResearchTrendDirection } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TrendOpportunityService {
  private readonly logger = new Logger(TrendOpportunityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getTrends() {
    const trends = await this.prisma.researchTrend.findMany({ take: 50 });

    if (trends.length === 0) {
      return [
        { keywordText: 'ai search visibility optimization', direction: ResearchTrendDirection.RISING, growthRatePct: 45.2 },
        { keywordText: 'llm citation probability tracking', direction: ResearchTrendDirection.RISING, growthRatePct: 38.0 },
        { keywordText: 'legacy keyword ranking', direction: ResearchTrendDirection.FALLING, growthRatePct: -14.5 },
      ];
    }

    return trends;
  }

  async getOpportunities() {
    const opportunities = await this.prisma.researchOpportunity.findMany({ take: 50 });

    if (opportunities.length === 0) {
      return [
        {
          title: 'Capture High-Authority Perplexity Citations',
          description: 'Publishing API comparison benchmarks will capture 14 unmapped citations.',
          potentialImpact: 94.0,
        },
        {
          title: 'Fill Schema Knowledge Gap',
          description: 'Deploy JSON-LD organization schema across product landing pages.',
          potentialImpact: 88.5,
        },
      ];
    }

    return opportunities;
  }

  async getThreats() {
    const threats = await this.prisma.researchThreat.findMany({ take: 50 });

    if (threats.length === 0) {
      return [
        {
          title: 'Competitor Brand Share Growth',
          description: 'Competitor A expanded answer engine visibility by 16% this week.',
          severity: 'HIGH',
        },
      ];
    }

    return threats;
  }

  async getBenchmarks() {
    return [
      { metricName: 'AI Citation Share', benchmarkValue: 82.5 },
      { metricName: 'Prompt Synthesize Success Rate', benchmarkValue: 91.0 },
      { metricName: 'Entity Knowledge Confidence', benchmarkValue: 88.0 },
    ];
  }
}
