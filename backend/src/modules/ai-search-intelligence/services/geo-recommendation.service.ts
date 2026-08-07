import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class GeoRecommendationService {
  private readonly logger = new Logger(GeoRecommendationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getGeoRecommendations() {
    return [
      {
        id: 'rec-1',
        title: 'Add Structured FAQ Schema for GEO Architecture',
        reason: 'Competitors are cited 34% more often in ChatGPT for architectural prompts due to FAQ Schema.',
        evidence: 'ChatGPT retrieval trace analysis shows FAQ Schema extraction preference.',
        expectedGain: '+18.4% Visibility Gain',
        recommendedAction: 'GENERATE_FAQ_SCHEMA',
      },
    ];
  }
}
