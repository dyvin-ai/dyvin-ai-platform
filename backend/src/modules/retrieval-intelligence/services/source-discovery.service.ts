import { Injectable, Logger } from '@nestjs/common';
import { SourceType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SourceDiscoveryService {
  private readonly logger = new Logger(SourceDiscoveryService.name);

  constructor(private readonly prisma: PrismaService) {}

  classifyDomain(domain: string): SourceType {
    const d = domain.toLowerCase();
    if (d.includes('wikipedia.org')) return SourceType.WIKIPEDIA;
    if (d.includes('reddit.com')) return SourceType.COMMUNITY;
    if (d.includes('linkedin.com')) return SourceType.SOCIAL;
    if (d.includes('github.com')) return SourceType.DOCUMENTATION;
    if (d.includes('medium.com')) return SourceType.BLOG;
    if (d.includes('stackoverflow.com')) return SourceType.COMMUNITY;
    if (d.endsWith('.gov')) return SourceType.GOVERNMENT;
    if (d.endsWith('.edu')) return SourceType.ACADEMIC;
    if (d.includes('news') || d.includes('reuters') || d.includes('bloomberg')) return SourceType.NEWS;
    if (d.includes('docs.') || d.includes('developer.')) return SourceType.DOCUMENTATION;
    return SourceType.THIRD_PARTY;
  }

  async discoverSource(domain: string, name?: string) {
    const sourceType = this.classifyDomain(domain);

    const source = await this.prisma.source.upsert({
      where: { domain },
      update: { sourceType },
      create: {
        domain,
        name: name || domain,
        sourceType,
        authorityScore: 70,
        trustScore: 75,
      },
    });

    return source;
  }

  async getSources(limit: number = 50) {
    return this.prisma.source.findMany({
      orderBy: { citationCount: 'desc' },
      take: limit,
    });
  }

  async getSourceById(id: string) {
    return this.prisma.source.findUnique({
      where: { id },
      include: { performances: true, insights: true },
    });
  }
}
