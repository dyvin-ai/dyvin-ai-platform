import { Injectable, Logger } from '@nestjs/common';
import { PaymentProviderCode } from '@prisma/client';
import {
  BasePaymentProvider,
  CreateCustomerInput,
  CreateSubscriptionInput,
  CustomerOutput,
  SubscriptionOutput,
} from './base-payment-provider.interface';

@Injectable()
export class StripePaymentProvider implements BasePaymentProvider {
  readonly providerCode = PaymentProviderCode.STRIPE;
  private readonly logger = new Logger(StripePaymentProvider.name);

  async createCustomer(input: CreateCustomerInput): Promise<CustomerOutput> {
    this.logger.log(`[Stripe] Creating customer for org [${input.organizationId}] (${input.email})`);
    return {
      providerCustomerId: `cus_stripe_${input.organizationId.substring(0, 8)}`,
      providerCode: this.providerCode,
    };
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionOutput> {
    this.logger.log(`[Stripe] Creating subscription for customer [${input.providerCustomerId}] on plan [${input.planCode}]`);
    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + (input.interval === 'YEARLY' ? 12 : 1));

    return {
      providerSubscriptionId: `sub_stripe_${Date.now()}`,
      status: 'ACTIVE',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    };
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<{ canceled: boolean }> {
    this.logger.log(`[Stripe] Canceling subscription [${providerSubscriptionId}]`);
    return { canceled: true };
  }

  async changePlan(providerSubscriptionId: string, newPlanCode: string): Promise<SubscriptionOutput> {
    this.logger.log(`[Stripe] Changing plan for sub [${providerSubscriptionId}] to [${newPlanCode}]`);
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

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    if (!signature) return false;
    return signature.startsWith('t=') || signature.length > 5;
  }
}
