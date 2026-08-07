import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentProviderCode, PlanTier, Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BillingEngineService } from './services/billing-engine.service';
import { WebhookProcessorService } from './services/webhook-processor.service';

export class SubscribeDto {
  planCode!: PlanTier;
  providerCode?: PaymentProviderCode;
}

export class ChangePlanDto {
  newPlanCode!: PlanTier;
}

export class WebhookPayloadDto {
  providerCode?: PaymentProviderCode;
  signature?: string;
  [key: string]: any;
}

@ApiTags('Billing, Subscription & Usage Platform')
@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: false,
})
export class BillingController {
  constructor(
    private readonly billingEngine: BillingEngineService,
    private readonly webhookProcessor: WebhookProcessorService,
  ) {}

  @Get('plans')
  @Public()
  @ApiOperation({
    summary: 'List Subscription Plans',
    description: 'Retrieves all active subscription plans (Free, Starter, Growth, Professional, Enterprise).',
  })
  @ApiResponse({ status: 200, description: 'List of subscription plans.' })
  async getPlans() {
    return this.billingEngine.getPlans();
  }

  @Get('subscription')
  @ApiOperation({
    summary: 'Get Organization Subscription',
    description: 'Retrieves active subscription, current billing period, and status.',
  })
  @ApiResponse({ status: 200, description: 'Organization subscription overview.' })
  async getSubscription(@Headers('x-organization-id') organizationId: string) {
    return this.billingEngine.getSubscription(organizationId);
  }

  @Post('subscribe')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Subscribe Organization to Plan',
    description: 'Subscribes organization to chosen plan tier via Stripe, Razorpay, or Mock provider.',
  })
  @ApiBody({ type: SubscribeDto })
  @ApiResponse({ status: 201, description: 'Subscription created.' })
  async subscribe(
    @Headers('x-organization-id') organizationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SubscribeDto,
  ) {
    return this.billingEngine.subscribe(organizationId, dto.planCode, userId);
  }

  @Post('cancel')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Cancel Subscription',
    description: 'Schedules subscription cancellation at the end of current billing period.',
  })
  @ApiResponse({ status: 200, description: 'Subscription cancellation scheduled.' })
  async cancel(
    @Headers('x-organization-id') organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.billingEngine.cancel(organizationId, userId);
  }

  @Post('resume')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Resume Subscription',
    description: 'Resumes pending subscription cancellation.',
  })
  @ApiResponse({ status: 200, description: 'Subscription resumed.' })
  async resume(
    @Headers('x-organization-id') organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.billingEngine.resume(organizationId, userId);
  }

  @Post('change-plan')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Upgrade or Downgrade Plan Tier',
    description: 'Changes active subscription plan tier.',
  })
  @ApiBody({ type: ChangePlanDto })
  @ApiResponse({ status: 200, description: 'Subscription plan updated.' })
  async changePlan(
    @Headers('x-organization-id') organizationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePlanDto,
  ) {
    return this.billingEngine.changePlan(organizationId, dto.newPlanCode, userId);
  }

  @Get('usage')
  @ApiOperation({
    summary: 'Get Quota & Usage Metrics',
    description: 'Retrieves current monthly usage vs plan limits for scans, AI requests, storage, and exports.',
  })
  @ApiResponse({ status: 200, description: 'Usage metrics.' })
  async getUsage(@Headers('x-organization-id') organizationId: string) {
    return this.billingEngine.getUsage(organizationId);
  }

  @Get('invoices')
  @ApiOperation({
    summary: 'Get Organization Invoices',
    description: 'Retrieves itemized invoices and billing history.',
  })
  @ApiResponse({ status: 200, description: 'List of invoices.' })
  async getInvoices(@Headers('x-organization-id') organizationId: string) {
    return this.billingEngine.getInvoices(organizationId);
  }

  @Get('payments')
  @ApiOperation({
    summary: 'Get Organization Payments',
    description: 'Retrieves payment history records.',
  })
  @ApiResponse({ status: 200, description: 'List of payments.' })
  async getPayments(@Headers('x-organization-id') organizationId: string) {
    return this.billingEngine.getPayments(organizationId);
  }

  @Post('webhooks')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Inbound Payment Provider Webhooks',
    description: 'Receives webhook events from Stripe, Razorpay, or Mock payment provider.',
  })
  @ApiHeader({ name: 'stripe-signature', required: false, description: 'Stripe Signature Header' })
  @ApiResponse({ status: 200, description: 'Webhook event processed.' })
  async handleWebhook(
    @Headers('stripe-signature') stripeSig?: string,
    @Headers('x-razorpay-signature') rzpSig?: string,
    @Body() body?: any,
  ) {
    const providerCode = body?.providerCode || (stripeSig ? PaymentProviderCode.STRIPE : rzpSig ? PaymentProviderCode.RAZORPAY : PaymentProviderCode.MOCK);
    const signature = stripeSig || rzpSig || 'mock_sig';

    return this.webhookProcessor.processWebhook({
      providerCode,
      signature,
      body: body || {},
    });
  }
}
