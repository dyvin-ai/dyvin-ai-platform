import { Test, TestingModule } from '@nestjs/testing';
import { CollaborationService } from './collaboration.service';
import { NotificationDispatcherService } from './notification-dispatcher.service';
import { NotificationEngineService } from './notification-engine.service';

describe('NotificationEngineService', () => {
  let service: NotificationEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationEngineService,
        {
          provide: NotificationDispatcherService,
          useValue: {
            dispatch: jest.fn().mockResolvedValue({ id: 'n-1' }),
            getNotifications: jest.fn().mockResolvedValue([]),
            markAsRead: jest.fn().mockResolvedValue({ id: 'n-1', isRead: true }),
            markAllAsRead: jest.fn().mockResolvedValue({ success: true }),
            getPreferences: jest.fn().mockResolvedValue([]),
            updatePreferences: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: CollaborationService,
          useValue: {
            createComment: jest.fn().mockResolvedValue({ id: 'c-1' }),
            createMention: jest.fn().mockResolvedValue({ id: 'm-1' }),
            getActivityFeed: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationEngineService>(NotificationEngineService);
  });

  it('should delegate dispatch to NotificationDispatcherService', async () => {
    const notif = await service.dispatch({ userId: 'u-1', title: 'Test', message: 'Hello' });
    expect(notif?.id).toBe('n-1');
  });
});
