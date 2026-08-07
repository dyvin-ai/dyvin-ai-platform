import { Test, TestingModule } from '@nestjs/testing';
import { CitationSourceType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { CitationEngineService } from './citation-engine.service';

describe('CitationEngineService', () => {
  let service: CitationEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitationEngineService,
        {
          provide: PrismaService,
          useValue: {
            citationSource: {
              upsert: jest.fn().mockResolvedValue({
                id: 'src-1',
                domain: 'dyvin.ai',
                authorityScore: 85,
                sourceType: CitationSourceType.OWNED,
              }),
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

    service = module.get<CitationEngineService>(CitationEngineService);
  });

  it('should process citation and return classified citation entry', async () => {
    const res = await service.processCitation({
      aiSearchProjectId: 'proj-1',
      executionId: 'exec-1',
      url: 'https://dyvin.ai/features',
      brandDomain: 'dyvin.ai',
    });

    expect(res).toBeDefined();
    expect(res.id).toBe('cite-1');
    expect(res.domain).toBe('dyvin.ai');
    expect(res.sourceType).toBe(CitationSourceType.OWNED);
  });
});
