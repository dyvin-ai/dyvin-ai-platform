import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BillingInterval, PaymentProviderCode, PlanTier, SubscriptionStatus, UsageMetricType } from '@prisma/client';
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
      { code: PlanTier.FREE, name: 'Free', priceMonthly: 0, priceYearly: 0, includedCredits: 10, monthlyQuota: 10 },
      { code: PlanTier.STARTER, name: 'Starter', priceMonthly: 49, priceYearly: 490, includedCredits: 100, monthlyQuota: 100 },
      { code: PlanTier.GROWTH, name: 'Growth', priceMonthly: 149, priceYearly: 1490, includedCredits: 500, monthlyQuota: 500 },
      { code: PlanTier.PROFESSIONAL, name: 'Professional', priceMonthly: 399, priceYearly: 3990, includedCredits: 2000, monthlyQuota: 2000 },
      { code: PlanTier.ENTERPRISE, name: 'Enterprise', priceMonthly: 999, priceYearly: 9990, includedCredits: -1, monthlyQuota: -1 },
    ];

    const createdPlans = [];

    for (const p of plansData) {
      const plan = await this.prisma.subscriptionPlan.upsert({
        where: { code: p.code },
        update: { includedCredits: p.includedCredits, monthlyQuota: p.monthlyQuota },
        create: {
          code: p.code,
          name: p.name,
          priceMonthly: p.priceMonthly,
          priceYearly: p.priceYearly,
          currency: 'USD',
          isActive: true,
          includedCredits: p.includedCredits,
          monthlyQuota: p.monthlyQuota,
        },
      });
      createdPlans.push(plan);
    }

    return this.prisma.subscriptionPlan.findMany({ include: { features: true } });
  }

  /**
   * Syncs UsageQuota records for SCANS and AI_REQUESTS to the plan's monthlyQuota value.
   * Pass a Prisma transaction client (tx) or leave undefined to use this.prisma directly.
   */
  async syncQuotaToSubscription(organizationId: string, planCode: PlanTier, tx?: any): Promise<void> {
    const client = tx ?? this.prisma;
    const plan = await client.subscriptionPlan.findUnique({ where: { code: planCode } });
    if (!plan) {
      this.logger.warn(`[SubscriptionService] Plan [${planCode}] not found — cannot sync quotas.`);
      return;
    }

    const limit: number = plan.monthlyQuota ?? 100;
    const resetAt = new Date();
    resetAt.setMonth(resetAt.getMonth() + 1);

    for (const metric of [UsageMetricType.SCANS, UsageMetricType.AI_REQUESTS]) {
      await client.usageQuota.upsert({
        where: { organizationId_metricType: { organizationId, metricType: metric } },
        update: { monthlyLimit: limit },
        create: {
          organizationId,
          metricType: metric,
          monthlyLimit: limit,
          currentUsage: 0,
          resetAt,
        },
      });
    }
    this.logger.log(`[SubscriptionService] Synced quotas for org [${organizationId}] to plan [${planCode}] (limit: ${limit})`);
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

    // Sync quota limits to the new plan
    await this.syncQuotaToSubscription(input.organizationId, input.planCode);

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

    // Sync quota limits to new plan
    await this.syncQuotaToSubscription(organizationId, newPlanCode);

    return updated;
  }
}
