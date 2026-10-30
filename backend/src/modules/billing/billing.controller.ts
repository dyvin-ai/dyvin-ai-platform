import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BillingInterval, PaymentProviderCode, PlanTier, Role } from '@prisma/client';
import { Request } from 'express';
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

export class CreateCheckoutDto {
  mode!: 'subscription' | 'payment';
  planCode?: PlanTier;
  interval?: BillingInterval;
  topUpCredits?: number;
  providerCode?: PaymentProviderCode;
  successUrl?: string;
  cancelUrl?: string;
}

export class VerifyPaymentDto {
  providerCode!: PaymentProviderCode;
  orderId!: string;
  paymentId!: string;
  signature!: string;
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
  @Roles(Role.VIEWER)
  @ApiOperation({
    summary: 'Get Organization Subscription',
    description: 'Retrieves active subscription, current billing period, and status. Requires verified membership in the specified organization.',
  })
  @ApiResponse({ status: 200, description: 'Organization subscription overview.' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a member of the specified organization.' })
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

  @Post('checkout')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Create Checkout Session or Order',
    description: 'Generates an authenticated checkout session for Stripe or an order for Razorpay for subscriptions or credit top-ups.',
  })
  @ApiBody({ type: CreateCheckoutDto })
  @ApiResponse({ status: 201, description: 'Checkout session created.' })
  async createCheckout(
    @Headers('x-organization-id') organizationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.billingEngine.createCheckout(organizationId, userId, dto);
  }

  @Post('verify-payment')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Verify Provider Payment',
    description: 'Verifies payment signature from provider frontend checkout (e.g. Razorpay modal).',
  })
  @ApiBody({ type: VerifyPaymentDto })
  @ApiResponse({ status: 200, description: 'Payment verification result.' })
  async verifyPayment(
    @Headers('x-organization-id') organizationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.billingEngine.verifyPayment(organizationId, userId, dto);
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
  @Roles(Role.VIEWER)
  @ApiOperation({
    summary: 'Get Quota & Usage Metrics',
    description: 'Retrieves current monthly usage vs plan limits for scans, AI requests, storage, and exports. Requires verified membership in the specified organization.',
  })
  @ApiResponse({ status: 200, description: 'Usage metrics.' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a member of the specified organization.' })
  async getUsage(@Headers('x-organization-id') organizationId: string) {
    return this.billingEngine.getUsage(organizationId);
  }

  @Get('invoices')
  @Roles(Role.VIEWER)
  @ApiOperation({
    summary: 'Get Organization Invoices',
    description: 'Retrieves itemized invoices and billing history. Requires verified membership in the specified organization.',
  })
  @ApiResponse({ status: 200, description: 'List of invoices.' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a member of the specified organization.' })
  async getInvoices(@Headers('x-organization-id') organizationId: string) {
    return this.billingEngine.getInvoices(organizationId);
  }

  @Get('payments')
  @Roles(Role.VIEWER)
  @ApiOperation({
    summary: 'Get Organization Payments',
    description: 'Retrieves payment history records. Requires verified membership in the specified organization.',
  })
  @ApiResponse({ status: 200, description: 'List of payments.' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a member of the specified organization.' })
  async getPayments(@Headers('x-organization-id') organizationId: string) {
    return this.billingEngine.getPayments(organizationId);
  }

  @Post('webhooks')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Inbound Payment Provider Webhooks',
    description: 'Receives webhook events from Stripe, Razorpay, or Mock payment provider. Signatures are verified cryptographically for all non-Mock providers.',
  })
  @ApiHeader({ name: 'stripe-signature', required: false, description: 'Stripe Signature Header' })
  @ApiHeader({ name: 'x-razorpay-signature', required: false, description: 'Razorpay Signature Header' })
  @ApiResponse({ status: 200, description: 'Webhook event processed.' })
  @ApiResponse({ status: 400, description: 'Invalid or missing webhook signature.' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') stripeSig?: string,
    @Headers('x-razorpay-signature') rzpSig?: string,
    @Body() body?: any,
  ) {
    const providerCode = body?.providerCode || (stripeSig ? PaymentProviderCode.STRIPE : rzpSig ? PaymentProviderCode.RAZORPAY : PaymentProviderCode.MOCK);
    const signature = stripeSig || rzpSig || '';

    // Pass raw body buffer so providers can perform cryptographic signature verification
    const rawBody = req.rawBody;

    return this.webhookProcessor.processWebhook({
      providerCode,
      signature,
      body: body || {},
      rawBody,
    });
  }
}
