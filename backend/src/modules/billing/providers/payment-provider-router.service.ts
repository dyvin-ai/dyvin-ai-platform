import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentProviderCode } from '@prisma/client';
import { BasePaymentProvider } from './base-payment-provider.interface';
import { MockPaymentProvider } from './mock-payment.provider';
import { RazorpayPaymentProvider } from './razorpay-payment.provider';
import { StripePaymentProvider } from './stripe-payment.provider';

@Injectable()
export class PaymentProviderRouter {
  private readonly providers = new Map<PaymentProviderCode, BasePaymentProvider>();

  constructor(
    stripeProvider: StripePaymentProvider,
    razorpayProvider: RazorpayPaymentProvider,
    mockProvider: MockPaymentProvider,
  ) {
    this.providers.set(PaymentProviderCode.STRIPE, stripeProvider);
    this.providers.set(PaymentProviderCode.RAZORPAY, razorpayProvider);
    this.providers.set(PaymentProviderCode.MOCK, mockProvider);
  }

  getProvider(code: PaymentProviderCode = PaymentProviderCode.MOCK): BasePaymentProvider {
    if (code === PaymentProviderCode.MOCK && process.env['NODE_ENV'] === 'production') {
      throw new BadRequestException('Mock payment provider is disabled in production.');
    }
    const provider = this.providers.get(code);
    if (!provider) {
      throw new NotFoundException(`Payment provider [${code}] not found or supported.`);
    }
    return provider;
  }
}
