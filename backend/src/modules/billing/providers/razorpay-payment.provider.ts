import { Injectable, Logger } from '@nestjs/common';
import { PaymentProviderCode } from '@prisma/client';
import * as crypto from 'crypto';
import {
  BasePaymentProvider,
  CreateCustomerInput,
  CreateSubscriptionInput,
  CustomerOutput,
  SubscriptionOutput,
} from './base-payment-provider.interface';

@Injectable()
export class RazorpayPaymentProvider implements BasePaymentProvider {
  readonly providerCode = PaymentProviderCode.RAZORPAY;
  private readonly logger = new Logger(RazorpayPaymentProvider.name);

  async createCustomer(input: CreateCustomerInput): Promise<CustomerOutput> {
    this.logger.log(`[Razorpay] Creating customer for org [${input.organizationId}] (${input.email})`);
    return {
      providerCustomerId: `cust_rzp_${input.organizationId.substring(0, 8)}`,
      providerCode: this.providerCode,
    };
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionOutput> {
    this.logger.log(`[Razorpay] Creating subscription for customer [${input.providerCustomerId}] on plan [${input.planCode}]`);
    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + (input.interval === 'YEARLY' ? 12 : 1));

    return {
      providerSubscriptionId: `sub_rzp_${Date.now()}`,
      status: 'ACTIVE',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    };
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<{ canceled: boolean }> {
    this.logger.log(`[Razorpay] Canceling subscription [${providerSubscriptionId}]`);
    return { canceled: true };
  }

  async changePlan(providerSubscriptionId: string, newPlanCode: string): Promise<SubscriptionOutput> {
    this.logger.log(`[Razorpay] Changing plan for sub [${providerSubscriptionId}] to [${newPlanCode}]`);
    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    return {
      providerSubscriptionId,
      status: 'ACTIVE',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    };
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
