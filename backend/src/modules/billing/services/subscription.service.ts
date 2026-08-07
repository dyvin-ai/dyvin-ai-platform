import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BillingInterval, PaymentProviderCode, PlanTier, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { PaymentProviderRouter } from '../providers/payment-provider-router.service';

export interface SubscribeInput {
  organizationId: string;
  planCode: PlanTier;
  interval?: BillingInterval;
  providerCode?: PaymentProviderCode;
}

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerRouter: PaymentProviderRouter,
    private readonly auditService: AuditService,
  ) {}

  async getPlans() {
    let plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      include: { features: true },
    });

    if (plans.length === 0) {
      plans = await this.seedDefaultPlans();
    }

    return plans;
  }

  private async seedDefaultPlans() {
    const plansData = [
      { code: PlanTier.FREE, name: 'Free', priceMonthly: 0, priceYearly: 0 },
      { code: PlanTier.STARTER, name: 'Starter', priceMonthly: 49, priceYearly: 490 },
      { code: PlanTier.GROWTH, name: 'Growth', priceMonthly: 149, priceYearly: 1490 },
      { code: PlanTier.PROFESSIONAL, name: 'Professional', priceMonthly: 399, priceYearly: 3990 },
      { code: PlanTier.ENTERPRISE, name: 'Enterprise', priceMonthly: 999, priceYearly: 9990 },
    ];

    const createdPlans = [];

    for (const p of plansData) {
      const plan = await this.prisma.subscriptionPlan.upsert({
        where: { code: p.code },
        update: {},
        create: {
          code: p.code,
          name: p.name,
          priceMonthly: p.priceMonthly,
          priceYearly: p.priceYearly,
          currency: 'USD',
          isActive: true,
        },
      });
      createdPlans.push(plan);
    }

    return this.prisma.subscriptionPlan.findMany({ include: { features: true } });
  }

  async getSubscription(organizationId: string) {
    const sub = await this.prisma.organizationSubscription.findFirst({
      where: { organizationId },
      include: { plan: { include: { features: true } } },
      orderBy: { createdAt: 'desc' },
    });

    if (!sub) {
      throw new NotFoundException(`No subscription found for organization [${organizationId}].`);
    }

    return sub;
  }

  async subscribe(input: SubscribeInput, userId?: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { code: input.planCode },
    });

    if (!plan) {
      throw new NotFoundException(`Subscription plan [${input.planCode}] not found.`);
    }

    const providerCode = input.providerCode || PaymentProviderCode.MOCK;
    const provider = this.providerRouter.getProvider(providerCode);

    const customer = await provider.createCustomer({
      organizationId: input.organizationId,
      email: `org-${input.organizationId}@dyvin.ai`,
      name: `Organization ${input.organizationId}`,
    });

    const subOutput = await provider.createSubscription({
      providerCustomerId: customer.providerCustomerId,
      planCode: input.planCode,
      interval: input.interval || BillingInterval.MONTHLY,
    });

    const periodEnd = subOutput.currentPeriodEnd;

    const subscription = await this.prisma.organizationSubscription.create({
      data: {
        organizationId: input.organizationId,
        planId: plan.id,
        status: SubscriptionStatus.ACTIVE,
        interval: input.interval || BillingInterval.MONTHLY,
        providerCode,
        externalSubId: subOutput.providerSubscriptionId,
        currentPeriodStart: subOutput.currentPeriodStart,
        currentPeriodEnd: periodEnd,
      },
    });

    await this.prisma.billingAudit.create({
      data: {
        organizationId: input.organizationId,
        action: 'SUBSCRIPTION_CREATED',
        userId,
        details: { planCode: input.planCode, interval: input.interval || 'MONTHLY' },
      },
    });

    await this.auditService.logAction({
      userId,
      organizationId: input.organizationId,
      action: 'SUBSCRIPTION_CREATED',
      metadata: { planCode: input.planCode },
    });

    return subscription;
  }

  async cancel(organizationId: string, userId?: string) {
    const sub = await this.getSubscription(organizationId);

    const provider = this.providerRouter.getProvider(sub.providerCode);
    if (sub.externalSubId) {
      await provider.cancelSubscription(sub.externalSubId);
    }

    const updated = await this.prisma.organizationSubscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    });

    await this.prisma.billingAudit.create({
      data: {
        organizationId,
        action: 'SUBSCRIPTION_CANCELLED',
        userId,
      },
    });

    return updated;
  }

  async resume(organizationId: string, userId?: string) {
    const sub = await this.getSubscription(organizationId);

    const updated = await this.prisma.organizationSubscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    });

    await this.prisma.billingAudit.create({
      data: {
        organizationId,
        action: 'SUBSCRIPTION_RESUMED',
        userId,
      },
    });

    return updated;
  }

  async changePlan(organizationId: string, newPlanCode: PlanTier, userId?: string) {
    const sub = await this.getSubscription(organizationId);

    const newPlan = await this.prisma.subscriptionPlan.findUnique({
      where: { code: newPlanCode },
    });

    if (!newPlan) {
      throw new NotFoundException(`Plan [${newPlanCode}] not found.`);
    }

    const provider = this.providerRouter.getProvider(sub.providerCode);
    if (sub.externalSubId) {
      await provider.changePlan(sub.externalSubId, newPlanCode);
    }

    const updated = await this.prisma.organizationSubscription.update({
      where: { id: sub.id },
      data: {
        planId: newPlan.id,
      },
    });

    await this.prisma.billingAudit.create({
      data: {
        organizationId,
        action: 'SUBSCRIPTION_CHANGED',
        userId,
        details: { oldPlanId: sub.planId, newPlanCode },
      },
    });

    return updated;
  }
}
