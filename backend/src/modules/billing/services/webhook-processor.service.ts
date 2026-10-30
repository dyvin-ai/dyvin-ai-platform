import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  BillingInterval,
  PaymentProviderCode,
  PaymentStatus,
  PlanTier,
  SubscriptionStatus,
  UsageMetricType,
  WebhookEventStatus,
} from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PaymentProviderRouter } from '../providers/payment-provider-router.service';
import { QuotaEnforcementService } from './quota-enforcement.service';
import { SubscriptionService } from './subscription.service';

export interface ProcessWebhookInput {
  providerCode: PaymentProviderCode;
  signature: string;
  body: any;
  rawBody?: string | Buffer;
}

@Injectable()
export class WebhookProcessorService {
  private readonly logger = new Logger(WebhookProcessorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerRouter: PaymentProviderRouter,
    private readonly subscriptionService: SubscriptionService,
    private readonly quotaEnforcement: QuotaEnforcementService,
  ) {}

  async processWebhook(input: ProcessWebhookInput) {
    if (input.providerCode === PaymentProviderCode.MOCK && process.env.NODE_ENV === 'production') {
      throw new BadRequestException('MOCK payment provider is not allowed in production.');
    }

    const provider = this.providerRouter.getProvider(input.providerCode);

    // For non-Mock providers, a missing signature must be rejected before any processing.
    if (input.providerCode !== PaymentProviderCode.MOCK && !input.signature) {
      throw new BadRequestException(`Missing webhook signature for provider [${input.providerCode}].`);
    }

    // Perform cryptographic signature verification.
    // The raw body (exact bytes as received) is used so signature computation matches the provider's expected value.
    // For Mock provider, verifyWebhookSignature always returns true (development/test only).
    const rawBodyForVerification = input.rawBody ?? JSON.stringify(input.body);
    const isValid = provider.verifyWebhookSignature(rawBodyForVerification, input.signature);

    if (!isValid && input.providerCode !== PaymentProviderCode.MOCK) {
      throw new BadRequestException(`Invalid webhook signature for provider [${input.providerCode}].`);
    }

    const eventId = input.body.id || `evt_${Date.now()}`;
    const eventType = input.body.type || input.body.event || 'payment.succeeded';

    // Idempotency check — skip already-processed events to prevent duplicate side-effects
    const existing = await this.prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existing && existing.status === WebhookEventStatus.PROCESSED) {
      return { message: 'Webhook event already processed.', eventId };
    }

    // Record the webhook event as PENDING before executing side effects
    await this.prisma.webhookEvent.upsert({
      where: { eventId },
      update: { status: WebhookEventStatus.PENDING },
      create: {
        providerCode: input.providerCode,
        eventId,
        eventType,
        payload: input.body,
        status: WebhookEventStatus.PENDING,
      },
    });

    try {
      if (input.providerCode === PaymentProviderCode.STRIPE) {
        await this.handleStripeEvent(eventType, input.body);
      } else if (input.providerCode === PaymentProviderCode.RAZORPAY) {
        await this.handleRazorpayEvent(eventType, input.body);
      } else if (input.providerCode === PaymentProviderCode.MOCK) {
        await this.handleMockEvent(eventType, input.body);
      } else {
        throw new BadRequestException(`Unsupported provider code: [${input.providerCode}]`);
      }

      await this.prisma.webhookEvent.update({
        where: { eventId },
        data: {
          status: WebhookEventStatus.PROCESSED,
          processedAt: new Date(),
        },
      });

      this.logger.log(`Processed webhook event [${eventType}] from [${input.providerCode}]`);
      return { success: true, eventId, eventType, status: WebhookEventStatus.PROCESSED };
    } catch (err: any) {
      this.logger.error(`Error processing webhook event [${eventType}] [${eventId}]: ${err.message}`, err.stack);
      await this.prisma.webhookEvent.update({
        where: { eventId },
        data: {
          status: WebhookEventStatus.FAILED,
          errorMessage: err.message,
        },
      });
      throw err;
    }
  }

  private async handleMockEvent(eventType: string, body: any): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException('MOCK payment provider is not allowed in production.');
    }

    const organizationId = body.organizationId || body.metadata?.organizationId;
    if (!organizationId) {
      // In non-production testing/development, generic mock events without organization are accepted
      return;
    }

    if (eventType === 'checkout.session.completed' || eventType === 'payment.succeeded') {
      if (body.planCode) {
        await this.activateSubscriptionFromProvider({
          organizationId,
          planCode: body.planCode as PlanTier,
          interval: (body.interval as BillingInterval) || BillingInterval.MONTHLY,
          externalSubId: body.subscriptionId || `mock_sub_${Date.now()}`,
          amount: body.amount ?? 0,
          currency: body.currency || 'USD',
          paymentIntentId: body.paymentIntentId || `mock_pi_${Date.now()}`,
          providerCode: PaymentProviderCode.MOCK,
        });
      } else if (body.credits) {
        const credits = parseInt(body.credits, 10);
        const txId = body.id || `mock_tx_${Date.now()}`;
        await this.quotaEnforcement.grantCredits({
          organizationId,
          credits,
          providerTxId: txId,
          description: `Mock credit top-up: ${txId}`,
        });
        await this.recordTopUpPayment({
          organizationId,
          amount: body.amount ?? 0,
          currency: body.currency || 'USD',
          externalTxId: txId,
          providerCode: PaymentProviderCode.MOCK,
        });
      }
    } else {
      throw new BadRequestException(`Unhandled Mock webhook event type: ${eventType}`);
    }
  }

  private async handleStripeEvent(eventType: string, body: any): Promise<void> {
    const dataObj = body.data?.object || body;

    switch (eventType) {
      case 'checkout.session.completed': {
        const metadata = dataObj.metadata || {};
        const organizationId = metadata.organizationId;
        const purpose = metadata.purpose;
        const mode = dataObj.mode;

        if (!organizationId) {
          throw new BadRequestException('Missing organizationId in Stripe checkout session metadata.');
        }

        if (mode === 'subscription' || purpose === 'subscription') {
          const planCode = metadata.planCode as PlanTier;
          if (!planCode) {
            throw new BadRequestException('Missing planCode in Stripe subscription checkout session metadata.');
          }
          await this.activateSubscriptionFromProvider({
            organizationId,
            planCode,
            interval: (metadata.interval as BillingInterval) || BillingInterval.MONTHLY,
            externalSubId: dataObj.subscription,
            amount: dataObj.amount_total ? dataObj.amount_total / 100 : undefined,
            currency: dataObj.currency ? dataObj.currency.toUpperCase() : 'USD',
            paymentIntentId: dataObj.payment_intent || dataObj.id,
            providerCode: PaymentProviderCode.STRIPE,
          });
        } else if (mode === 'payment' || purpose === 'top_up') {
          const credits = parseInt(metadata.credits || '0', 10);
          if (credits <= 0) {
            throw new BadRequestException('Invalid credits amount in Stripe top-up checkout session metadata.');
          }
          const providerTxId = dataObj.payment_intent || dataObj.id;
          await this.quotaEnforcement.grantCredits({
            organizationId,
            credits,
            providerTxId,
            description: `Stripe credit top-up: ${providerTxId}`,
          });
          await this.recordTopUpPayment({
            organizationId,
            amount: dataObj.amount_total ? dataObj.amount_total / 100 : 0,
            currency: (dataObj.currency || 'USD').toUpperCase(),
            externalTxId: providerTxId,
            providerCode: PaymentProviderCode.STRIPE,
          });
        } else {
          throw new BadRequestException(
            `Unhandled Stripe checkout session mode/purpose: mode=${mode}, purpose=${purpose}`,
          );
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subId = dataObj.id;
        if (!subId) {
          throw new BadRequestException('Missing subscription id in Stripe customer.subscription event.');
        }
        const status = dataObj.status;
        const mappedStatus = this.mapStripeSubscriptionStatus(status);

        const sub = await this.prisma.organizationSubscription.findFirst({
          where: { externalSubId: subId },
        });

        if (!sub) {
          throw new NotFoundException(`Subscription not found for externalSubId: ${subId}`);
        }

        await this.prisma.organizationSubscription.update({
          where: { id: sub.id },
          data: {
            status: mappedStatus,
            currentPeriodStart: dataObj.current_period_start
              ? new Date(dataObj.current_period_start * 1000)
              : undefined,
            currentPeriodEnd: dataObj.current_period_end
              ? new Date(dataObj.current_period_end * 1000)
              : undefined,
            cancelAtPeriodEnd: dataObj.cancel_at_period_end ?? false,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subId = dataObj.id;
        if (!subId) {
          throw new BadRequestException('Missing subscription id in Stripe customer.subscription.deleted event.');
        }
        const sub = await this.prisma.organizationSubscription.findFirst({
          where: { externalSubId: subId },
        });

        if (!sub) {
          throw new NotFoundException(`Subscription not found for externalSubId: ${subId}`);
        }

        await this.prisma.organizationSubscription.update({
          where: { id: sub.id },
          data: {
            status: SubscriptionStatus.CANCELED,
            canceledAt: new Date(),
          },
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const subId = dataObj.subscription;
        if (!subId) {
          throw new BadRequestException('Missing subscription ID on invoice.payment_succeeded event.');
        }
        const sub = await this.prisma.organizationSubscription.findFirst({
          where: { externalSubId: subId },
        });

        if (!sub) {
          throw new NotFoundException(`Subscription not found for invoice subscription ID: ${subId}`);
        }

        await this.prisma.organizationSubscription.update({
          where: { id: sub.id },
          data: { status: SubscriptionStatus.ACTIVE },
        });

        const externalTxId = dataObj.payment_intent || dataObj.id;
        const existingPayment = externalTxId
          ? await this.prisma.payment.findFirst({
              where: { externalTxId, providerCode: PaymentProviderCode.STRIPE },
            })
          : null;

        if (!existingPayment) {
          await this.prisma.payment.create({
            data: {
              subscriptionId: sub.id,
              amount: dataObj.amount_paid ? dataObj.amount_paid / 100 : 0,
              currency: (dataObj.currency || 'USD').toUpperCase(),
              status: PaymentStatus.SUCCEEDED,
              providerCode: PaymentProviderCode.STRIPE,
              externalTxId,
              paidAt: new Date(),
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const subId = dataObj.subscription;
        if (!subId) {
          throw new BadRequestException('Missing subscription ID on invoice.payment_failed event.');
        }
        const sub = await this.prisma.organizationSubscription.findFirst({
          where: { externalSubId: subId },
        });

        if (!sub) {
          throw new NotFoundException(`Subscription not found for invoice subscription ID: ${subId}`);
        }

        await this.prisma.organizationSubscription.update({
          where: { id: sub.id },
          data: { status: SubscriptionStatus.PAST_DUE },
        });

        const externalTxId = dataObj.payment_intent || dataObj.id;
        const existingPayment = externalTxId
          ? await this.prisma.payment.findFirst({
              where: { externalTxId, providerCode: PaymentProviderCode.STRIPE },
            })
          : null;

        if (!existingPayment) {
          await this.prisma.payment.create({
            data: {
              subscriptionId: sub.id,
              amount: dataObj.amount_due ? dataObj.amount_due / 100 : 0,
              currency: (dataObj.currency || 'USD').toUpperCase(),
              status: PaymentStatus.FAILED,
              failureReason: dataObj.last_payment_error?.message || 'Invoice payment failed',
              providerCode: PaymentProviderCode.STRIPE,
              externalTxId,
            },
          });
        }
        break;
      }

      default:
        throw new BadRequestException(`Unhandled Stripe webhook event type: ${eventType}`);
    }
  }

  private async handleRazorpayEvent(eventType: string, body: any): Promise<void> {
    const paymentEntity = body.payload?.payment?.entity;
    const orderEntity = body.payload?.order?.entity;
    const subEntity = body.payload?.subscription?.entity;
    const notes = paymentEntity?.notes || orderEntity?.notes || subEntity?.notes || {};
    const organizationId = notes.organizationId;

    if (!organizationId) {
      throw new BadRequestException(`Missing organizationId in Razorpay webhook notes for event [${eventType}].`);
    }

    switch (eventType) {
      case 'order.paid': {
        const purpose = notes.purpose;
        if (purpose === 'top_up') {
          const credits = parseInt(notes.credits || '0', 10);
          if (credits <= 0) {
            throw new BadRequestException('Invalid credits in Razorpay order notes.');
          }
          const providerTxId = paymentEntity?.id || orderEntity?.id;
          await this.quotaEnforcement.grantCredits({
            organizationId,
            credits,
            providerTxId,
            description: `Razorpay credit top-up: ${providerTxId}`,
          });
          await this.recordTopUpPayment({
            organizationId,
            amount: paymentEntity?.amount
              ? Number(paymentEntity.amount) / 100
              : orderEntity?.amount
              ? Number(orderEntity.amount) / 100
              : 0,
            currency: (paymentEntity?.currency || orderEntity?.currency || 'INR').toUpperCase(),
            externalTxId: providerTxId,
            providerCode: PaymentProviderCode.RAZORPAY,
          });
        } else if (purpose === 'subscription' && notes.planCode) {
          await this.activateSubscriptionFromProvider({
            organizationId,
            planCode: notes.planCode as PlanTier,
            interval: (notes.interval as BillingInterval) || BillingInterval.MONTHLY,
            externalSubId: subEntity?.id || orderEntity?.id,
            amount: paymentEntity?.amount
              ? Number(paymentEntity.amount) / 100
              : orderEntity?.amount
              ? Number(orderEntity.amount) / 100
              : undefined,
            currency: (paymentEntity?.currency || orderEntity?.currency || 'INR').toUpperCase(),
            paymentIntentId: paymentEntity?.id,
            providerCode: PaymentProviderCode.RAZORPAY,
          });
        } else {
          throw new BadRequestException(`Unhandled Razorpay order.paid purpose: ${purpose}`);
        }
        break;
      }

      case 'payment.captured': {
        const purpose = notes.purpose;
        if (purpose === 'top_up') {
          const credits = parseInt(notes.credits || '0', 10);
          if (credits <= 0) {
            throw new BadRequestException('Invalid credits in Razorpay payment notes.');
          }
          const providerTxId = paymentEntity?.id || orderEntity?.id;
          await this.quotaEnforcement.grantCredits({
            organizationId,
            credits,
            providerTxId,
            description: `Razorpay credit top-up: ${providerTxId}`,
          });
          await this.recordTopUpPayment({
            organizationId,
            amount: paymentEntity?.amount ? Number(paymentEntity.amount) / 100 : 0,
            currency: (paymentEntity?.currency || 'INR').toUpperCase(),
            externalTxId: providerTxId,
            providerCode: PaymentProviderCode.RAZORPAY,
          });
        } else if (purpose === 'subscription' && notes.planCode) {
          await this.activateSubscriptionFromProvider({
            organizationId,
            planCode: notes.planCode as PlanTier,
            interval: (notes.interval as BillingInterval) || BillingInterval.MONTHLY,
            externalSubId: subEntity?.id || paymentEntity?.id,
            amount: paymentEntity?.amount ? Number(paymentEntity.amount) / 100 : undefined,
            currency: (paymentEntity?.currency || 'INR').toUpperCase(),
            paymentIntentId: paymentEntity?.id,
            providerCode: PaymentProviderCode.RAZORPAY,
          });
        }
        break;
      }

      case 'payment.failed': {
        const sub = await this.prisma.organizationSubscription.findFirst({
          where: { organizationId },
          orderBy: { createdAt: 'desc' },
        });

        if (sub) {
          const externalTxId = paymentEntity?.id;
          const existingPayment = externalTxId
            ? await this.prisma.payment.findFirst({
                where: { externalTxId, providerCode: PaymentProviderCode.RAZORPAY },
              })
            : null;

          if (!existingPayment) {
            await this.prisma.payment.create({
              data: {
                subscriptionId: sub.id,
                amount: paymentEntity?.amount ? Number(paymentEntity.amount) / 100 : 0,
                currency: (paymentEntity?.currency || 'INR').toUpperCase(),
                status: PaymentStatus.FAILED,
                failureReason: paymentEntity?.error_description || 'Payment failed',
                providerCode: PaymentProviderCode.RAZORPAY,
                externalTxId,
              },
            });
          }
        }
        break;
      }

      case 'subscription.activated':
      case 'subscription.charged': {
        const subId = subEntity?.id;
        if (!subId) {
          throw new BadRequestException('Missing subscription ID in Razorpay subscription event.');
        }

        let sub = await this.prisma.organizationSubscription.findFirst({
          where: { externalSubId: subId },
        });

        if (!sub && notes.planCode) {
          await this.activateSubscriptionFromProvider({
            organizationId,
            planCode: notes.planCode as PlanTier,
            interval: (notes.interval as BillingInterval) || BillingInterval.MONTHLY,
            externalSubId: subId,
            amount: paymentEntity?.amount ? Number(paymentEntity.amount) / 100 : undefined,
            currency: (paymentEntity?.currency || 'INR').toUpperCase(),
            paymentIntentId: paymentEntity?.id,
            providerCode: PaymentProviderCode.RAZORPAY,
          });
          sub = await this.prisma.organizationSubscription.findFirst({
            where: { externalSubId: subId },
          });
        } else if (!sub) {
          throw new NotFoundException(`Subscription not found for Razorpay subscription ID: ${subId}`);
        } else {
          await this.prisma.organizationSubscription.update({
            where: { id: sub.id },
            data: {
              status: SubscriptionStatus.ACTIVE,
              currentPeriodStart: subEntity.current_start ? new Date(subEntity.current_start * 1000) : undefined,
              currentPeriodEnd: subEntity.current_end ? new Date(subEntity.current_end * 1000) : undefined,
            },
          });
        }

        if (paymentEntity && sub) {
          const externalTxId = paymentEntity.id;
          const existingPayment = externalTxId
            ? await this.prisma.payment.findFirst({
                where: { externalTxId, providerCode: PaymentProviderCode.RAZORPAY },
              })
            : null;

          if (!existingPayment) {
            await this.prisma.payment.create({
              data: {
                subscriptionId: sub.id,
                amount: paymentEntity.amount ? Number(paymentEntity.amount) / 100 : 0,
                currency: (paymentEntity.currency || 'INR').toUpperCase(),
                status: PaymentStatus.SUCCEEDED,
                providerCode: PaymentProviderCode.RAZORPAY,
                externalTxId,
                paidAt: new Date(),
              },
            });
          }
        }
        break;
      }

      case 'subscription.cancelled': {
        const subId = subEntity?.id;
        if (!subId) {
          throw new BadRequestException('Missing subscription ID in Razorpay subscription.cancelled event.');
        }

        const sub = await this.prisma.organizationSubscription.findFirst({
          where: { externalSubId: subId },
        });

        if (!sub) {
          throw new NotFoundException(`Subscription not found for Razorpay subscription ID: ${subId}`);
        }

        await this.prisma.organizationSubscription.update({
          where: { id: sub.id },
          data: {
            status: SubscriptionStatus.CANCELED,
            canceledAt: new Date(),
          },
        });
        break;
      }

      default:
        throw new BadRequestException(`Unhandled Razorpay webhook event type: ${eventType}`);
    }
  }

  private mapStripeSubscriptionStatus(status: string): SubscriptionStatus {
    switch (status) {
      case 'active':
        return SubscriptionStatus.ACTIVE;
      case 'trialing':
        return SubscriptionStatus.TRIALING;
      case 'past_due':
        return SubscriptionStatus.PAST_DUE;
      case 'canceled':
        return SubscriptionStatus.CANCELED;
      case 'unpaid':
        return SubscriptionStatus.UNPAID;
      case 'incomplete':
      case 'incomplete_expired':
      default:
        return SubscriptionStatus.INCOMPLETE;
    }
  }

  private async activateSubscriptionFromProvider(params: {
    organizationId: string;
    planCode: PlanTier;
    interval: BillingInterval;
    externalSubId?: string;
    amount?: number;
    currency: string;
    paymentIntentId?: string;
    providerCode: PaymentProviderCode;
  }) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { code: params.planCode },
    });

    if (!plan) {
      throw new NotFoundException(`Subscription plan [${params.planCode}] not found.`);
    }

    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + (params.interval === BillingInterval.YEARLY ? 12 : 1));

    // Find existing subscription or create new
    const existingSub = await this.prisma.organizationSubscription.findFirst({
      where: { organizationId: params.organizationId },
      orderBy: { createdAt: 'desc' },
    });

    let subscription;
    if (existingSub) {
      subscription = await this.prisma.organizationSubscription.update({
        where: { id: existingSub.id },
        data: {
          planId: plan.id,
          status: SubscriptionStatus.ACTIVE,
          interval: params.interval,
          providerCode: params.providerCode,
          externalSubId: params.externalSubId || existingSub.externalSubId,
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: false,
          canceledAt: null,
        },
      });
    } else {
      subscription = await this.prisma.organizationSubscription.create({
        data: {
          organizationId: params.organizationId,
          planId: plan.id,
          status: SubscriptionStatus.ACTIVE,
          interval: params.interval,
          providerCode: params.providerCode,
          externalSubId: params.externalSubId,
          currentPeriodStart,
          currentPeriodEnd,
        },
      });
    }

    // Check duplicate Payment before creating
    if (params.paymentIntentId) {
      const existingPayment = await this.prisma.payment.findFirst({
        where: {
          externalTxId: params.paymentIntentId,
          providerCode: params.providerCode,
        },
      });

      if (!existingPayment) {
        await this.prisma.payment.create({
          data: {
            subscriptionId: subscription.id,
            amount:
              params.amount ?? (params.interval === BillingInterval.YEARLY ? plan.priceYearly : plan.priceMonthly),
            currency: params.currency,
            status: PaymentStatus.SUCCEEDED,
            providerCode: params.providerCode,
            externalTxId: params.paymentIntentId,
            paidAt: new Date(),
          },
        });
      }
    }

    // Sync quotas
    await this.subscriptionService.syncQuotaToSubscription(params.organizationId, params.planCode);
  }

  private async recordTopUpPayment(params: {
    organizationId: string;
    amount: number;
    currency: string;
    externalTxId?: string;
    providerCode: PaymentProviderCode;
  }) {
    let sub = await this.prisma.organizationSubscription.findFirst({
      where: { organizationId: params.organizationId },
      orderBy: { createdAt: 'desc' },
    });

    if (!sub) {
      const freePlan = await this.prisma.subscriptionPlan.findUnique({
        where: { code: PlanTier.FREE },
      });
      if (freePlan) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        sub = await this.prisma.organizationSubscription.create({
          data: {
            organizationId: params.organizationId,
            planId: freePlan.id,
            status: SubscriptionStatus.ACTIVE,
            interval: BillingInterval.MONTHLY,
            currentPeriodEnd: nextMonth,
          },
        });
      }
    }

    if (sub && params.externalTxId) {
      const existingPayment = await this.prisma.payment.findFirst({
        where: {
          externalTxId: params.externalTxId,
          providerCode: params.providerCode,
        },
      });

      if (!existingPayment) {
        await this.prisma.payment.create({
          data: {
            subscriptionId: sub.id,
            amount: params.amount,
            currency: params.currency,
            status: PaymentStatus.SUCCEEDED,
            providerCode: params.providerCode,
            externalTxId: params.externalTxId,
            paidAt: new Date(),
          },
        });
      }
    }
  }
}
