import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

export interface SearchQueryInput {
  query: string;
  organizationId?: string;
  projectId?: string;
  types?: string[]; // 'PROJECT', 'REPORT', 'RECOMMENDATION', 'ENTITY', 'CONTENT'
  limit?: number;
}

export interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  description: string;
  score: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class SearchEngineService {
  private readonly logger = new Logger(SearchEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async search(input: SearchQueryInput): Promise<{ query: string; results: SearchResultItem[]; total: number }> {
    const q = input.query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // Search Projects
    if (!input.types || input.types.includes('PROJECT')) {
      const projects = await this.prisma.project.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
          organizationId: input.organizationId,
        },
        take: 10,
      });

      for (const p of projects) {
        results.push({
          id: p.id,
          type: 'PROJECT',
          title: p.name,
          description: p.description || `Domain: ${p.primaryDomain}`,
          score: 1.0,
          metadata: { primaryDomain: p.primaryDomain },
        });
      }
    }

    // Search Reports
    if (!input.types || input.types.includes('REPORT')) {
      const reports = await this.prisma.report.findMany({
        where: {
          title: { contains: q, mode: 'insensitive' },
          projectId: input.projectId,
        },
        take: 10,
      });

      for (const r of reports) {
        results.push({
          id: r.id,
          type: 'REPORT',
          title: r.title,
          description: r.summary || `Type: ${r.reportType}`,
          score: 0.9,
          metadata: { reportType: r.reportType },
        });
      }
    }

    // Search Recommendations
    if (!input.types || input.types.includes('RECOMMENDATION')) {
      const recs = await this.prisma.recommendation.findMany({
        where: {
          title: { contains: q, mode: 'insensitive' },
        },
        take: 10,
      });

      for (const rec of recs) {
        results.push({
          id: rec.id,
          type: 'RECOMMENDATION',
          title: rec.title,
          description: rec.summary,
          score: 0.85,
          metadata: { priority: rec.priority, category: rec.category },
        });
      }
    }

    // Autocomplete & Ranking
    results.sort((a, b) => b.score - a.score);

    return {
      query: input.query,
      results: results.slice(0, input.limit || 20),
      total: results.length,
    };
  }

  async autocomplete(query: string): Promise<string[]> {
    const res = await this.search({ query, limit: 5 });
    return res.results.map((r) => r.title);
  }
}
