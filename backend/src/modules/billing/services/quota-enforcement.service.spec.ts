import { Test, TestingModule } from '@nestjs/testing';
import { UsageMetricType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { QuotaEnforcementService } from './quota-enforcement.service';

const futureResetAt = new Date(Date.now() + 86400000);

const baseQuota = {
  id: 'q-1',
  organizationId: 'org-1',
  metricType: UsageMetricType.SCANS,
  monthlyLimit: 100,
  currentUsage: 10,
  resetAt: futureResetAt,
};

describe('QuotaEnforcementService', () => {
  let service: QuotaEnforcementService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      usageQuota: {
        findUnique: jest.fn().mockResolvedValue({ ...baseQuota }),
        create: jest.fn().mockResolvedValue({ ...baseQuota, currentUsage: 0 }),
        update: jest.fn().mockResolvedValue({ ...baseQuota }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findMany: jest.fn().mockResolvedValue([baseQuota]),
      },
      usageRecord: {
        create: jest.fn().mockResolvedValue({ id: 'ur-1' }),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotaEnforcementService,
        {
          provide: PrismaService,
          useValue: prismaMock,
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

  it('should evaluate quota and deny usage at monthly limit', async () => {
    prismaMock.usageQuota.findUnique.mockResolvedValue({ ...baseQuota, currentUsage: 100 });
    const res = await service.checkQuota('org-1', UsageMetricType.SCANS, 1);
    expect(res.allowed).toBe(false);
  });

  it('should record usage when allowed (via atomic transaction)', async () => {
    prismaMock.$transaction.mockImplementation(async (fn: Function) => {
      const txMock = {
        usageQuota: {
          findUnique: jest.fn().mockResolvedValue({ ...baseQuota }),
          create: jest.fn(),
          update: jest.fn(),
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
        usageRecord: { create: jest.fn().mockResolvedValue({ id: 'ur-1' }) },
      };
      return fn(txMock);
    });

    const res = await service.recordUsage('org-1', UsageMetricType.SCANS, 1);
    expect(res.success).toBe(true);
  });

  it('should throw when concurrent request exhausted the remaining slot (updateMany returns 0)', async () => {
    prismaMock.$transaction.mockImplementation(async (fn: Function) => {
      const txMock = {
        usageQuota: {
          findUnique: jest.fn().mockResolvedValue({ ...baseQuota, currentUsage: 99 }),
          create: jest.fn(),
          update: jest.fn(),
          updateMany: jest.fn().mockResolvedValue({ count: 0 }), // concurrent request took the slot
        },
        usageRecord: { create: jest.fn() },
      };
      return fn(txMock);
    });

    await expect(service.recordUsage('org-1', UsageMetricType.SCANS, 1)).rejects.toThrow(
      'due to concurrent usage',
    );
  });
});
