import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { NOTIFICATION_QUEUES } from './notification.constants';
import { NotificationController } from './notification.controller';
import { NotificationProcessor } from './processors/notification.processor';
import { ChannelDeliveryService } from './services/channel-delivery.service';
import { CollaborationService } from './services/collaboration.service';
import { NotificationDispatcherService } from './services/notification-dispatcher.service';
import { NotificationEngineService } from './services/notification-engine.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: NOTIFICATION_QUEUES.NOTIFICATION_ENGINE },
      { name: NOTIFICATION_QUEUES.EMAIL_DELIVERY },
      { name: NOTIFICATION_QUEUES.SLACK_DELIVERY },
      { name: NOTIFICATION_QUEUES.WEBHOOK_DELIVERY },
    ),
  ],
  controllers: [NotificationController],
  providers: [
    ChannelDeliveryService,
    NotificationDispatcherService,
    CollaborationService,
    NotificationEngineService,
    NotificationProcessor,
  ],
  exports: [
    NotificationEngineService,
    NotificationDispatcherService,
    ChannelDeliveryService,
    CollaborationService,
  ],
})
export class NotificationModule {}
