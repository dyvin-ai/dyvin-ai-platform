import { Injectable, Logger } from '@nestjs/common';
import { PlanTier, UsageMetricType } from '@prisma/client';
import { InvoiceService } from './invoice.service';
import { QuotaEnforcementService } from './quota-enforcement.service';
import { SubscriptionService } from './subscription.service';
import { WebhookProcessorService } from './webhook-processor.service';

@Injectable()
export class BillingEngineService {
  private readonly logger = new Logger(BillingEngineService.name);

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly quotaEnforcement: QuotaEnforcementService,
    private readonly invoiceService: InvoiceService,
    private readonly webhookProcessor: WebhookProcessorService,
  ) {}

  getPlans() {
    return this.subscriptionService.getPlans();
  }

  getSubscription(organizationId: string) {
    return this.subscriptionService.getSubscription(organizationId);
  }

  subscribe(organizationId: string, planCode: PlanTier, userId?: string) {
    return this.subscriptionService.subscribe({ organizationId, planCode }, userId);
  }

  cancel(organizationId: string, userId?: string) {
    return this.subscriptionService.cancel(organizationId, userId);
  }

  resume(organizationId: string, userId?: string) {
    return this.subscriptionService.resume(organizationId, userId);
  }

  changePlan(organizationId: string, newPlanCode: PlanTier, userId?: string) {
    return this.subscriptionService.changePlan(organizationId, newPlanCode, userId);
  }

  getUsage(organizationId: string) {
    return this.quotaEnforcement.getOrganizationUsage(organizationId);
  }

  recordUsage(organizationId: string, metricType: UsageMetricType, quantity: number = 1) {
    return this.quotaEnforcement.recordUsage(organizationId, metricType, quantity);
  }

  getInvoices(organizationId: string) {
    return this.invoiceService.getInvoices(organizationId);
  }

  getPayments(organizationId: string) {
    return this.invoiceService.getPayments(organizationId);
  }
}
