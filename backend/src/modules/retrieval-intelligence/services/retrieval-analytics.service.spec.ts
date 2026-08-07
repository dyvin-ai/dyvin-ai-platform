import { Test, TestingModule } from '@nestjs/testing';
import { RetrievalStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { RetrievalAnalyticsService } from './retrieval-analytics.service';

describe('RetrievalAnalyticsService', () => {
  let service: RetrievalAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetrievalAnalyticsService,
        {
          provide: PrismaService,
          useValue: {
            retrieval: {
              create: jest.fn().mockImplementation(({ data }) =>
                Promise.resolve({
                  id: 'ret-101',
                  ...data,
                }),
              ),
              count: jest.fn().mockResolvedValue(10),
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

    service = module.get<RetrievalAnalyticsService>(RetrievalAnalyticsService);
  });

  it('should record retrieval and return model comparisons', async () => {
    const result = await service.recordRetrieval('exec-1', 'docs.stripe.com', 'https://docs.stripe.com/api', 1);

    expect(result).toBeDefined();
    expect(result.id).toBe('ret-101');
    expect(result.domain).toBe('docs.stripe.com');
    expect(result.status).toBe(RetrievalStatus.SUCCESS);

    const models = await service.getModelComparison();
    expect(models).toHaveLength(4);
  });
});
