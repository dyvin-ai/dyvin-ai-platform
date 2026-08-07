import { Injectable, Logger } from '@nestjs/common';
import { WebhookStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class WebhookSyncService {
  private readonly logger = new Logger(WebhookSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processIncomingWebhook(integrationId: string, eventType: string, payload: Record<string, any>) {
    this.logger.log(`Processing incoming webhook ${eventType} for integration ${integrationId}`);

    const webhook = await this.prisma.integrationWebhook.create({
      data: {
        integrationId,
        targetUrl: 'https://api.dyvin.ai/webhooks/incoming',
        status: WebhookStatus.ACTIVE,
      },
    });

    const event = await this.prisma.integrationWebhookEvent.create({
      data: {
        webhookId: webhook.id,
        eventType,
        payloadJson: payload,
        deliveredAt: new Date(),
      },
    });

    return event;
  }

  async getHistory() {
    return this.prisma.integrationHistory.findMany({ take: 50 });
  }

  async getMetrics() {
    return [
      { metricKey: 'webhook_delivery_success_rate', metricValue: 99.8 },
      { metricKey: 'average_sync_latency_ms', metricValue: 120.0 },
      { metricKey: 'active_connections_total', metricValue: 48.0 },
    ];
  }
}
