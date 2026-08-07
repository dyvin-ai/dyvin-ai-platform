import { PaymentProviderCode } from '@prisma/client';

export interface CreateCustomerInput {
  organizationId: string;
  email: string;
  name: string;
}

export interface CustomerOutput {
  providerCustomerId: string;
  providerCode: PaymentProviderCode;
}

export interface CreateSubscriptionInput {
  providerCustomerId: string;
  planCode: string;
  interval: 'MONTHLY' | 'YEARLY';
  paymentMethodToken?: string;
}

export interface SubscriptionOutput {
  providerSubscriptionId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface BasePaymentProvider {
  readonly providerCode: PaymentProviderCode;

  createCustomer(input: CreateCustomerInput): Promise<CustomerOutput>;
  createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionOutput>;
  cancelSubscription(providerSubscriptionId: string): Promise<{ canceled: boolean }>;
  changePlan(providerSubscriptionId: string, newPlanCode: string): Promise<SubscriptionOutput>;
  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean;
}
