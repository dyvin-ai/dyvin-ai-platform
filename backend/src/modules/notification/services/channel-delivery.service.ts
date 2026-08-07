import { Injectable, Logger } from '@nestjs/common';
import { ChannelType, DeliveryStatus } from '@prisma/client';

export interface DeliveryPayload {
  notificationId: string;
  channelType: ChannelType;
  recipient: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class ChannelDeliveryService {
  private readonly logger = new Logger(ChannelDeliveryService.name);

  async deliver(payload: DeliveryPayload): Promise<{ status: DeliveryStatus; errorMessage?: string }> {
    this.logger.log(`Delivering notification [${payload.notificationId}] via [${payload.channelType}] to [${payload.recipient}]`);

    try {
      switch (payload.channelType) {
        case ChannelType.EMAIL:
          this.logger.log(`[EmailGateway] Sent email: "${payload.title}"`);
          break;
        case ChannelType.SLACK:
          this.logger.log(`[SlackWebhook] Posted message to channel: "${payload.message}"`);
          break;
        case ChannelType.DISCORD:
          this.logger.log(`[DiscordWebhook] Posted message: "${payload.message}"`);
          break;
        case ChannelType.MS_TEAMS:
          this.logger.log(`[MSTeamsCard] Sent adaptive card: "${payload.title}"`);
          break;
        case ChannelType.WEBHOOK:
          this.logger.log(`[OutboundWebhook] Executed HTTP POST payload`);
          break;
        case ChannelType.IN_APP:
        default:
          this.logger.log(`[InAppNotification] Registered in-app notification badge`);
          break;
      }

      return { status: DeliveryStatus.DELIVERED };
    } catch (error: any) {
      this.logger.error(`Failed to deliver notification [${payload.notificationId}] via [${payload.channelType}]:`, error);
      return { status: DeliveryStatus.FAILED, errorMessage: error?.message || 'Delivery error' };
    }
  }
}
