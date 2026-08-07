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

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    if (!signature) return false;
    return signature.length > 5;
  }
}
