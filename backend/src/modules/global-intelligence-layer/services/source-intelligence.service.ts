import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SourceIntelligenceService {
  private readonly logger = new Logger(SourceIntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateSourceProfile(sourceDomain: string, authorityScore = 95.0, trustScore = 98.0) {
    return this.prisma.globalSourceProfileRecord.create({
      data: {
        sourceDomain,
        authorityScore,
        trustScore,
      },
    });
  }

  async getTopSources() {
    return [
      { sourceDomain: 'docs.github.com', authorityScore: 98.5, trustScore: 99.0 },
      { sourceDomain: 'wikipedia.org', authorityScore: 98.0, trustScore: 97.5 },
    ];
  }
}
