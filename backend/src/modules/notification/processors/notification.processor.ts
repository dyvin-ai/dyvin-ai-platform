import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NOTIFICATION_QUEUES } from '../notification.constants';
import { DispatchNotificationInput, NotificationDispatcherService } from '../services/notification-dispatcher.service';

@Processor(NOTIFICATION_QUEUES.NOTIFICATION_ENGINE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly dispatcher: NotificationDispatcherService) {
    super();
  }

  async process(job: Job<DispatchNotificationInput>): Promise<void> {
    this.logger.log(`Processing asynchronous notification job for user [${job.data.userId}]`);

    try {
      await this.dispatcher.dispatch(job.data);
    } catch (error) {
      this.logger.error(`Notification job failed for user [${job.data.userId}]:`, error);
      throw error;
    }
  }
}
