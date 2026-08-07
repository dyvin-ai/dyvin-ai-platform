import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class KeywordGeoService {
  private readonly logger = new Logger(KeywordGeoService.name);

  constructor(private readonly prisma: PrismaService) {}

  async uploadKeywords(fileName: string, keywordsCount = 1500) {
    return this.prisma.keywordUpload.create({
      data: {
        fileName,
        keywordsCount,
      },
    });
  }

  async getKeywordAnalytics() {
    return {
      totalKeywordsTracked: 1500,
      clustersCount: 12,
      topKeyword: 'Best GEO Platform 2026',
      averageVisibilityPct: 84.0,
    };
  }
}
