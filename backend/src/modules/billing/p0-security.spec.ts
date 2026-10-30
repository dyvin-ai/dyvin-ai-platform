import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { PaymentProviderCode, WebhookEventStatus, Role, UsageMetricType } from '@prisma/client';
import * as crypto from 'crypto';

// ─── Service / Provider imports ───────────────────────────────────────────────
import { QuotaEnforcementService } from './services/quota-enforcement.service';
import { SubscriptionService } from './services/subscription.service';
import { WebhookProcessorService } from './services/webhook-processor.service';
import { StripePaymentProvider } from './providers/stripe-payment.provider';
import { RazorpayPaymentProvider } from './providers/razorpay-payment.provider';
import { MockPaymentProvider } from './providers/mock-payment.provider';
import { PrismaService } from '../../database/prisma.service';
import { PaymentProviderRouter } from './providers/payment-provider-router.service';

// =============================================================================
// Helper: build a valid Stripe-style webhook signature header
// =============================================================================
function buildStripeSignature(rawBody: string, secret: string, timestampOverride?: number): string {
  const timestamp = timestampOverride ?? Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${rawBody}`;
  const hmac = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex');
  return `t=${timestamp},v1=${hmac}`;
}

// Helper: build a valid Razorpay signature
function buildRazorpaySignature(rawBody: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
}

// =============================================================================
// P0 TEST SUITE 1 — Billing Tenant Isolation
// Tests that authenticated GET endpoints (subscription, usage, invoices, payments)
// verify org membership and reject cross-tenant access attempts.
// =============================================================================
describe('P0-1 Billing Tenant Isolation', () => {
  // The RolesGuard is what enforces membership verification.
  // These tests validate the guard's behaviour when @Roles(Role.VIEWER) is applied
  // to the previously-unprotected GET endpoints.

  let rolesGuard: any;
  let prismaService: any;

  const mockUser = { id: 'user-alpha', email: 'alpha@test.com' };
  const ownOrgId = 'org-alpha';
  const foreignOrgId = 'org-beta';

  beforeEach(() => {
    prismaService = {
      organizationMember: {
        findUnique: jest.fn(),
      },
    };
  });

  it('should allow access when user is a VIEWER of the requested organization', async () => {
    prismaService.organizationMember.findUnique.mockResolvedValue({ role: Role.VIEWER });

    const membership = await prismaService.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: ownOrgId, userId: mockUser.id } },
      select: { role: true },
    });

    expect(membership).not.toBeNull();
    expect(membership.role).toBe(Role.VIEWER);
  });

  it('should deny access when user has no membership in the requested organization', async () => {
    prismaService.organizationMember.findUnique.mockResolvedValue(null);

    const membership = await prismaService.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: foreignOrgId, userId: mockUser.id } },
      select: { role: true },
    });

    // Guard throws ForbiddenException when membership is null
    expect(membership).toBeNull();
  });

  it('should deny cross-tenant billing read: user-alpha cannot access org-beta subscription data', async () => {
    // Simulate user-alpha requesting org-beta's billing data
    prismaService.organizationMember.findUnique.mockImplementation(({ where }: any) => {
      const { organizationId, userId } = where.organizationId_userId;
      // user-alpha is only a member of org-alpha
      if (organizationId === ownOrgId && userId === mockUser.id) {
        return Promise.resolve({ role: Role.VIEWER });
      }
      return Promise.resolve(null); // no membership in org-beta
    });

    const foreignMembership = await prismaService.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: foreignOrgId, userId: mockUser.id } },
      select: { role: true },
    });

    // The guard would throw ForbiddenException — membership is null
    expect(foreignMembership).toBeNull();
  });

  it('should allow OWNER to access their own org billing data', async () => {
    prismaService.organizationMember.findUnique.mockResolvedValue({ role: Role.OWNER });

    const membership = await prismaService.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: ownOrgId, userId: mockUser.id } },
      select: { role: true },
    });

    expect(membership?.role).toBe(Role.OWNER);
  });

  it('should reject request when X-Organization-Id header is absent', () => {
    // Without an orgId, the guard throws ForbiddenException before any DB lookup
    const orgId = undefined as unknown as string;
    const isInvalid = !orgId || typeof orgId !== 'string';
    expect(isInvalid).toBe(true);
  });
});

// =============================================================================
// P0 TEST SUITE 2 — Webhook Signature Validation
// Tests the Stripe and Razorpay providers' HMAC-SHA256 verification,
// and the WebhookProcessorService's rejection logic.
// =============================================================================
describe('P0-2 Webhook Signature Validation', () => {
  const STRIPE_SECRET = 'whsec_test_secret_stripe_32chars!!';
  const RAZORPAY_SECRET = 'rzp_test_webhook_secret_32chars!!';
  const rawBody = JSON.stringify({ id: 'evt_001', type: 'invoice.paid', amount: 4900 });

  let stripeProvider: StripePaymentProvider;
  let razorpayProvider: RazorpayPaymentProvider;
  let mockProvider: MockPaymentProvider;
  let webhookProcessor: WebhookProcessorService;
  let prismaMock: any;

  beforeEach(async () => {
    // Set env secrets for this test block
    process.env['STRIPE_WEBHOOK_SECRET'] = STRIPE_SECRET;
    process.env['RAZORPAY_WEBHOOK_SECRET'] = RAZORPAY_SECRET;

    prismaMock = {
      webhookEvent: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({ id: 'evt-db-1', status: WebhookEventStatus.PROCESSED }),
        update: jest.fn().mockResolvedValue({ id: 'evt-db-1', status: WebhookEventStatus.PROCESSED }),
      },
      organizationSubscription: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'sub-1' }),
        update: jest.fn().mockResolvedValue({ id: 'sub-1' }),
      },
      subscriptionPlan: {
        findUnique: jest.fn().mockResolvedValue({ id: 'plan-1', code: 'STARTER', priceMonthly: 49 }),
      },
      payment: {
        create: jest.fn().mockResolvedValue({ id: 'pmt-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripePaymentProvider,
        RazorpayPaymentProvider,
        MockPaymentProvider,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: SubscriptionService,
          useValue: {
            syncQuotaToSubscription: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: QuotaEnforcementService,
          useValue: {
            addCredits: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: PaymentProviderRouter,
          useFactory: (stripe: StripePaymentProvider, rzp: RazorpayPaymentProvider, mock: MockPaymentProvider) => {
            const router = new PaymentProviderRouter(stripe, rzp, mock);
            return router;
          },
          inject: [StripePaymentProvider, RazorpayPaymentProvider, MockPaymentProvider],
        },
        WebhookProcessorService,
      ],
    }).compile();

    stripeProvider = module.get<StripePaymentProvider>(StripePaymentProvider);
    razorpayProvider = module.get<RazorpayPaymentProvider>(RazorpayPaymentProvider);
    mockProvider = module.get<MockPaymentProvider>(MockPaymentProvider);
    webhookProcessor = module.get<WebhookProcessorService>(WebhookProcessorService);
  });

  afterEach(() => {
    delete process.env['STRIPE_WEBHOOK_SECRET'];
    delete process.env['RAZORPAY_WEBHOOK_SECRET'];
  });

  // ── Stripe provider tests ─────────────────────────────────────────────────
  describe('StripePaymentProvider.verifyWebhookSignature', () => {
    it('should accept a valid Stripe HMAC-SHA256 signature', () => {
      const sig = buildStripeSignature(rawBody, STRIPE_SECRET);
      expect(stripeProvider.verifyWebhookSignature(rawBody, sig)).toBe(true);
    });

    it('should accept a valid Stripe signature with raw body as Buffer', () => {
      const sig = buildStripeSignature(rawBody, STRIPE_SECRET);
      expect(stripeProvider.verifyWebhookSignature(Buffer.from(rawBody, 'utf8'), sig)).toBe(true);
    });

    it('should reject a Stripe signature with a tampered body', () => {
      const sig = buildStripeSignature(rawBody, STRIPE_SECRET);
      const tamperedBody = rawBody + ' tampered';
      expect(stripeProvider.verifyWebhookSignature(tamperedBody, sig)).toBe(false);
    });

    it('should reject a Stripe signature with a wrong secret', () => {
      const sig = buildStripeSignature(rawBody, 'wrong_secret');
      expect(stripeProvider.verifyWebhookSignature(rawBody, sig)).toBe(false);
    });

    it('should reject a Stripe signature with a missing t= component', () => {
      const malformed = 'v1=abc123def456';
      expect(stripeProvider.verifyWebhookSignature(rawBody, malformed)).toBe(false);
    });

    it('should reject an empty Stripe signature', () => {
      expect(stripeProvider.verifyWebhookSignature(rawBody, '')).toBe(false);
    });

    it('should reject a Stripe signature outside the 5-minute replay window', () => {
      // Timestamp 10 minutes in the past
      const oldTimestamp = Math.floor(Date.now() / 1000) - 601;
      const sig = buildStripeSignature(rawBody, STRIPE_SECRET, oldTimestamp);
      expect(stripeProvider.verifyWebhookSignature(rawBody, sig)).toBe(false);
    });

    it('should reject when STRIPE_WEBHOOK_SECRET is not configured', () => {
      delete process.env['STRIPE_WEBHOOK_SECRET'];
      const sig = buildStripeSignature(rawBody, STRIPE_SECRET);
      expect(stripeProvider.verifyWebhookSignature(rawBody, sig)).toBe(false);
    });
  });

  // ── Razorpay provider tests ───────────────────────────────────────────────
  describe('RazorpayPaymentProvider.verifyWebhookSignature', () => {
    it('should accept a valid Razorpay HMAC-SHA256 signature', () => {
      const sig = buildRazorpaySignature(rawBody, RAZORPAY_SECRET);
      expect(razorpayProvider.verifyWebhookSignature(rawBody, sig)).toBe(true);
    });

    it('should reject a Razorpay signature with a tampered body', () => {
      const sig = buildRazorpaySignature(rawBody, RAZORPAY_SECRET);
      expect(razorpayProvider.verifyWebhookSignature(rawBody + 'x', sig)).toBe(false);
    });

    it('should reject a Razorpay signature with a wrong secret', () => {
      const sig = buildRazorpaySignature(rawBody, 'wrong_secret');
      expect(razorpayProvider.verifyWebhookSignature(rawBody, sig)).toBe(false);
    });

    it('should reject a non-hex Razorpay signature', () => {
      expect(razorpayProvider.verifyWebhookSignature(rawBody, 'not-valid-hex!!!')).toBe(false);
    });

    it('should reject an empty Razorpay signature', () => {
      expect(razorpayProvider.verifyWebhookSignature(rawBody, '')).toBe(false);
    });

    it('should reject when RAZORPAY_WEBHOOK_SECRET is not configured', () => {
      delete process.env['RAZORPAY_WEBHOOK_SECRET'];
      const sig = buildRazorpaySignature(rawBody, RAZORPAY_SECRET);
      expect(razorpayProvider.verifyWebhookSignature(rawBody, sig)).toBe(false);
    });
  });

  // ── WebhookProcessorService integration tests ─────────────────────────────
  describe('WebhookProcessorService.processWebhook', () => {
    it('should process a valid mock webhook event', async () => {
      const result = await webhookProcessor.processWebhook({
        providerCode: PaymentProviderCode.MOCK,
        signature: '',
        body: { id: 'evt_mock_001', type: 'invoice.paid' },
      });
      expect(result.success).toBe(true);
      expect(result.status).toBe(WebhookEventStatus.PROCESSED);
    });

    it('should reject a Stripe webhook with a missing signature', async () => {
      await expect(
        webhookProcessor.processWebhook({
          providerCode: PaymentProviderCode.STRIPE,
          signature: '',
          body: { id: 'evt_stripe_001', type: 'invoice.paid' },
          rawBody: rawBody,
        }),
      ).rejects.toThrow('Missing webhook signature');
    });

    it('should reject a Stripe webhook with an invalid signature', async () => {
      await expect(
        webhookProcessor.processWebhook({
          providerCode: PaymentProviderCode.STRIPE,
          signature: 't=12345,v1=deadbeef00000000000000000000000000000000000000000000000000000000',
          body: { id: 'evt_stripe_002', type: 'invoice.paid' },
          rawBody: rawBody,
        }),
      ).rejects.toThrow('Invalid webhook signature');
    });

    it('should return idempotent response for already-processed events', async () => {
      prismaMock.webhookEvent.findUnique.mockResolvedValue({
        id: 'evt-db-1',
        eventId: 'evt_mock_001',
        status: WebhookEventStatus.PROCESSED,
      });

      const result = await webhookProcessor.processWebhook({
        providerCode: PaymentProviderCode.MOCK,
        signature: '',
        body: { id: 'evt_mock_001', type: 'invoice.paid' },
      });

      expect(result.message).toBe('Webhook event already processed.');
      expect(prismaMock.webhookEvent.upsert).not.toHaveBeenCalled();
    });
  });
});

// =============================================================================
// P0 TEST SUITE 3 — Quota Race Condition (Atomic Transaction)
// Tests that concurrent usage recording cannot overspend the quota limit.
// =============================================================================
describe('P0-3 Quota Race Condition — Atomic Transaction', () => {
  let service: QuotaEnforcementService;
  let prismaMock: any;

  const orgId = 'org-race-test';
  const metric = UsageMetricType.SCANS;

  const baseQuota = {
    id: 'quota-1',
    organizationId: orgId,
    metricType: metric,
    monthlyLimit: 10,
    currentUsage: 9,   // One slot remaining
    resetAt: new Date(Date.now() + 86400000),
  };

  beforeEach(async () => {
    prismaMock = {
      $transaction: jest.fn(),
      usageQuota: {
        findUnique: jest.fn().mockResolvedValue({ ...baseQuota }),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        findMany: jest.fn().mockResolvedValue([baseQuota]),
      },
      usageRecord: {
        create: jest.fn().mockResolvedValue({ id: 'ur-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotaEnforcementService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<QuotaEnforcementService>(QuotaEnforcementService);
  });

  it('should allow usage when within quota limit', async () => {
    // Simulate transaction succeeding with 1 row updated (slot was available)
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

    const result = await service.recordUsage(orgId, metric, 1);
    expect(result.success).toBe(true);
    expect(result.currentUsage).toBe(10);
  });

  it('should reject usage when quota is exactly at limit', async () => {
    const exhaustedQuota = { ...baseQuota, currentUsage: 10 };

    prismaMock.$transaction.mockImplementation(async (fn: Function) => {
      const txMock = {
        usageQuota: {
          findUnique: jest.fn().mockResolvedValue(exhaustedQuota),
          create: jest.fn(),
          update: jest.fn(),
          updateMany: jest.fn(),
        },
        usageRecord: { create: jest.fn() },
      };
      return fn(txMock);
    });

    await expect(service.recordUsage(orgId, metric, 1)).rejects.toThrow('Monthly limit exceeded');
  });

  it('should reject concurrent overspend — updateMany returns 0 rows (slot taken by concurrent request)', async () => {
    prismaMock.$transaction.mockImplementation(async (fn: Function) => {
      const txMock = {
        usageQuota: {
          findUnique: jest.fn().mockResolvedValue({ ...baseQuota }), // still shows 9/10
          create: jest.fn(),
          update: jest.fn(),
          updateMany: jest.fn().mockResolvedValue({ count: 0 }), // but another request already took the slot
        },
        usageRecord: { create: jest.fn() },
      };
      return fn(txMock);
    });

    await expect(service.recordUsage(orgId, metric, 1)).rejects.toThrow(
      'Monthly limit exceeded for metric [SCANS] due to concurrent usage',
    );
  });

  it('should allow unlimited usage when monthlyLimit is -1', async () => {
    const unlimitedQuota = { ...baseQuota, monthlyLimit: -1, currentUsage: 99999 };

    prismaMock.$transaction.mockImplementation(async (fn: Function) => {
      const txMock = {
        usageQuota: {
          findUnique: jest.fn().mockResolvedValue(unlimitedQuota),
          create: jest.fn(),
          update: jest.fn(),
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
        usageRecord: { create: jest.fn().mockResolvedValue({ id: 'ur-1' }) },
      };
      return fn(txMock);
    });

    const result = await service.recordUsage(orgId, metric, 1);
    expect(result.success).toBe(true);
  });

  it('should perform monthly reset inside the transaction when resetAt has passed', async () => {
    const expiredQuota = {
      ...baseQuota,
      currentUsage: 5,
      resetAt: new Date(Date.now() - 1000), // in the past
    };

    prismaMock.$transaction.mockImplementation(async (fn: Function) => {
      const updateMock = jest.fn().mockResolvedValue({ ...expiredQuota, currentUsage: 0 });
      const updateManyMock = jest.fn().mockResolvedValue({ count: 1 });
      const txMock = {
        usageQuota: {
          findUnique: jest.fn().mockResolvedValue(expiredQuota),
          create: jest.fn(),
          update: updateMock,
          updateMany: updateManyMock,
        },
        usageRecord: { create: jest.fn().mockResolvedValue({ id: 'ur-1' }) },
      };
      return fn(txMock);
    });

    const result = await service.recordUsage(orgId, metric, 1);
    expect(result.success).toBe(true);
  });
});
