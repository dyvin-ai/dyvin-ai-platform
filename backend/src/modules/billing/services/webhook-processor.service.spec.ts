import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BillingInterval,
  PaymentProviderCode,
  PaymentStatus,
  PlanTier,
  SubscriptionStatus,
  UsageMetricType,
  WebhookEventStatus,
} from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PaymentProviderRouter } from '../providers/payment-provider-router.service';
import { QuotaEnforcementService } from './quota-enforcement.service';
import { SubscriptionService } from './subscription.service';
import { WebhookProcessorService } from './webhook-processor.service';

describe('WebhookProcessorService', () => {
  let service: WebhookProcessorService;
  let prismaMock: any;
  let subscriptionServiceMock: any;
  let quotaEnforcementMock: any;
  let mockProvider: any;

  beforeEach(async () => {
    prismaMock = {
      webhookEvent: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({ id: 'evt-1', status: WebhookEventStatus.PROCESSED }),
        update: jest.fn().mockResolvedValue({ id: 'evt-1', status: WebhookEventStatus.PROCESSED }),
      },
      organizationSubscription: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'sub-existing',
          organizationId: 'org-1',
          planId: 'plan-starter',
          status: SubscriptionStatus.ACTIVE,
          externalSubId: 'sub_ext_123',
        }),
        create: jest.fn().mockResolvedValue({ id: 'sub-created' }),
        update: jest.fn().mockResolvedValue({ id: 'sub-updated' }),
      },
      subscriptionPlan: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'plan-starter',
          code: PlanTier.STARTER,
          priceMonthly: 49,
          priceYearly: 490,
        }),
      },
      payment: {
        create: jest.fn().mockResolvedValue({ id: 'pmt-1' }),
        findFirst: jest.fn().mockResolvedValue(null),
      },
    };

    subscriptionServiceMock = {
      syncQuotaToSubscription: jest.fn().mockResolvedValue(undefined),
    };

    quotaEnforcementMock = {
      addCredits: jest.fn().mockResolvedValue(undefined),
      grantCredits: jest.fn().mockResolvedValue({
        alreadyGranted: false,
        creditBalance: { id: 'cb-1', balance: 100 },
      }),
    };

    mockProvider = {
      verifyWebhookSignature: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookProcessorService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: PaymentProviderRouter,
          useValue: {
            getProvider: jest.fn().mockReturnValue(mockProvider),
          },
        },
        { provide: SubscriptionService, useValue: subscriptionServiceMock },
        { provide: QuotaEnforcementService, useValue: quotaEnforcementMock },
      ],
    }).compile();

    service = module.get<WebhookProcessorService>(WebhookProcessorService);
  });

  it('should verify signature and process inbound mock webhook event', async () => {
    const res = await service.processWebhook({
      providerCode: PaymentProviderCode.MOCK,
      signature: 'valid_sig',
      body: { id: 'evt_100', type: 'invoice.paid' },
    });
    expect(res.success).toBe(true);
    expect(res.status).toBe(WebhookEventStatus.PROCESSED);
  });

  it('should reject a non-MOCK webhook event with a missing signature', async () => {
    await expect(
      service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: '',
        body: { id: 'evt_200', type: 'invoice.paid' },
        rawBody: '{"id":"evt_200"}',
      }),
    ).rejects.toThrow('Missing webhook signature');
  });

  it('should reject a webhook event when provider signature verification fails', async () => {
    mockProvider.verifyWebhookSignature.mockReturnValue(false);

    await expect(
      service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: 'invalid_sig',
        body: { id: 'evt_200', type: 'invoice.paid' },
        rawBody: '{"id":"evt_200"}',
      }),
    ).rejects.toThrow('Invalid webhook signature');
  });

  it('should return idempotent response when event was already processed', async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      eventId: 'evt_100',
      status: WebhookEventStatus.PROCESSED,
    });

    const res = await service.processWebhook({
      providerCode: PaymentProviderCode.MOCK,
      signature: 'sig',
      body: { id: 'evt_100', type: 'invoice.paid' },
    });

    expect(res.message).toBe('Webhook event already processed.');
    expect(prismaMock.webhookEvent.update).not.toHaveBeenCalled();
  });

  describe('Stripe event processing', () => {
    it('should process checkout.session.completed for subscription activation', async () => {
      const res = await service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: 'valid_sig',
        body: {
          id: 'evt_stripe_checkout',
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'cs_123',
              mode: 'subscription',
              subscription: 'sub_stripe_abc',
              amount_total: 4900,
              currency: 'usd',
              payment_intent: 'pi_123',
              metadata: {
                organizationId: 'org-1',
                planCode: PlanTier.STARTER,
                interval: BillingInterval.MONTHLY,
                purpose: 'subscription',
              },
            },
          },
        },
      });

      expect(res.success).toBe(true);
      expect(prismaMock.organizationSubscription.update).toHaveBeenCalled();
      expect(subscriptionServiceMock.syncQuotaToSubscription).toHaveBeenCalledWith('org-1', PlanTier.STARTER);
      expect(prismaMock.payment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            amount: 49,
            currency: 'USD',
            status: PaymentStatus.SUCCEEDED,
            externalTxId: 'pi_123',
          }),
        }),
      );
    });

    it('should process checkout.session.completed for credit top-up', async () => {
      const res = await service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: 'valid_sig',
        body: {
          id: 'evt_stripe_topup',
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'cs_topup_123',
              mode: 'payment',
              amount_total: 1000,
              currency: 'usd',
              payment_intent: 'pi_topup_123',
              metadata: {
                organizationId: 'org-1',
                purpose: 'top_up',
                credits: '100',
              },
            },
          },
        },
      });

      expect(res.success).toBe(true);
      expect(quotaEnforcementMock.grantCredits).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 'org-1',
          credits: 100,
        }),
      );
      expect(prismaMock.payment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            amount: 10,
            status: PaymentStatus.SUCCEEDED,
          }),
        }),
      );
    });

    it('should process customer.subscription.updated', async () => {
      await service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: 'valid_sig',
        body: {
          id: 'evt_sub_updated',
          type: 'customer.subscription.updated',
          data: {
            object: {
              id: 'sub_ext_123',
              status: 'active',
              current_period_start: 1700000000,
              current_period_end: 1702592000,
              cancel_at_period_end: false,
            },
          },
        },
      });

      expect(prismaMock.organizationSubscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: SubscriptionStatus.ACTIVE,
          }),
        }),
      );
    });

    it('should process customer.subscription.deleted', async () => {
      await service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: 'valid_sig',
        body: {
          id: 'evt_sub_deleted',
          type: 'customer.subscription.deleted',
          data: {
            object: {
              id: 'sub_ext_123',
            },
          },
        },
      });

      expect(prismaMock.organizationSubscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: SubscriptionStatus.CANCELED,
          }),
        }),
      );
    });

    it('should process invoice.payment_succeeded', async () => {
      await service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: 'valid_sig',
        body: {
          id: 'evt_inv_paid',
          type: 'invoice.payment_succeeded',
          data: {
            object: {
              id: 'in_123',
              subscription: 'sub_ext_123',
              amount_paid: 4900,
              currency: 'usd',
              payment_intent: 'pi_inv_123',
            },
          },
        },
      });

      expect(prismaMock.organizationSubscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: SubscriptionStatus.ACTIVE }),
        }),
      );
      expect(prismaMock.payment.create).toHaveBeenCalled();
    });

    it('should process invoice.payment_failed', async () => {
      await service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: 'valid_sig',
        body: {
          id: 'evt_inv_fail',
          type: 'invoice.payment_failed',
          data: {
            object: {
              id: 'in_fail_123',
              subscription: 'sub_ext_123',
              amount_due: 4900,
              currency: 'usd',
              last_payment_error: { message: 'Card declined' },
            },
          },
        },
      });

      expect(prismaMock.organizationSubscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: SubscriptionStatus.PAST_DUE }),
        }),
      );
      expect(prismaMock.payment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: PaymentStatus.FAILED,
            failureReason: 'Card declined',
          }),
        }),
      );
    });
  });

  describe('Razorpay event processing', () => {
    it('should process order.paid for credit top-up', async () => {
      const res = await service.processWebhook({
        providerCode: PaymentProviderCode.RAZORPAY,
        signature: 'valid_sig',
        body: {
          id: 'evt_rzp_paid',
          event: 'order.paid',
          payload: {
            order: {
              entity: {
                id: 'order_rzp_123',
                amount: 1000,
                currency: 'INR',
                notes: {
                  organizationId: 'org-1',
                  purpose: 'top_up',
                  credits: '50',
                },
              },
            },
          },
        },
      });

      expect(res.success).toBe(true);
      expect(quotaEnforcementMock.grantCredits).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 'org-1',
          credits: 50,
        }),
      );
      expect(prismaMock.payment.create).toHaveBeenCalled();
    });

    it('should process payment.failed', async () => {
      await service.processWebhook({
        providerCode: PaymentProviderCode.RAZORPAY,
        signature: 'valid_sig',
        body: {
          id: 'evt_rzp_failed',
          event: 'payment.failed',
          payload: {
            payment: {
              entity: {
                id: 'pay_fail_123',
                amount: 1000,
                currency: 'INR',
                error_description: 'Payment expired',
                notes: {
                  organizationId: 'org-1',
                },
              },
            },
          },
        },
      });

      expect(prismaMock.payment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: PaymentStatus.FAILED,
            failureReason: 'Payment expired',
          }),
        }),
      );
    });
  });

  it('should mark webhook event as FAILED when an error occurs during dispatch', async () => {
    prismaMock.subscriptionPlan.findUnique.mockRejectedValue(new Error('DB failure'));

    await expect(
      service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: 'valid_sig',
        body: {
          id: 'evt_err',
          type: 'checkout.session.completed',
          data: {
            object: {
              mode: 'subscription',
              metadata: { organizationId: 'org-1', planCode: PlanTier.STARTER },
            },
          },
        },
      }),
    ).rejects.toThrow('DB failure');

    expect(prismaMock.webhookEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { eventId: 'evt_err' },
        data: expect.objectContaining({ status: WebhookEventStatus.FAILED }),
      }),
    );
  });

  describe('P1 Review Findings Enforcements', () => {
    it('should reject MOCK webhooks when NODE_ENV is production', async () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        await expect(
          service.processWebhook({
            providerCode: PaymentProviderCode.MOCK,
            signature: 'sig',
            body: { id: 'evt_prod_mock', type: 'invoice.paid' },
          }),
        ).rejects.toThrow(BadRequestException);
      } finally {
        process.env.NODE_ENV = origEnv;
      }
    });

    it('should reject Stripe checkout.session.completed without organizationId', async () => {
      await expect(
        service.processWebhook({
          providerCode: PaymentProviderCode.STRIPE,
          signature: 'sig',
          body: {
            id: 'evt_missing_org',
            type: 'checkout.session.completed',
            data: {
              object: {
                mode: 'subscription',
                metadata: { planCode: PlanTier.STARTER },
              },
            },
          },
        }),
      ).rejects.toThrow('Missing organizationId in Stripe checkout session metadata.');
    });

    it('should reject unhandled webhook event type', async () => {
      await expect(
        service.processWebhook({
          providerCode: PaymentProviderCode.STRIPE,
          signature: 'sig',
          body: {
            id: 'evt_unknown',
            type: 'customer.source.created',
            data: { object: {} },
          },
        }),
      ).rejects.toThrow('Unhandled Stripe webhook event type: customer.source.created');
    });

    it('should prevent duplicate Payment creation when externalTxId already recorded', async () => {
      prismaMock.payment.findFirst.mockResolvedValueOnce({ id: 'pmt-already-exists' });

      await service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: 'valid_sig',
        body: {
          id: 'evt_stripe_sub_dup',
          type: 'checkout.session.completed',
          data: {
            object: {
              mode: 'subscription',
              subscription: 'sub_ext_123',
              payment_intent: 'pi_dup_123',
              currency: 'usd',
              metadata: {
                organizationId: 'org-1',
                planCode: PlanTier.STARTER,
              },
            },
          },
        },
      });

      // payment.create should NOT have been called because findFirst returned an existing payment
      expect(prismaMock.payment.create).not.toHaveBeenCalled();
    });

    it('should process Razorpay subscription.charged and update active subscription', async () => {
      prismaMock.organizationSubscription.findFirst.mockResolvedValueOnce({
        id: 'sub-existing',
        externalSubId: 'sub_rzp_charged_123',
      });

      const res = await service.processWebhook({
        providerCode: PaymentProviderCode.RAZORPAY,
        signature: 'valid_sig',
        body: {
          id: 'evt_rzp_sub_charged',
          event: 'subscription.charged',
          payload: {
            subscription: {
              entity: {
                id: 'sub_rzp_charged_123',
                status: 'active',
                current_start: 1700000000,
                current_end: 1702592000,
                notes: { organizationId: 'org-1' },
              },
            },
            payment: {
              entity: {
                id: 'pay_sub_charged_123',
                amount: 4900,
                currency: 'INR',
                status: 'captured',
                notes: { organizationId: 'org-1' },
              },
            },
          },
        },
      });

      expect(res.success).toBe(true);
      expect(prismaMock.organizationSubscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'sub-existing' },
          data: expect.objectContaining({ status: SubscriptionStatus.ACTIVE }),
        }),
      );
    });

    it('should process Razorpay subscription.cancelled and mark subscription CANCELED', async () => {
      prismaMock.organizationSubscription.findFirst.mockResolvedValueOnce({
        id: 'sub-existing',
        externalSubId: 'sub_rzp_cancel_123',
      });

      const res = await service.processWebhook({
        providerCode: PaymentProviderCode.RAZORPAY,
        signature: 'valid_sig',
        body: {
          id: 'evt_rzp_sub_cancel',
          event: 'subscription.cancelled',
          payload: {
            subscription: {
              entity: {
                id: 'sub_rzp_cancel_123',
                status: 'cancelled',
                notes: { organizationId: 'org-1' },
              },
            },
          },
        },
      });

      expect(res.success).toBe(true);
      expect(prismaMock.organizationSubscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'sub-existing' },
          data: expect.objectContaining({ status: SubscriptionStatus.CANCELED }),
        }),
      );
    });

    it('should throw NotFoundException when Razorpay subscription is unmapped', async () => {
      prismaMock.organizationSubscription.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.processWebhook({
          providerCode: PaymentProviderCode.RAZORPAY,
          signature: 'valid_sig',
          body: {
            id: 'evt_rzp_unmapped',
            event: 'subscription.cancelled',
            payload: {
              subscription: {
                entity: {
                  id: 'sub_unknown_999',
                  notes: { organizationId: 'org-1' },
                },
              },
            },
          },
        }),
      ).rejects.toThrow('Subscription not found for Razorpay subscription ID: sub_unknown_999');
    });
  });
});
