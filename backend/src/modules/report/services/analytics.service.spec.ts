import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../database/prisma.service';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: {
            analyticsSnapshot: {
              findMany: jest.fn().mockResolvedValue([
                { snapshotDate: new Date(), overallScore: 78, knowledgeScore: 85, authorityScore: 72, trustScore: 90, technicalScore: 88 },
              ]),
            },
            trendAnalysis: {
              findMany: jest.fn().mockResolvedValue([]),
            },
            benchmark: {
              findFirst: jest.fn().mockResolvedValue(null),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should return analytics overview and current scores', async () => {
    const analytics = await service.getAnalyticsOverview('p-1');
    expect(analytics.currentMetrics.overallScore).toBe(78);
  });

  it('should return industry benchmark metrics', async () => {
    const benchmark = await service.getIndustryBenchmark('Technology');
    expect(benchmark.industry).toBe('Technology');
    expect(benchmark.averageScore).toBe(68);
  });
});
