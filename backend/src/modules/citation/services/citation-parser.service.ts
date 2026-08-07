import { Injectable, Logger } from '@nestjs/common';
import { CitationSentimentType, CitationSourceType, CitationType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { CitationAuthorityService } from './citation-authority.service';
import { CitationNormalizationService } from './citation-normalization.service';

export interface ParseResponseInput {
  aiSearchProjectId: string;
  executionId: string;
  responseText: string;
  brandDomain?: string;
}

@Injectable()
export class CitationParserService {
  private readonly logger = new Logger(CitationParserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly normalizationService: CitationNormalizationService,
    private readonly authorityService: CitationAuthorityService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async parseAndExtractCitations(input: ParseResponseInput) {
    const isEnabled = await this.featureFlagService.evaluate('citation-intelligence');
    if (isEnabled === false) {
      this.logger.warn(`Citation Intelligence Engine disabled by Feature Flag.`);
    }

    // 1. Extract URLs using Regex
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`]+)/g;
    const matches = input.responseText.match(urlRegex) || [];
    const extractedUrls = Array.from(new Set(matches));

    this.logger.log(`Extracted ${extractedUrls.length} unique URLs for Execution [${input.executionId}]`);

    const createdCitations = [];

    for (let i = 0; i < extractedUrls.length; i++) {
      const rawUrl = extractedUrls[i];
      const norm = this.normalizationService.normalizeUrl(rawUrl);
      const sourceType = this.classifySourceType(norm.domain, input.brandDomain);
      const auth = this.authorityService.calculateAuthority(norm.domain, sourceType);

      // 2. Upsert Citation Source & Authority
      const source = await this.prisma.citationSource.upsert({
        where: { domain: norm.domain },
        update: { authorityScore: auth.authorityScore, authorityLevel: auth.authorityLevel },
        create: {
          domain: norm.domain,
          apexDomain: norm.apexDomain,
          authorityScore: auth.authorityScore,
          authorityLevel: auth.authorityLevel,
          sourceType,
        },
      });

      // 3. Upsert Citation URL
      await this.prisma.citationURL.upsert({
        where: { rawUrl: norm.canonicalUrl },
        update: {},
        create: {
          sourceId: source.id,
          rawUrl: norm.canonicalUrl,
          canonicalUrl: norm.canonicalUrl,
          path: norm.path,
        },
      });

      // 4. Create Citation Entry
      const citation = await this.prisma.citation.create({
        data: {
          aiSearchProjectId: input.aiSearchProjectId,
          executionId: input.executionId,
          url: norm.canonicalUrl,
          domain: norm.domain,
          citationType: CitationType.LINK,
          sourceType,
          sentiment: CitationSentimentType.POSITIVE,
          positionRank: i + 1,
          snippet: `Extracted from response index ${i + 1}`,
          occurrences: {
            create: [
              {
                executionId: input.executionId,
                aiSearchProjectId: input.aiSearchProjectId,
                positionRank: i + 1,
                contextSnippet: norm.canonicalUrl,
              },
            ],
          },
          relationships: {
            create: [
              {
                relationName: 'MENTIONED_BY',
                targetEntity: norm.domain,
              },
            ],
          },
        },
        include: { source: true, occurrences: true, relationships: true },
      });

      createdCitations.push(citation);
    }

    await this.auditService.logAction({
      action: 'CITATION_PARSED',
      metadata: { executionId: input.executionId, totalParsed: createdCitations.length },
    });

    return createdCitations;
  }

  private classifySourceType(domain: string, brandDomain?: string): CitationSourceType {
    const d = domain.toLowerCase();
    if (brandDomain && d.includes(brandDomain.toLowerCase())) return CitationSourceType.OWNED;
    if (d.includes('.gov') || d.includes('.gov.')) return CitationSourceType.GOVERNMENT;
    if (d.includes('wikipedia.org') || d.includes('.edu') || d.includes('arxiv.org')) return CitationSourceType.ACADEMIC;
    if (d.includes('github.com') || d.includes('docs.')) return CitationSourceType.DOCUMENTATION;
    if (d.includes('stackoverflow.com') || d.includes('reddit.com')) return CitationSourceType.FORUM;
    if (d.includes('twitter.com') || d.includes('linkedin.com') || d.includes('youtube.com')) return CitationSourceType.SOCIAL;
    if (d.includes('techcrunch.com') || d.includes('reuters.com') || d.includes('bloomberg.com')) return CitationSourceType.NEWS;

    return CitationSourceType.THIRD_PARTY;
  }
}
