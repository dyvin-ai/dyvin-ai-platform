import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BillingInterval, PaymentProviderCode, PlanTier, UsageMetricType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PaymentProviderRouter } from '../providers/payment-provider-router.service';
import { InvoiceService } from './invoice.service';
import { QuotaEnforcementService } from './quota-enforcement.service';
import { SubscriptionService } from './subscription.service';
import { WebhookProcessorService } from './webhook-processor.service';

export interface CreateCheckoutInput {
  mode: 'subscription' | 'payment';
  planCode?: PlanTier;
  interval?: BillingInterval;
  topUpCredits?: number;
  providerCode?: PaymentProviderCode;
  successUrl?: string;
  cancelUrl?: string;
}

export interface VerifyPaymentInput {
  providerCode: PaymentProviderCode;
  orderId: string;
  paymentId: string;
  signature: string;
}

@Injectable()
export class BillingEngineService {
  private readonly logger = new Logger(BillingEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerRouter: PaymentProviderRouter,
    private readonly subscriptionService: SubscriptionService,
    private readonly quotaEnforcement: QuotaEnforcementService,
    private readonly invoiceService: InvoiceService,
    private readonly webhookProcessor: WebhookProcessorService,
  ) {}

  getPlans() {
    return this.subscriptionService.getPlans();
  }

  getSubscription(organizationId: string) {
    return this.subscriptionService.getSubscription(organizationId);
  }

  subscribe(organizationId: string, planCode: PlanTier, userId?: string) {
    return this.subscriptionService.subscribe({ organizationId, planCode }, userId);
  }

  cancel(organizationId: string, userId?: string) {
    return this.subscriptionService.cancel(organizationId, userId);
  }

  resume(organizationId: string, userId?: string) {
    return this.subscriptionService.resume(organizationId, userId);
  }

  changePlan(organizationId: string, newPlanCode: PlanTier, userId?: string) {
    return this.subscriptionService.changePlan(organizationId, newPlanCode, userId);
  }

  async createCheckout(organizationId: string, userId: string, input: CreateCheckoutInput) {
    if (!input.mode || !['subscription', 'payment'].includes(input.mode)) {
      throw new BadRequestException('Invalid checkout mode. Must be "subscription" or "payment".');
    }

    const providerCode = input.providerCode || PaymentProviderCode.STRIPE;
    const provider = this.providerRouter.getProvider(providerCode);

    if (!provider.createCheckoutSession) {
      throw new BadRequestException(`Provider [${providerCode}] does not support checkout session creation.`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (input.mode === 'subscription') {
      if (!input.planCode) {
        throw new BadRequestException('planCode is required for subscription checkout.');
      }
      if (input.planCode === PlanTier.FREE) {
        throw new BadRequestException('Free tier does not require checkout. It is auto-provisioned.');
      }

      const plan = await this.prisma.subscriptionPlan.findUnique({
        where: { code: input.planCode },
      });

      if (!plan || !plan.isActive) {
        throw new NotFoundException(`Subscription plan [${input.planCode}] not found or inactive.`);
      }

      const interval = input.interval || BillingInterval.MONTHLY;
      const amount = interval === BillingInterval.YEARLY ? plan.priceYearly : plan.priceMonthly;

      return provider.createCheckoutSession({
        organizationId,
        userId,
        customerEmail: user?.email,
        mode: 'subscription',
        planCode: input.planCode,
        interval,
        amount,
        currency: plan.currency || 'USD',
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
        idempotencyKey: `chk_${organizationId}_${input.planCode}_${Date.now()}`,
      });
    } else {
      // One-off Credit Top-Up
      const credits = input.topUpCredits;
      if (!credits || typeof credits !== 'number' || credits < 10 || credits > 100000) {
        throw new BadRequestException('topUpCredits must be a positive number between 10 and 100,000.');
      }

      // Tiered credit volume rate calculated strictly server-side
      const unitRate = credits >= 5000 ? 0.06 : credits >= 1000 ? 0.075 : credits >= 500 ? 0.08 : 0.1;
      const validatedAmount = Math.round(credits * unitRate * 100) / 100;

      return provider.createCheckoutSession({
        organizationId,
        userId,
        customerEmail: user?.email,
        mode: 'payment',
        credits,
        amount: validatedAmount,
        currency: 'USD',
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
        idempotencyKey: `topup_${organizationId}_${credits}_${Date.now()}`,
      });
    }
  }

  async verifyPayment(organizationId: string, userId: string, input: VerifyPaymentInput) {
    const provider = this.providerRouter.getProvider(input.providerCode);

    if (provider.verifyPaymentSignature) {
      const isValid = provider.verifyPaymentSignature({
        orderId: input.orderId,
        paymentId: input.paymentId,
        signature: input.signature,
      });

      if (!isValid) {
        throw new BadRequestException('Payment verification failed. Invalid provider signature.');
      }
    }

    this.logger.log(`Payment [${input.paymentId}] verified for org [${organizationId}] by user [${userId}]`);
    return {
      verified: true,
      providerCode: input.providerCode,
      orderId: input.orderId,
      paymentId: input.paymentId,
    };
  }

  getUsage(organizationId: string) {
    return this.quotaEnforcement.getOrganizationUsage(organizationId);
  }

  recordUsage(organizationId: string, metricType: UsageMetricType, quantity: number = 1) {
    return this.quotaEnforcement.recordUsage(organizationId, metricType, quantity);
  }

  getInvoices(organizationId: string) {
    return this.invoiceService.getInvoices(organizationId);
  }

  getPayments(organizationId: string) {
    return this.invoiceService.getPayments(organizationId);
  }
}
