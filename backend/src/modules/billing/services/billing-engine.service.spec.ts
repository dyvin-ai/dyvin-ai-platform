import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BillingInterval, PaymentProviderCode, PlanTier } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PaymentProviderRouter } from '../providers/payment-provider-router.service';
import { BillingEngineService } from './billing-engine.service';
import { InvoiceService } from './invoice.service';
import { QuotaEnforcementService } from './quota-enforcement.service';
import { SubscriptionService } from './subscription.service';
import { WebhookProcessorService } from './webhook-processor.service';

describe('BillingEngineService', () => {
  let service: BillingEngineService;
  let prismaMock: any;
  let mockProvider: any;

  beforeEach(async () => {
    prismaMock = {
      subscriptionPlan: {
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.code === PlanTier.STARTER) {
            return Promise.resolve({
              id: 'plan-starter',
              code: PlanTier.STARTER,
              priceMonthly: 49,
              priceYearly: 490,
              currency: 'USD',
              isActive: true,
            });
          }
          if (where.code === PlanTier.FREE) {
            return Promise.resolve({
              id: 'plan-free',
              code: PlanTier.FREE,
              priceMonthly: 0,
              priceYearly: 0,
              currency: 'USD',
              isActive: true,
            });
          }
          return Promise.resolve(null);
        }),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({ id: 'user-1', email: 'owner@test.com' }),
      },
    };

    mockProvider = {
      createCheckoutSession: jest.fn().mockResolvedValue({
        sessionId: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        providerCode: PaymentProviderCode.STRIPE,
        amount: 49,
        currency: 'USD',
      }),
      verifyPaymentSignature: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingEngineService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: PaymentProviderRouter,
          useValue: {
            getProvider: jest.fn().mockReturnValue(mockProvider),
          },
        },
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

  describe('createCheckout', () => {
    it('should create subscription checkout with validated server-side pricing', async () => {
      const res = await service.createCheckout('org-1', 'user-1', {
        mode: 'subscription',
        planCode: PlanTier.STARTER,
        interval: BillingInterval.MONTHLY,
      });

      expect(res.sessionId).toBe('cs_test_123');
      expect(mockProvider.createCheckoutSession).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 'org-1',
          planCode: PlanTier.STARTER,
          amount: 49,
          currency: 'USD',
          mode: 'subscription',
        }),
      );
    });

    it('should reject subscription checkout for FREE plan tier', async () => {
      await expect(
        service.createCheckout('org-1', 'user-1', {
          mode: 'subscription',
          planCode: PlanTier.FREE,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid checkout mode', async () => {
      await expect(
        service.createCheckout('org-1', 'user-1', {
          mode: 'invalid_mode' as any,
        }),
      ).rejects.toThrow('Invalid checkout mode');
    });

    it('should calculate server-side amount for credit top-ups without trusting client amount', async () => {
      await service.createCheckout('org-1', 'user-1', {
        mode: 'payment',
        topUpCredits: 100,
      });

      expect(mockProvider.createCheckoutSession).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 'org-1',
          credits: 100,
          amount: 10, // 100 credits * $0.10
          mode: 'payment',
        }),
      );
    });

    it('should apply volume discount rate for larger credit top-ups', async () => {
      await service.createCheckout('org-1', 'user-1', {
        mode: 'payment',
        topUpCredits: 1000,
      });

      expect(mockProvider.createCheckoutSession).toHaveBeenCalledWith(
        expect.objectContaining({
          credits: 1000,
          amount: 75, // 1000 * 0.075
        }),
      );
    });

    it('should reject invalid credit top-up quantity', async () => {
      await expect(
        service.createCheckout('org-1', 'user-1', {
          mode: 'payment',
          topUpCredits: 5, // minimum 10
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyPayment', () => {
    it('should return verified status when signature is valid', async () => {
      const res = await service.verifyPayment('org-1', 'user-1', {
        providerCode: PaymentProviderCode.RAZORPAY,
        orderId: 'order_123',
        paymentId: 'pay_123',
        signature: 'valid_sig',
      });

      expect(res.verified).toBe(true);
      expect(res.orderId).toBe('order_123');
    });

    it('should throw BadRequestException when signature is invalid', async () => {
      mockProvider.verifyPaymentSignature.mockReturnValue(false);

      await expect(
        service.verifyPayment('org-1', 'user-1', {
          providerCode: PaymentProviderCode.RAZORPAY,
          orderId: 'order_123',
          paymentId: 'pay_123',
          signature: 'bad_sig',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
