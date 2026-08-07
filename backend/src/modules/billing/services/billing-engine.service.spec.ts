import { Test, TestingModule } from '@nestjs/testing';
import { PlanTier } from '@prisma/client';
import { BillingEngineService } from './billing-engine.service';
import { InvoiceService } from './invoice.service';
import { QuotaEnforcementService } from './quota-enforcement.service';
import { SubscriptionService } from './subscription.service';
import { WebhookProcessorService } from './webhook-processor.service';

describe('BillingEngineService', () => {
  let service: BillingEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingEngineService,
        {
          provide: SubscriptionService,
          useValue: {
            getPlans: jest.fn().mockResolvedValue([{ code: PlanTier.GROWTH }]),
            getSubscription: jest.fn().mockResolvedValue({ id: 'sub-1' }),
            subscribe: jest.fn().mockResolvedValue({ id: 'sub-1' }),
            cancel: jest.fn().mockResolvedValue({ cancelAtPeriodEnd: true }),
            resume: jest.fn().mockResolvedValue({ cancelAtPeriodEnd: false }),
            changePlan: jest.fn().mockResolvedValue({ id: 'sub-1' }),
          },
        },
        { provide: QuotaEnforcementService, useValue: { getOrganizationUsage: jest.fn().mockResolvedValue([]) } },
        { provide: InvoiceService, useValue: { getInvoices: jest.fn().mockResolvedValue([]), getPayments: jest.fn().mockResolvedValue([]) } },
        { provide: WebhookProcessorService, useValue: {} },
      ],
    }).compile();

    service = module.get<BillingEngineService>(BillingEngineService);
  });

  it('should delegate getPlans to SubscriptionService', async () => {
    const plans = await service.getPlans();
    expect(plans.length).toBe(1);
  });
});
