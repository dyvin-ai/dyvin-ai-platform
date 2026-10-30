import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChannelType, NotificationCategory, NotificationPriority } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { ChannelDeliveryService } from './channel-delivery.service';

export interface DispatchNotificationInput {
  userId: string;
  organizationId?: string;
  title: string;
  message: string;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
  channels?: ChannelType[];
}

@Injectable()
export class NotificationDispatcherService {
  private readonly logger = new Logger(NotificationDispatcherService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly channelDelivery: ChannelDeliveryService,
    private readonly auditService: AuditService,
  ) {}

  async dispatch(input: DispatchNotificationInput) {
    const category = input.category || NotificationCategory.SYSTEM;
    const priority = input.priority || NotificationPriority.MEDIUM;

    // Check user preference
    const pref = await this.prisma.notificationPreference.findFirst({
      where: {
        userId: input.userId,
        category,
      },
    });

    if (pref && !pref.isEnabled) {
      this.logger.log(`Notification muted by user preference for user [${input.userId}] category [${category}]`);
      return null;
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        organizationId: input.organizationId,
        title: input.title,
        message: input.message,
        category,
        priority,
        metadata: input.metadata || {},
      },
    });

    const channelsToDeliver = input.channels || [ChannelType.IN_APP, ChannelType.EMAIL];

    for (const channel of channelsToDeliver) {
      const deliveryResult = await this.channelDelivery.deliver({
        notificationId: notification.id,
        channelType: channel,
        recipient: input.userId,
        title: input.title,
        message: input.message,
        metadata: input.metadata,
      });

      await this.prisma.notificationDelivery.create({
        data: {
          notificationId: notification.id,
          channelType: channel,
          status: deliveryResult.status,
          errorMessage: deliveryResult.errorMessage,
          deliveredAt: deliveryResult.status === 'DELIVERED' ? new Date() : null,
        },
      });
    }

    await this.auditService.logAction({
      userId: input.userId,
      organizationId: input.organizationId,
      action: 'NOTIFICATION_SENT',
      metadata: { notificationId: notification.id, category, priority },
    });

    return notification;
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: { deliveries: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNotificationDetails(notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
      include: { deliveries: true, history: true },
    });

    if (!notification) {
      throw new NotFoundException(`Notification [${notificationId}] not found.`);
    }

    return notification;
  }

  async markAsRead(notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification [${notificationId}] not found.`);
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return { success: true, message: 'All notifications marked as read.' };
  }

  async deleteNotification(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification [${notificationId}] not found for user [${userId}].`);
    }

    await this.prisma.notificationDelivery.deleteMany({
      where: { notificationId },
    });
    await this.prisma.notificationHistory.deleteMany({
      where: { notificationId },
    });
    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true, message: `Notification [${notificationId}] deleted.` };
  }

  async clearAllNotifications(userId: string) {
    const userNotifications = await this.prisma.notification.findMany({
      where: { userId },
      select: { id: true },
    });

    const notifIds = userNotifications.map((n) => n.id);
    if (notifIds.length > 0) {
      await this.prisma.notificationDelivery.deleteMany({
        where: { notificationId: { in: notifIds } },
      });
      await this.prisma.notificationHistory.deleteMany({
        where: { notificationId: { in: notifIds } },
      });
      await this.prisma.notification.deleteMany({
        where: { userId },
      });
    }

    return { success: true, message: `All notifications cleared for user [${userId}].` };
  }

  async getPreferences(userId: string) {
    return this.prisma.notificationPreference.findMany({
      where: { userId },
    });
  }

  async updatePreferences(userId: string, category: NotificationCategory, isEnabled: boolean, channel: ChannelType = ChannelType.IN_APP) {
    return this.prisma.notificationPreference.upsert({
      where: {
        userId_category_channel: { userId, category, channel },
      },
      update: { isEnabled },
      create: { userId, category, channel, isEnabled },
    });
  }
}
