import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CitationAnalyticsService {
  private readonly logger = new Logger(CitationAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCitations(aiSearchProjectId?: string, limit: number = 50) {
    return this.prisma.citation.findMany({
      where: aiSearchProjectId ? { aiSearchProjectId } : undefined,
      include: { source: true, sentiments: true, occurrences: true, relationships: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getCitationById(id: string) {
    return this.prisma.citation.findUnique({
      where: { id },
      include: { source: true, sentiments: true, occurrences: true, relationships: true, aiSearchProject: true },
    });
  }

  async getSources() {
    return this.prisma.citationSource.findMany({
      include: { citations: { take: 5 } },
      orderBy: { authorityScore: 'desc' },
      take: 50,
    });
  }

  async getUrls() {
    return this.prisma.citationURL.findMany({
      include: { source: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getAuthorityBreakdown() {
    const sources = await this.prisma.citationSource.findMany();
    const levelMap = new Map<string, number>();

    for (const s of sources) {
      levelMap.set(s.authorityLevel, (levelMap.get(s.authorityLevel) || 0) + 1);
    }

    return {
      totalSources: sources.length,
      distribution: Object.fromEntries(levelMap),
    };
  }

  async getAnalytics(aiSearchProjectId?: string) {
    const citations = await this.prisma.citation.findMany({
      where: aiSearchProjectId ? { aiSearchProjectId } : undefined,
      include: { source: true },
    });

    const totalCitations = citations.length;
    if (totalCitations === 0) {
      return {
        totalCitations: 0,
        uniqueDomains: 0,
        uniqueUrls: 0,
        brandCitationSharePct: 0,
        diversityIndex: 0,
        typeBreakdown: {},
        topDomains: [],
      };
    }

    const uniqueDomains = new Set(citations.map((c) => c.domain)).size;
    const uniqueUrls = new Set(citations.map((c) => c.url)).size;
    const ownedCount = citations.filter((c) => c.sourceType === 'OWNED').length;
    const brandCitationSharePct = parseFloat(((ownedCount / totalCitations) * 100).toFixed(2));
    const diversityIndex = parseFloat((uniqueDomains / totalCitations).toFixed(2));

    const typeMap = new Map<string, number>();
    const domainMap = new Map<string, { count: number; authorityScore: number }>();

    for (const c of citations) {
      typeMap.set(c.sourceType, (typeMap.get(c.sourceType) || 0) + 1);
      const existing = domainMap.get(c.domain) || { count: 0, authorityScore: c.source?.authorityScore || 50 };
      existing.count += 1;
      domainMap.set(c.domain, existing);
    }

    const topDomains = Array.from(domainMap.entries())
      .map(([domain, val]) => ({
        domain,
        count: val.count,
        authorityScore: val.authorityScore,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalCitations,
      uniqueDomains,
      uniqueUrls,
      brandCitationSharePct,
      diversityIndex,
      typeBreakdown: Object.fromEntries(typeMap),
      topDomains,
    };
  }
}
