import { Injectable, Logger } from '@nestjs/common';
import { ChannelType, NotificationCategory, NotificationPriority } from '@prisma/client';
import { CollaborationService, CreateCommentInput } from './collaboration.service';
import { DispatchNotificationInput, NotificationDispatcherService } from './notification-dispatcher.service';

@Injectable()
export class NotificationEngineService {
  private readonly logger = new Logger(NotificationEngineService.name);

  constructor(
    private readonly dispatcher: NotificationDispatcherService,
    private readonly collaboration: CollaborationService,
  ) {}

  dispatch(input: DispatchNotificationInput) {
    return this.dispatcher.dispatch(input);
  }

  getNotifications(userId: string) {
    return this.dispatcher.getNotifications(userId);
  }

  getNotificationDetails(notificationId: string) {
    return this.dispatcher.getNotificationDetails(notificationId);
  }

  markAsRead(notificationId: string) {
    return this.dispatcher.markAsRead(notificationId);
  }

  markAllAsRead(userId: string) {
    return this.dispatcher.markAllAsRead(userId);
  }

  deleteNotification(userId: string, notificationId: string) {
    return this.dispatcher.deleteNotification(userId, notificationId);
  }

  clearAllNotifications(userId: string) {
    return this.dispatcher.clearAllNotifications(userId);
  }

  getPreferences(userId: string) {
    return this.dispatcher.getPreferences(userId);
  }

  updatePreferences(userId: string, category: NotificationCategory, isEnabled: boolean, channel?: ChannelType) {
    return this.dispatcher.updatePreferences(userId, category, isEnabled, channel);
  }

  createComment(input: CreateCommentInput) {
    return this.collaboration.createComment(input);
  }

  createMention(commentId: string, mentionedUserId: string, userId?: string) {
    return this.collaboration.createMention(commentId, mentionedUserId, userId);
  }

  getActivityFeed(organizationId?: string, projectId?: string) {
    return this.collaboration.getActivityFeed(organizationId, projectId);
  }
}
