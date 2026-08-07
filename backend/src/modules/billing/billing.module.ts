import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { MockPaymentProvider } from './providers/mock-payment.provider';
import { PaymentProviderRouter } from './providers/payment-provider-router.service';
import { RazorpayPaymentProvider } from './providers/razorpay-payment.provider';
import { StripePaymentProvider } from './providers/stripe-payment.provider';
import { BillingEngineService } from './services/billing-engine.service';
import { InvoiceService } from './services/invoice.service';
import { QuotaEnforcementService } from './services/quota-enforcement.service';
import { SubscriptionService } from './services/subscription.service';
import { WebhookProcessorService } from './services/webhook-processor.service';

@Module({
  controllers: [BillingController],
  providers: [
    StripePaymentProvider,
    RazorpayPaymentProvider,
    MockPaymentProvider,
    PaymentProviderRouter,
    SubscriptionService,
    QuotaEnforcementService,
    InvoiceService,
    WebhookProcessorService,
    BillingEngineService,
  ],
  exports: [
    BillingEngineService,
    QuotaEnforcementService,
    SubscriptionService,
    InvoiceService,
  ],
})
export class BillingModule {}
