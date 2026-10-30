import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PaymentProviderCode } from '@prisma/client';
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
export class MockPaymentProvider implements BasePaymentProvider {
  readonly providerCode = PaymentProviderCode.MOCK;
  private readonly logger = new Logger(MockPaymentProvider.name);

  private assertNotProduction(): void {
    if (process.env['NODE_ENV'] === 'production') {
      throw new BadRequestException('Mock payment provider is strictly disabled in production mode.');
    }
  }

  async createCustomer(input: CreateCustomerInput): Promise<CustomerOutput> {
    this.assertNotProduction();
    this.logger.log(`[MockPayment] Creating customer for org [${input.organizationId}]`);
    return {
      providerCustomerId: `cus_mock_${input.organizationId.substring(0, 8)}`,
      providerCode: this.providerCode,
    };
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSessionOutput> {
    this.assertNotProduction();
    this.logger.log(`[MockPayment] Creating checkout session for org [${input.organizationId}], mode: [${input.mode}]`);
    const id = `mock_session_${Date.now()}`;
    return {
      sessionId: id,
      providerCode: this.providerCode,
      url: `http://localhost:5173/billing?mock_checkout=${id}`,
      amount: input.amount ?? 10,
      currency: input.currency || 'USD',
    };
  }

  verifyPaymentSignature(input: VerifyPaymentInput): boolean {
    this.assertNotProduction();
    return true;
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionOutput> {
    this.assertNotProduction();
    this.logger.log(`[MockPayment] Creating subscription for customer [${input.providerCustomerId}] on plan [${input.planCode}]`);
    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + (input.interval === 'YEARLY' ? 12 : 1));

    return {
      providerSubscriptionId: `sub_mock_${Date.now()}`,
      status: 'ACTIVE',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    };
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<{ canceled: boolean }> {
    this.assertNotProduction();
    this.logger.log(`[MockPayment] Canceling subscription [${providerSubscriptionId}]`);
    return { canceled: true };
  }

  async changePlan(providerSubscriptionId: string, newPlanCode: string): Promise<SubscriptionOutput> {
    this.assertNotProduction();
    this.logger.log(`[MockPayment] Changing plan for sub [${providerSubscriptionId}] to [${newPlanCode}]`);
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
    this.assertNotProduction();
    return true;
  }
}
