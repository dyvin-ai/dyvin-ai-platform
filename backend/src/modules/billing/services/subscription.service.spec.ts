import { Test, TestingModule } from '@nestjs/testing';
import { PlanTier, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { PaymentProviderRouter } from '../providers/payment-provider-router.service';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: PrismaService,
          useValue: {
            subscriptionPlan: {
              findMany: jest.fn().mockResolvedValue([{ id: 'p-1', code: PlanTier.GROWTH, name: 'Growth' }]),
              findUnique: jest.fn().mockResolvedValue({ id: 'p-1', code: PlanTier.GROWTH }),
              upsert: jest.fn().mockResolvedValue({}),
            },
            organizationSubscription: {
              findFirst: jest.fn().mockResolvedValue({
                id: 'sub-1',
                organizationId: 'org-1',
                planId: 'p-1',
                status: SubscriptionStatus.ACTIVE,
                providerCode: 'MOCK',
                externalSubId: 'sub_mock_123',
              }),
              create: jest.fn().mockResolvedValue({ id: 'sub-1', status: SubscriptionStatus.ACTIVE }),
              update: jest.fn().mockResolvedValue({ id: 'sub-1', cancelAtPeriodEnd: true }),
            },
            billingAudit: { create: jest.fn().mockResolvedValue({}) },
            usageQuota: { upsert: jest.fn().mockResolvedValue({}) },
          },
        },
        {
          provide: PaymentProviderRouter,
          useValue: {
            getProvider: jest.fn().mockReturnValue({
              createCustomer: jest.fn().mockResolvedValue({ providerCustomerId: 'cus_1' }),
              createSubscription: jest.fn().mockResolvedValue({
                providerSubscriptionId: 'sub_1',
                status: 'ACTIVE',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(),
              }),
              cancelSubscription: jest.fn().mockResolvedValue({ canceled: true }),
              changePlan: jest.fn().mockResolvedValue({}),
            }),
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should subscribe organization to plan', async () => {
    const sub = await service.subscribe({ organizationId: 'org-1', planCode: PlanTier.GROWTH }, 'u-1');
    expect(sub.id).toBe('sub-1');
  });

  it('should cancel active subscription', async () => {
    const sub = await service.cancel('org-1', 'u-1');
    expect(sub.cancelAtPeriodEnd).toBe(true);
  });
});
