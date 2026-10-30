import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PaymentProviderCode } from '@prisma/client';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import {
  BasePaymentProvider,
  CheckoutSessionOutput,
  CreateCheckoutSessionInput,
  CreateCustomerInput,
  CreateSubscriptionInput,
  CustomerOutput,
  SubscriptionOutput,
  VerifyPaymentInput,
} from './base-payment-provider.interface';

@Injectable()
export class RazorpayPaymentProvider implements BasePaymentProvider {
  readonly providerCode = PaymentProviderCode.RAZORPAY;
  private readonly logger = new Logger(RazorpayPaymentProvider.name);

  private getRazorpayClient(): Razorpay {
    const keyId = process.env['RAZORPAY_KEY_ID'];
    const keySecret = process.env['RAZORPAY_KEY_SECRET'];
    if (!keyId || !keySecret) {
      throw new ServiceUnavailableException('[Razorpay] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured.');
    }
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  async createCustomer(input: CreateCustomerInput): Promise<CustomerOutput> {
    const rzp = this.getRazorpayClient();
    try {
      const customer = await rzp.customers.create({
        name: input.name,
        email: input.email,
        notes: { organizationId: input.organizationId },
      });
      return {
        providerCustomerId: (customer as any).id,
        providerCode: this.providerCode,
      };
    } catch (err: any) {
      this.logger.error(`[Razorpay] Customer creation failed: ${err.message}`, err.stack);
      throw new BadRequestException(`[Razorpay] Failed to create customer: ${err.message || err.error?.description}`);
    }
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSessionOutput> {
    const rzp = this.getRazorpayClient();
    const keyId = process.env['RAZORPAY_KEY_ID'];

    if (input.mode === 'subscription') {
      if (!input.planCode) {
        throw new BadRequestException('[Razorpay] planCode is required for subscription checkout.');
      }

      const planKey = input.interval
        ? `RAZORPAY_PLAN_${input.planCode.toUpperCase()}_${input.interval.toUpperCase()}`
        : `RAZORPAY_PLAN_${input.planCode.toUpperCase()}`;
      const planId = process.env[planKey] || process.env[`RAZORPAY_PLAN_${input.planCode.toUpperCase()}`];

      if (!planId) {
        throw new BadRequestException(`[Razorpay] Plan ID for [${input.planCode}] (${planKey}) is not configured.`);
      }

      const totalCount = input.interval === 'YEARLY' ? 5 : 60;
      const sub = await (rzp.subscriptions.create as any)({
        plan_id: planId,
        total_count: totalCount,
        customer_notify: 1,
        notes: {
          organizationId: input.organizationId,
          userId: input.userId,
          planCode: input.planCode,
          purpose: 'subscription',
        },
      });

      return {
        sessionId: sub.id,
        orderId: sub.id,
        providerCode: this.providerCode,
        keyId,
        currency: 'INR',
        amount: input.amount,
      };
    } else {
      // One-off payment / Credit top-up
      const amount = input.amount ?? 10;
      const amountInPaise = Math.round(amount * 100);
      const currency = (input.currency || 'INR').toUpperCase();

      const order = await (rzp.orders.create as any)({
        amount: amountInPaise,
        currency,
        receipt: `rcpt_${input.organizationId.substring(0, 8)}_${Date.now()}`,
        notes: {
          organizationId: input.organizationId,
          userId: input.userId,
          purpose: 'top_up',
          credits: String(input.credits || 0),
        },
      });

      return {
        sessionId: order.id,
        orderId: order.id,
        providerCode: this.providerCode,
        keyId,
        currency: order.currency,
        amount,
      };
    }
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionOutput> {
    const rzp = this.getRazorpayClient();
    const planKey = input.interval
      ? `RAZORPAY_PLAN_${input.planCode.toUpperCase()}_${input.interval.toUpperCase()}`
      : `RAZORPAY_PLAN_${input.planCode.toUpperCase()}`;
    const planId = process.env[planKey] || process.env[`RAZORPAY_PLAN_${input.planCode.toUpperCase()}`];

    if (!planId) {
      throw new BadRequestException(`[Razorpay] Plan ID for [${input.planCode}] (${planKey}) is not configured.`);
    }

    const sub = await (rzp.subscriptions.create as any)({
      plan_id: planId,
      total_count: input.interval === 'YEARLY' ? 5 : 60,
      customer_notify: 1,
      notes: {
        planCode: input.planCode,
      },
    });

    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + (input.interval === 'YEARLY' ? 12 : 1));

    return {
      providerSubscriptionId: sub.id,
      status: sub.status ? sub.status.toUpperCase() : 'ACTIVE',
      currentPeriodStart: sub.current_start ? new Date(sub.current_start * 1000) : now,
      currentPeriodEnd: sub.current_end ? new Date(sub.current_end * 1000) : periodEnd,
    };
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<{ canceled: boolean }> {
    const rzp = this.getRazorpayClient();
    await (rzp.subscriptions.cancel as any)(providerSubscriptionId);
    return { canceled: true };
  }

  async changePlan(providerSubscriptionId: string, newPlanCode: string): Promise<SubscriptionOutput> {
    const rzp = this.getRazorpayClient();
    const planKey = `RAZORPAY_PLAN_${newPlanCode.toUpperCase()}`;
    const planId = process.env[planKey];
    if (!planId) {
      throw new BadRequestException(`[Razorpay] Plan ID for [${newPlanCode}] is not configured.`);
    }

    const updated = await (rzp.subscriptions.update as any)(providerSubscriptionId, {
      plan_id: planId,
    });

    return {
      providerSubscriptionId: updated.id || providerSubscriptionId,
      status: updated.status ? updated.status.toUpperCase() : 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }

  verifyPaymentSignature(input: VerifyPaymentInput): boolean {
    const secret = process.env['RAZORPAY_KEY_SECRET'];
    if (!secret) {
      this.logger.warn('[Razorpay] RAZORPAY_KEY_SECRET is not configured — rejecting signature verification.');
      return false;
    }

    if (!input.orderId || !input.paymentId || !input.signature) {
      return false;
    }

    const payload = `${input.orderId}|${input.paymentId}`;
    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedHmac, 'hex'),
        Buffer.from(input.signature, 'hex'),
      );
    } catch {
      return false;
    }
  }

  /**
   * Verifies a Razorpay webhook signature using HMAC-SHA256.
   *
   * Razorpay constructs the signature as:
   *   HMAC-SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET)
   * and delivers it in the X-Razorpay-Signature header as a hex digest.
   *
   * Returns false if:
   *   - RAZORPAY_WEBHOOK_SECRET is not configured
   *   - The signature header is missing
   *   - The HMAC does not match (constant-time comparison)
   */
  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    const secret = process.env['RAZORPAY_WEBHOOK_SECRET'];

    if (!secret) {
      this.logger.warn('[Razorpay] RAZORPAY_WEBHOOK_SECRET is not configured — rejecting webhook.');
      return false;
    }

    if (!signature) {
      return false;
    }

    const bodyString = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : rawBody;

    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(bodyString, 'utf8')
      .digest('hex');

    try {
      const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedHmac, 'hex'),
        Buffer.from(signature, 'hex'),
      );

      if (!isValid) {
        this.logger.warn('[Razorpay] Webhook signature verification failed — HMAC mismatch.');
      }

      return isValid;
    } catch {
      // Buffer.from can throw if the signature is not valid hex
      this.logger.warn('[Razorpay] Webhook signature is not valid hex — rejecting.');
      return false;
    }
  }
}
