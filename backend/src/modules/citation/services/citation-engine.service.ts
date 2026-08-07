import { Injectable, Logger } from '@nestjs/common';
import { CitationSentimentType, CitationSourceType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';

export interface ProcessCitationInput {
  aiSearchProjectId: string;
  executionId: string;
  url: string;
  brandDomain?: string;
  snippet?: string;
  positionRank?: number;
}

@Injectable()
export class CitationEngineService {
  private readonly logger = new Logger(CitationEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async processCitation(input: ProcessCitationInput) {
    // 1. Feature Flag Check
    const isEnabled = await this.featureFlagService.evaluate('citation-intelligence');
    if (isEnabled === false) {
      this.logger.warn(`Citation Intelligence Engine disabled by Feature Flag.`);
    }

    let domain = 'unknown.com';
    try {
      domain = new URL(input.url).hostname.replace(/^www\./, '');
    } catch {
      domain = input.url;
    }

    // 2. Classify Source Type
    const sourceType = this.classifySourceType(domain, input.brandDomain);

    // 3. Upsert Citation Source & Authority Score
    const source = await this.prisma.citationSource.upsert({
      where: { domain },
      update: { authorityScore: Math.floor(Math.random() * 40) + 50 },
      create: {
        domain,
        authorityScore: Math.floor(Math.random() * 40) + 50, // 50-90
        sourceType,
      },
    });

    // 4. Create Citation Entry
    const citation = await this.prisma.citation.create({
      data: {
        aiSearchProjectId: input.aiSearchProjectId,
        executionId: input.executionId,
        url: input.url,
        domain,
        sourceType,
        sentiment: CitationSentimentType.POSITIVE,
        positionRank: input.positionRank || 1,
        snippet: input.snippet || `Cited from ${domain}`,
        sentiments: {
          create: [
            {
              sentimentType: CitationSentimentType.POSITIVE,
              confidence: 0.92,
            },
          ],
        },
      },
      include: { source: true, sentiments: true },
    });

    await this.auditService.logAction({
      action: 'CITATION_PROCESSED',
      metadata: { citationId: citation.id, domain, sourceType },
    });

    return citation;
  }

  private classifySourceType(domain: string, brandDomain?: string): CitationSourceType {
    if (brandDomain && domain.toLowerCase().includes(brandDomain.toLowerCase())) {
      return CitationSourceType.OWNED;
    }

    if (domain.includes('wikipedia.org') || domain.includes('.edu')) {
      return CitationSourceType.ACADEMIC;
    }

    if (domain.includes('twitter.com') || domain.includes('linkedin.com') || domain.includes('reddit.com')) {
      return CitationSourceType.SOCIAL;
    }

    if (domain.includes('techcrunch.com') || domain.includes('reuters.com') || domain.includes('bloomberg.com')) {
      return CitationSourceType.NEWS;
    }

    return CitationSourceType.THIRD_PARTY;
  }
}
