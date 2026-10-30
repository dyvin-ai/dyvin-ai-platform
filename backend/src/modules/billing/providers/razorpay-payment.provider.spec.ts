import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { PaymentProviderCode, PlanTier } from '@prisma/client';
import * as crypto from 'crypto';
import { RazorpayPaymentProvider } from './razorpay-payment.provider';

describe('RazorpayPaymentProvider', () => {
  let provider: RazorpayPaymentProvider;
  let mockRazorpayInstance: any;

  beforeEach(() => {
    provider = new RazorpayPaymentProvider();

    mockRazorpayInstance = {
      customers: {
        create: jest.fn().mockResolvedValue({ id: 'cust_rzp_123' }),
      },
      orders: {
        create: jest.fn().mockImplementation((params) =>
          Promise.resolve({
            id: 'order_rzp_mock_123',
            amount: params.amount,
            currency: params.currency,
            status: 'created',
          }),
        ),
      },
      subscriptions: {
        create: jest.fn().mockResolvedValue({
          id: 'sub_rzp_mock_123',
          status: 'created',
          current_start: 1700000000,
          current_end: 1702592000,
        }),
        cancel: jest.fn().mockResolvedValue({ id: 'sub_rzp_mock_123', status: 'cancelled' }),
        update: jest.fn().mockResolvedValue({ id: 'sub_rzp_mock_123', status: 'active' }),
      },
    };

    (provider as any).getRazorpayClient = jest.fn().mockImplementation(() => {
      const keyId = process.env['RAZORPAY_KEY_ID'];
      const keySecret = process.env['RAZORPAY_KEY_SECRET'];
      if (!keyId || !keySecret) {
        throw new ServiceUnavailableException('[Razorpay] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured.');
      }
      return mockRazorpayInstance;
    });

    process.env['RAZORPAY_KEY_ID'] = 'rzp_test_mock_key';
    process.env['RAZORPAY_KEY_SECRET'] = 'rzp_mock_secret_12345';
    process.env['RAZORPAY_PLAN_STARTER'] = 'plan_rzp_starter_123';
  });

  afterEach(() => {
    delete process.env['RAZORPAY_KEY_ID'];
    delete process.env['RAZORPAY_KEY_SECRET'];
    delete process.env['RAZORPAY_PLAN_STARTER'];
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
    expect(provider.providerCode).toBe(PaymentProviderCode.RAZORPAY);
  });

  it('should throw ServiceUnavailableException when credentials are missing', async () => {
    delete process.env['RAZORPAY_KEY_ID'];
    await expect(
      provider.createCustomer({
        organizationId: 'org-1',
        email: 'test@example.com',
        name: 'Test Org',
      }),
    ).rejects.toThrow(ServiceUnavailableException);
  });

  describe('createCheckoutSession (Orders & Subscriptions)', () => {
    it('should create an order in paise for credit top-ups', async () => {
      const res = await provider.createCheckoutSession({
        organizationId: 'org-1',
        userId: 'user-1',
        mode: 'payment',
        credits: 100,
        amount: 10,
        currency: 'INR',
      });

      expect(res.orderId).toBe('order_rzp_mock_123');
      expect(res.providerCode).toBe(PaymentProviderCode.RAZORPAY);
      expect(res.keyId).toBe('rzp_test_mock_key');
      expect(mockRazorpayInstance.orders.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 1000, // 10 INR in paise
          currency: 'INR',
          notes: expect.objectContaining({
            organizationId: 'org-1',
            purpose: 'top_up',
            credits: '100',
          }),
        }),
      );
    });

    it('should create real subscription when Razorpay plan ID is configured', async () => {
      const res = await provider.createCheckoutSession({
        organizationId: 'org-1',
        userId: 'user-1',
        mode: 'subscription',
        planCode: PlanTier.STARTER,
        interval: 'MONTHLY',
        amount: 49,
      });

      expect(res.sessionId).toBe('sub_rzp_mock_123');
      expect(mockRazorpayInstance.subscriptions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          plan_id: 'plan_rzp_starter_123',
          customer_notify: 1,
        }),
      );
    });

    it('should fail safely when Razorpay plan ID is not configured without inventing fake IDs', async () => {
      await expect(
        provider.createCheckoutSession({
          organizationId: 'org-1',
          userId: 'user-1',
          mode: 'subscription',
          planCode: PlanTier.ENTERPRISE, // not configured
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyPaymentSignature', () => {
    it('should accept valid signature for orderId|paymentId payload', () => {
      const secret = 'rzp_mock_secret_12345';
      const orderId = 'order_123';
      const paymentId = 'pay_456';
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isValid = provider.verifyPaymentSignature({
        orderId,
        paymentId,
        signature: expectedSignature,
      });

      expect(isValid).toBe(true);
    });

    it('should reject tampered signature', () => {
      const isValid = provider.verifyPaymentSignature({
        orderId: 'order_123',
        paymentId: 'pay_456',
        signature: 'invalid_hex_signature_abcdef1234567890',
      });

      expect(isValid).toBe(false);
    });

    it('should reject when secret is missing', () => {
      delete process.env['RAZORPAY_KEY_SECRET'];
      const isValid = provider.verifyPaymentSignature({
        orderId: 'order_123',
        paymentId: 'pay_456',
        signature: 'sig',
      });

      expect(isValid).toBe(false);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription via Razorpay client', async () => {
      const res = await provider.cancelSubscription('sub_rzp_123');
      expect(res.canceled).toBe(true);
      expect(mockRazorpayInstance.subscriptions.cancel).toHaveBeenCalledWith('sub_rzp_123');
    });
  });
});
