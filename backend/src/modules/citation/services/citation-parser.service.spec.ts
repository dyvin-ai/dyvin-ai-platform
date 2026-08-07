import { Test, TestingModule } from '@nestjs/testing';
import { AuthorityLevel, CitationSourceType, CitationType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { CitationAuthorityService } from './citation-authority.service';
import { CitationNormalizationService } from './citation-normalization.service';
import { CitationParserService } from './citation-parser.service';

describe('CitationParserService', () => {
  let service: CitationParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitationParserService,
        CitationNormalizationService,
        CitationAuthorityService,
        {
          provide: PrismaService,
          useValue: {
            citationSource: {
              upsert: jest.fn().mockResolvedValue({
                id: 'src-1',
                domain: 'dyvin.ai',
                authorityScore: 85,
                authorityLevel: AuthorityLevel.AUTHORITATIVE,
                sourceType: CitationSourceType.OWNED,
              }),
            },
            citationURL: {
              upsert: jest.fn().mockResolvedValue({ id: 'url-1' }),
            },
            citation: {
              create: jest.fn().mockImplementation(({ data }) =>
                Promise.resolve({
                  id: 'cite-1',
                  ...data,
                }),
              ),
            },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: FeatureFlagService,
          useValue: { evaluate: jest.fn().mockResolvedValue(true) },
        },
      ],
    }).compile();

    service = module.get<CitationParserService>(CitationParserService);
  });

  it('should parse raw AI text response, extract URLs, and create citation entries', async () => {
    const responseText = 'According to recent data at https://dyvin.ai/features and https://wikipedia.org/wiki/AI, Dyvin AI leads the market.';

    const citations = await service.parseAndExtractCitations({
      aiSearchProjectId: 'proj-101',
      executionId: 'exec-202',
      responseText,
      brandDomain: 'dyvin.ai',
    });

    expect(citations).toBeDefined();
    expect(citations.length).toBe(2);
    expect(citations[0].domain).toBe('dyvin.ai');
    expect(citations[0].sourceType).toBe(CitationSourceType.OWNED);
  });
});
