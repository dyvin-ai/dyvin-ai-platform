import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { PaymentProviderCode, PlanTier } from '@prisma/client';
import { StripePaymentProvider } from './stripe-payment.provider';

describe('StripePaymentProvider', () => {
  let provider: StripePaymentProvider;
  let mockStripeInstance: any;

  beforeEach(() => {
    provider = new StripePaymentProvider();

    mockStripeInstance = {
      customers: {
        create: jest.fn().mockResolvedValue({ id: 'cus_stripe_123' }),
      },
      checkout: {
        sessions: {
          create: jest.fn().mockImplementation((params) =>
            Promise.resolve({
              id: 'cs_stripe_mock_123',
              url: 'https://checkout.stripe.com/c/pay/cs_stripe_mock_123',
              amount_total: params.mode === 'subscription' ? 4900 : 1000,
              currency: 'usd',
            }),
          ),
        },
      },
      subscriptions: {
        create: jest.fn().mockResolvedValue({
          id: 'sub_stripe_123',
          status: 'active',
          current_period_start: 1700000000,
          current_period_end: 1702592000,
        }),
        cancel: jest.fn().mockResolvedValue({ id: 'sub_stripe_123', status: 'canceled' }),
        retrieve: jest.fn().mockResolvedValue({
          id: 'sub_stripe_123',
          items: { data: [{ id: 'si_123' }] },
        }),
        update: jest.fn().mockResolvedValue({
          id: 'sub_stripe_123',
          status: 'active',
          current_period_start: 1700000000,
          current_period_end: 1702592000,
        }),
      },
      paymentIntents: {
        create: jest.fn().mockResolvedValue({
          id: 'pi_123',
          client_secret: 'pi_123_secret',
        }),
      },
    };

    // Mock getStripeClient to return mockStripeInstance
    (provider as any).getStripeClient = jest.fn().mockImplementation(() => {
      const key = process.env['STRIPE_SECRET_KEY'];
      if (!key) throw new ServiceUnavailableException('[Stripe] STRIPE_SECRET_KEY is not configured.');
      return mockStripeInstance;
    });

    process.env['STRIPE_SECRET_KEY'] = 'sk_test_mock_stripe_key';
    process.env['STRIPE_PRICE_STARTER'] = 'price_starter_monthly_123';
    process.env['STRIPE_PRICE_GROWTH_MONTHLY'] = 'price_growth_monthly_456';
  });

  afterEach(() => {
    delete process.env['STRIPE_SECRET_KEY'];
    delete process.env['STRIPE_PRICE_STARTER'];
    delete process.env['STRIPE_PRICE_GROWTH_MONTHLY'];
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
    expect(provider.providerCode).toBe(PaymentProviderCode.STRIPE);
  });

  it('should throw ServiceUnavailableException when STRIPE_SECRET_KEY is missing', async () => {
    delete process.env['STRIPE_SECRET_KEY'];
    await expect(
      provider.createCustomer({
        organizationId: 'org-1',
        email: 'test@example.com',
        name: 'Test Org',
      }),
    ).rejects.toThrow(ServiceUnavailableException);
  });

  describe('createCheckoutSession', () => {
    it('should create subscription checkout session with resolved price ID and metadata', async () => {
      const res = await provider.createCheckoutSession({
        organizationId: 'org-1',
        userId: 'user-1',
        customerEmail: 'test@example.com',
        mode: 'subscription',
        planCode: PlanTier.STARTER,
        interval: 'MONTHLY',
        amount: 49,
        successUrl: 'https://app.dyvin.ai/billing?success=true',
        cancelUrl: 'https://app.dyvin.ai/billing?canceled=true',
      });

      expect(res.sessionId).toBe('cs_stripe_mock_123');
      expect(res.providerCode).toBe(PaymentProviderCode.STRIPE);
      expect(res.url).toContain('checkout.stripe.com');
      expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'subscription',
          line_items: [{ price: 'price_starter_monthly_123', quantity: 1 }],
          customer_email: 'test@example.com',
          metadata: expect.objectContaining({
            organizationId: 'org-1',
            userId: 'user-1',
            planCode: PlanTier.STARTER,
            purpose: 'subscription',
          }),
        }),
        undefined,
      );
    });

    it('should create one-off credit top-up checkout session with amount in cents', async () => {
      const res = await provider.createCheckoutSession({
        organizationId: 'org-1',
        userId: 'user-1',
        customerEmail: 'test@example.com',
        mode: 'payment',
        credits: 100,
        amount: 10,
        currency: 'usd',
      });

      expect(res.sessionId).toBe('cs_stripe_mock_123');
      expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'payment',
          line_items: [
            expect.objectContaining({
              price_data: expect.objectContaining({
                unit_amount: 1000, // $10.00 in cents
                currency: 'usd',
              }),
            }),
          ],
          metadata: expect.objectContaining({
            organizationId: 'org-1',
            purpose: 'top_up',
            credits: '100',
          }),
        }),
        undefined,
      );
    });

    it('should pass idempotencyKey when provided', async () => {
      await provider.createCheckoutSession({
        organizationId: 'org-1',
        userId: 'user-1',
        mode: 'payment',
        amount: 10,
        idempotencyKey: 'idem_key_123',
      });

      expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
        expect.anything(),
        { idempotencyKey: 'idem_key_123' },
      );
    });

    it('should reject subscription checkout when planCode is missing', async () => {
      await expect(
        provider.createCheckoutSession({
          organizationId: 'org-1',
          userId: 'user-1',
          mode: 'subscription',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createCustomer', () => {
    it('should create customer and return provider customer ID', async () => {
      const res = await provider.createCustomer({
        organizationId: 'org-1',
        email: 'test@example.com',
        name: 'Test Org',
      });

      expect(res.providerCustomerId).toBe('cus_stripe_123');
      expect(res.providerCode).toBe(PaymentProviderCode.STRIPE);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription via stripe client', async () => {
      const res = await provider.cancelSubscription('sub_stripe_123');
      expect(res.canceled).toBe(true);
      expect(mockStripeInstance.subscriptions.cancel).toHaveBeenCalledWith('sub_stripe_123');
    });
  });
});
