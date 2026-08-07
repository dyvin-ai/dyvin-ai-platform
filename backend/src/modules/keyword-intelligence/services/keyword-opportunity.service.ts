import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class KeywordOpportunityService {
  private readonly logger = new Logger(KeywordOpportunityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getOpportunities(organizationId?: string) {
    const keywords = await this.prisma.keyword.findMany({
      where: organizationId ? { organizationId } : undefined,
      orderBy: { opportunityScore: 'desc' },
      take: 50,
    });

    return keywords.map((k) => ({
      keywordId: k.id,
      text: k.text,
      intent: k.intent,
      opportunityScore: k.opportunityScore,
      searchVolume: k.searchVolume,
      difficulty: k.difficulty,
      authorityGap: 18.5,
      expectedRoi: 165.0,
      priority: k.opportunityScore > 80 ? 'HIGH' : 'MEDIUM',
    }));
  }

  async getSearchVolume(keywordText?: string) {
    if (keywordText) {
      const vol = await this.prisma.keywordSearchVolume.findUnique({
        where: { keywordText },
      });
      if (vol) return vol;
      return { keywordText, monthlyVolume: 2400, seasonality: { Q1: 2200, Q2: 2600 } };
    }

    return this.prisma.keywordSearchVolume.findMany({ take: 50 });
  }

  async getTrends() {
    return [
      { keywordText: 'ai search optimization', direction: 'RISING', growthRatePct: 42.5 },
      { keywordText: 'best llm citation tracker', direction: 'RISING', growthRatePct: 88.0 },
    ];
  }
}
