import { Test, TestingModule } from '@nestjs/testing';
import { UsageMetricType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { QuotaEnforcementService } from './quota-enforcement.service';

describe('QuotaEnforcementService', () => {
  let service: QuotaEnforcementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotaEnforcementService,
        {
          provide: PrismaService,
          useValue: {
            usageQuota: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'q-1',
                organizationId: 'org-1',
                metricType: UsageMetricType.SCANS,
                monthlyLimit: 100,
                currentUsage: 10,
                resetAt: new Date(Date.now() + 86400000),
              }),
              create: jest.fn().mockResolvedValue({}),
              update: jest.fn().mockResolvedValue({}),
              findMany: jest.fn().mockResolvedValue([]),
            },
            usageRecord: {
              create: jest.fn().mockResolvedValue({ id: 'ur-1' }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<QuotaEnforcementService>(QuotaEnforcementService);
  });

  it('should evaluate quota and allow usage within monthly limit', async () => {
    const res = await service.checkQuota('org-1', UsageMetricType.SCANS, 1);
    expect(res.allowed).toBe(true);
    expect(res.currentUsage).toBe(10);
  });

  it('should record usage when allowed', async () => {
    const res = await service.recordUsage('org-1', UsageMetricType.SCANS, 1);
    expect(res.success).toBe(true);
  });
});
