import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PaymentProviderCode, WebhookEventStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PaymentProviderRouter } from '../providers/payment-provider-router.service';

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
  ) {}

  async processWebhook(input: ProcessWebhookInput) {
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

    const eventRecord = await this.prisma.webhookEvent.upsert({
      where: { eventId },
      update: { status: WebhookEventStatus.PROCESSED, processedAt: new Date() },
      create: {
        providerCode: input.providerCode,
        eventId,
        eventType,
        payload: input.body,
        status: WebhookEventStatus.PROCESSED,
        processedAt: new Date(),
      },
    });

    this.logger.log(`Processed webhook event [${eventType}] from [${input.providerCode}]`);
    return { success: true, eventId, eventType, status: WebhookEventStatus.PROCESSED };
  }
}
