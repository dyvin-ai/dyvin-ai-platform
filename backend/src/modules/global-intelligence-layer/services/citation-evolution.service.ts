import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CitationEvolutionService {
  private readonly logger = new Logger(CitationEvolutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordCitationHistory(domain: string, citationCount: number, authorityRank: number) {
    return this.prisma.globalCitationHistoryRecord.create({
      data: {
        domain,
        citationCount,
        authorityRank,
      },
    });
  }

  async getTopCitationDomains() {
    return [
      { domain: 'wikipedia.org', count: 485000, authorityRank: 1 },
      { domain: 'github.com', count: 395000, authorityRank: 2 },
      { domain: 'stackoverflow.com', count: 284000, authorityRank: 3 },
    ];
  }
}
