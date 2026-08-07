import { Test, TestingModule } from '@nestjs/testing';
import { ComparisonPeriod } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CompetitorComparisonService } from './competitor-comparison.service';

describe('CompetitorComparisonService', () => {
  let service: CompetitorComparisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitorComparisonService,
        {
          provide: PrismaService,
          useValue: {
            competitor: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'comp-101',
                name: 'Competitor A',
                visibilities: [{ visibilityScore: 70.0 }],
                citations: [{ id: 'cite-1' }],
              }),
            },
            competitorComparison: {
              create: jest.fn().mockImplementation(({ data }) =>
                Promise.resolve({
                  id: 'comp-res-1',
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
      ],
    }).compile();

    service = module.get<CompetitorComparisonService>(CompetitorComparisonService);
  });

  it('should calculate win rate, loss rate, and create comparison entry', async () => {
    const res = await service.runComparison({
      competitorId: 'comp-101',
      brandScore: 80.0,
      period: ComparisonPeriod.WEEKLY,
    });

    expect(res).toBeDefined();
    expect(res.id).toBe('comp-res-1');
    expect(res.winRate).toBeGreaterThan(0);
    expect(res.lossRate).toBeGreaterThan(0);
  });
});
