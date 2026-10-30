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
      creditBalance: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'cb-1', organizationId: 'org-1', balance: 0, currency: 'USD' }),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: 'cb-1', organizationId: 'org-1', balance: data.balance.increment || 100 }),
        ),
      },
      creditTransaction: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'tx-1', amount: 100, type: 'TOP_UP' }),
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

  describe('grantCredits (Credit-Ledger Design & Idempotency)', () => {
    it('should atomically record top-up credits in CreditBalance and CreditTransaction without altering monthlyLimit', async () => {
      const updateUsageQuotaSpy = jest.fn();
      const updateCreditBalanceSpy = jest.fn().mockResolvedValue({ id: 'cb-1', balance: 100 });
      const createCreditTxSpy = jest.fn().mockResolvedValue({ id: 'ctx-1', amount: 100, type: 'TOP_UP' });

      prismaMock.$transaction.mockImplementation(async (fn: Function) => {
        const txMock = {
          creditBalance: {
            findFirst: jest.fn().mockResolvedValue({ id: 'cb-1', organizationId: 'org-1', balance: 0 }),
            create: jest.fn(),
            update: updateCreditBalanceSpy,
          },
          creditTransaction: {
            findFirst: jest.fn().mockResolvedValue(null), // no duplicate
            create: createCreditTxSpy,
          },
          usageQuota: {
            update: updateUsageQuotaSpy,
            updateMany: jest.fn(),
          },
        };
        return fn(txMock);
      });

      const res = await service.grantCredits({
        organizationId: 'org-1',
        credits: 100,
        providerTxId: 'tx_stripe_123',
        description: 'Test top-up',
      });

      expect(res.alreadyGranted).toBe(false);
      expect(updateCreditBalanceSpy).toHaveBeenCalledWith({
        where: { id: 'cb-1' },
        data: { balance: { increment: 100 } },
      });
      expect(createCreditTxSpy).toHaveBeenCalledWith({
        data: expect.objectContaining({
          creditId: 'cb-1',
          amount: 100,
          type: 'TOP_UP',
        }),
      });
      // CRITICAL: Ensure purchased credits do NOT increase the recurring monthly usage quota!
      expect(updateUsageQuotaSpy).not.toHaveBeenCalled();
    });

    it('should be idempotent on duplicate provider transaction ID and avoid duplicate credit grants', async () => {
      const updateCreditBalanceSpy = jest.fn();

      prismaMock.$transaction.mockImplementation(async (fn: Function) => {
        const txMock = {
          creditBalance: {
            findFirst: jest.fn().mockResolvedValue({ id: 'cb-1', organizationId: 'org-1', balance: 100 }),
          },
          creditTransaction: {
            findFirst: jest.fn().mockResolvedValue({
              id: 'ctx-existing',
              creditId: 'cb-1',
              amount: 100,
              description: 'Top-up: tx_stripe_duplicate',
            }),
          },
        };
        return fn(txMock);
      });

      const res = await service.grantCredits({
        organizationId: 'org-1',
        credits: 100,
        providerTxId: 'tx_stripe_duplicate',
      });

      expect(res.alreadyGranted).toBe(true);
      expect(updateCreditBalanceSpy).not.toHaveBeenCalled();
    });

    it('should reject non-positive credit amounts', async () => {
      await expect(
        service.grantCredits({
          organizationId: 'org-1',
          credits: 0,
          providerTxId: 'tx_zero',
        }),
      ).rejects.toThrow('Top-up credit quantity must be positive.');
    });
  });

  describe('executeWithQuotaReservation', () => {
    it('should automatically release reserved quota when downstream action fails', async () => {
      const releaseSpy = jest.spyOn(service, 'releaseQuota').mockResolvedValue(undefined as any);
      jest.spyOn(service, 'reserveQuota').mockResolvedValue({
        organizationId: 'org-1',
        metricType: UsageMetricType.SCANS,
        quantity: 1,
        currentUsage: 11,
      });

      await expect(
        service.executeWithQuotaReservation('org-1', UsageMetricType.SCANS, 1, async () => {
          throw new Error('Downstream BullMQ queue connection down');
        }),
      ).rejects.toThrow('Downstream BullMQ queue connection down');

      expect(releaseSpy).toHaveBeenCalledWith('org-1', UsageMetricType.SCANS, 1);
    });
  });

  describe('deductCredits', () => {
    it('should atomically deduct credits from balance and record USAGE transaction', async () => {
      prismaMock.$transaction.mockImplementation(async (fn: Function) => {
        const txMock = {
          creditBalance: {
            findFirst: jest.fn().mockResolvedValue({ id: 'cb-1', organizationId: 'org-1', balance: 150 }),
            update: jest.fn().mockResolvedValue({ id: 'cb-1', balance: 100 }),
          },
          creditTransaction: {
            create: jest.fn().mockResolvedValue({ id: 'ctx-usage', amount: -50, type: 'USAGE' }),
          },
        };
        return fn(txMock);
      });

      const res = await service.deductCredits('org-1', 50, 'Scan execution');
      expect(res.success).toBe(true);
      expect(res.balance).toBe(100);
    });

    it('should reject when balance is insufficient', async () => {
      prismaMock.$transaction.mockImplementation(async (fn: Function) => {
        const txMock = {
          creditBalance: {
            findFirst: jest.fn().mockResolvedValue({ id: 'cb-1', organizationId: 'org-1', balance: 10 }),
          },
        };
        return fn(txMock);
      });

      await expect(service.deductCredits('org-1', 50)).rejects.toThrow('Insufficient credit balance');
    });
  });
});
