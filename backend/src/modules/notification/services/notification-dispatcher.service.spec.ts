import { Test, TestingModule } from '@nestjs/testing';
import { ChannelType, NotificationCategory, NotificationPriority } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { ChannelDeliveryService } from './channel-delivery.service';
import { NotificationDispatcherService } from './notification-dispatcher.service';

describe('NotificationDispatcherService', () => {
  let service: NotificationDispatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationDispatcherService,
        {
          provide: PrismaService,
          useValue: {
            notificationPreference: {
              findFirst: jest.fn().mockResolvedValue(null),
              findMany: jest.fn().mockResolvedValue([]),
              upsert: jest.fn().mockResolvedValue({ id: 'pref-1' }),
            },
            notification: {
              create: jest.fn().mockResolvedValue({ id: 'notif-1', title: 'Analysis Done', isRead: false }),
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue({ id: 'notif-1', isRead: false }),
              update: jest.fn().mockResolvedValue({ id: 'notif-1', isRead: true }),
              updateMany: jest.fn().mockResolvedValue({ count: 5 }),
            },
            notificationDelivery: {
              create: jest.fn().mockResolvedValue({ id: 'del-1' }),
            },
          },
        },
        {
          provide: ChannelDeliveryService,
          useValue: {
            deliver: jest.fn().mockResolvedValue({ status: 'DELIVERED' }),
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<NotificationDispatcherService>(NotificationDispatcherService);
  });

  it('should dispatch notification across channels', async () => {
    const notif = await service.dispatch({
      userId: 'u-1',
      title: 'Analysis Completed',
      message: 'Visibility score calculated.',
      category: NotificationCategory.ANALYSIS,
    });
    expect(notif?.id).toBe('notif-1');
  });

  it('should mark notification as read', async () => {
    const res = await service.markAsRead('notif-1');
    expect(res.isRead).toBe(true);
  });
});
