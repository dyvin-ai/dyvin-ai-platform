import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiSearchDashboardService {
  private readonly logger = new Logger(AiSearchDashboardService.name);

  async getAiSearchOverview() {
    return {
      overallAiVisibilityScore: 84.5,
      citationScore: 88.2,
      retrievalScore: 82.0,
      authorityScore: 91.4,
      promptScore: 89.0,
      topAiModel: 'ChatGPT (GPT-4o)',
      topCitationDomain: 'wikipedia.org',
      growthRatePct: 14.2,
    };
  }
}
