import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PaymentProviderCode } from '@prisma/client';
import Stripe from 'stripe';
import * as crypto from 'crypto';
import {
  BasePaymentProvider,
  CheckoutSessionOutput,
  CreateCheckoutSessionInput,
  CreateCustomerInput,
  CreateSubscriptionInput,
  CustomerOutput,
  SubscriptionOutput,
} from './base-payment-provider.interface';

// Stripe webhook signature tolerance window (5 minutes) — matches Stripe's own default.
const STRIPE_TIMESTAMP_TOLERANCE_SECONDS = 300;

@Injectable()
export class StripePaymentProvider implements BasePaymentProvider {
  readonly providerCode = PaymentProviderCode.STRIPE;
  private readonly logger = new Logger(StripePaymentProvider.name);

  private getStripeClient(): Stripe {
    const key = process.env['STRIPE_SECRET_KEY'];
    if (!key) throw new ServiceUnavailableException('[Stripe] STRIPE_SECRET_KEY is not configured.');
    return new Stripe(key, { apiVersion: '2026-09-30.endive' });
  }

  async createCustomer(input: CreateCustomerInput): Promise<CustomerOutput> {
    const stripe = this.getStripeClient();
    const customer = await stripe.customers.create({
      email: input.email,
      name: input.name,
      metadata: { organizationId: input.organizationId },
    });
    return { providerCustomerId: customer.id, providerCode: this.providerCode };
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionOutput> {
    const stripe = this.getStripeClient();
    const sub = await stripe.subscriptions.create({
      customer: input.providerCustomerId,
      items: [{ price: this.getPriceId(input.planCode) }],
    } as any, { idempotencyKey: `sub-${input.providerCustomerId}-${input.planCode}` });
    return {
      providerSubscriptionId: sub.id,
      status: sub.status,
      currentPeriodStart: new Date((sub as any).current_period_start * 1000),
      currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
    };
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<{ canceled: boolean }> {
    const stripe = this.getStripeClient();
    await stripe.subscriptions.cancel(providerSubscriptionId);
    return { canceled: true };
  }

  async changePlan(providerSubscriptionId: string, newPlanCode: string): Promise<SubscriptionOutput> {
    const stripe = this.getStripeClient();
    const sub = await stripe.subscriptions.retrieve(providerSubscriptionId);
    const item = (sub as any).items?.data?.[0];
    const updated = await stripe.subscriptions.update(providerSubscriptionId, {
      items: [{ id: item?.id, price: this.getPriceId(newPlanCode) }],
    });
    return {
      providerSubscriptionId: updated.id,
      status: updated.status,
      currentPeriodStart: new Date((updated as any).current_period_start * 1000),
      currentPeriodEnd: new Date((updated as any).current_period_end * 1000),
    };
  }

  async createPaymentIntent(input: { amount: number; currency: string; organizationId: string; description?: string }): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const stripe = this.getStripeClient();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(input.amount * 100), // convert to cents
      currency: input.currency.toLowerCase(),
      metadata: { organizationId: input.organizationId, purpose: 'top_up' },
      description: input.description || 'Credit top-up',
    });
    return { clientSecret: intent.client_secret!, paymentIntentId: intent.id };
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSessionOutput> {
    const stripe = this.getStripeClient();
    const frontendBaseUrl = process.env['FRONTEND_URL'] || 'http://localhost:5173';
    const successUrl = input.successUrl || `${frontendBaseUrl}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = input.cancelUrl || `${frontendBaseUrl}/billing?canceled=true`;

    if (input.mode === 'subscription') {
      if (!input.planCode) {
        throw new BadRequestException('[Stripe] planCode is required for subscription checkout.');
      }

      const priceId = this.getPriceId(input.planCode, input.interval);
      const session = await stripe.checkout.sessions.create(
        {
          mode: 'subscription',
          customer_email: input.customerEmail,
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            organizationId: input.organizationId,
            userId: input.userId,
            planCode: input.planCode,
            interval: input.interval || 'MONTHLY',
            purpose: 'subscription',
          },
          subscription_data: {
            metadata: {
              organizationId: input.organizationId,
              userId: input.userId,
              planCode: input.planCode,
            },
          },
        },
        input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
      );

      return {
        sessionId: session.id,
        providerCode: this.providerCode,
        url: session.url,
        currency: (session.currency || 'USD').toUpperCase(),
        amount: session.amount_total ? session.amount_total / 100 : input.amount,
      };
    } else {
      // One-off payment / Credit top-up
      const amount = input.amount ?? 10;
      const amountInCents = Math.round(amount * 100);
      const currency = (input.currency || 'usd').toLowerCase();

      const session = await stripe.checkout.sessions.create(
        {
          mode: 'payment',
          customer_email: input.customerEmail,
          line_items: [
            {
              price_data: {
                currency,
                product_data: {
                  name: `Dyvin AI Credit Top-Up (${input.credits || 100} credits)`,
                  description: 'Additional scan and AI request allowance for your organization',
                },
                unit_amount: amountInCents,
              },
              quantity: 1,
            },
          ],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            organizationId: input.organizationId,
            userId: input.userId,
            purpose: 'top_up',
            credits: String(input.credits || 0),
          },
        },
        input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
      );

      return {
        sessionId: session.id,
        providerCode: this.providerCode,
        url: session.url,
        currency: currency.toUpperCase(),
        amount,
      };
    }
  }

  async verifySession(sessionId: string): Promise<{
    valid: boolean;
    sessionId: string;
    paymentStatus: string;
    status: string;
    organizationId?: string;
    amount?: number;
    currency?: string;
  }> {
    const stripe = this.getStripeClient();
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const organizationId = session.metadata?.['organizationId'];
      const paymentStatus = session.payment_status;
      const isPaid = paymentStatus === 'paid' || session.status === 'complete';

      return {
        valid: isPaid,
        sessionId: session.id,
        paymentStatus,
        status: session.status || 'unknown',
        organizationId,
        amount: session.amount_total ? session.amount_total / 100 : undefined,
        currency: session.currency ? session.currency.toUpperCase() : 'USD',
      };
    } catch (err: any) {
      this.logger.error(`[Stripe] Failed to retrieve checkout session [${sessionId}]: ${err.message}`, err.stack);
      return {
        valid: false,
        sessionId,
        paymentStatus: 'failed',
        status: 'error',
      };
    }
  }

  private getPriceId(planCode: string, interval?: 'MONTHLY' | 'YEARLY'): string {
    const intervalSuffix = interval ? `_${interval.toUpperCase()}` : '';
    const specificKey = `STRIPE_PRICE_${planCode.toUpperCase()}${intervalSuffix}`;
    const genericKey = `STRIPE_PRICE_${planCode.toUpperCase()}`;
    const priceId = process.env[specificKey] || process.env[genericKey];
    if (!priceId) {
      this.logger.warn(`[Stripe] Neither ${specificKey} nor ${genericKey} is configured. Using plan code as price ID fallback.`);
      return planCode; // Will fail at Stripe API — logged clearly
    }
    return priceId;
  }

  /**
   * Verifies a Stripe webhook signature using the standard HMAC-SHA256 algorithm.
   *
   * Stripe constructs signatures as:
   *   stripe-signature: t=<unix_timestamp>,v1=<hmac_hex>
   *
   * The signed payload is: `${timestamp}.${rawBody}`
   * The expected HMAC is computed with the webhook endpoint secret (STRIPE_WEBHOOK_SECRET).
   *
   * Returns false (reject) if:
   *   - STRIPE_WEBHOOK_SECRET is not configured
   *   - The signature header is missing or malformed
   *   - The HMAC does not match (constant-time comparison)
   *   - The timestamp is outside the tolerance window (prevents replay attacks)
   */
  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    const secret = process.env['STRIPE_WEBHOOK_SECRET'];

    if (!secret) {
      this.logger.warn('[Stripe] STRIPE_WEBHOOK_SECRET is not configured — rejecting webhook.');
      return false;
    }

    if (!signature) {
      return false;
    }

    // Parse the Stripe signature header: "t=<timestamp>,v1=<hmac>,v1=<hmac>..."
    const parts: Record<string, string[]> = {};
    for (const part of signature.split(',')) {
      const idx = part.indexOf('=');
      if (idx === -1) continue;
      const key = part.substring(0, idx);
      const value = part.substring(idx + 1);
      if (!parts[key]) parts[key] = [];
      parts[key].push(value);
    }

    const timestampStr = parts['t']?.[0];
    const v1Signatures = parts['v1'] ?? [];

    if (!timestampStr || v1Signatures.length === 0) {
      this.logger.warn('[Stripe] Malformed stripe-signature header — missing timestamp or v1 component.');
      return false;
    }

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) {
      return false;
    }

    // Replay-attack protection: reject events older than the tolerance window
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSeconds - timestamp) > STRIPE_TIMESTAMP_TOLERANCE_SECONDS) {
      this.logger.warn(`[Stripe] Webhook timestamp [${timestamp}] is outside the ${STRIPE_TIMESTAMP_TOLERANCE_SECONDS}s tolerance window — possible replay attack.`);
      return false;
    }

    // Construct the signed payload exactly as Stripe does
    const bodyString = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : rawBody;
    const signedPayload = `${timestampStr}.${bodyString}`;

    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    // Validate against all v1 signatures provided (Stripe can send multiple during key rotation)
    const isValid = v1Signatures.some((sig) => {
      try {
        // Constant-time comparison to prevent timing attacks
        return crypto.timingSafeEqual(
          Buffer.from(expectedHmac, 'hex'),
          Buffer.from(sig, 'hex'),
        );
      } catch {
        return false;
      }
    });

    if (!isValid) {
      this.logger.warn('[Stripe] Webhook signature verification failed — HMAC mismatch.');
    }

    return isValid;
  }
}
