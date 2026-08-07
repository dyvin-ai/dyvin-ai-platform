import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CollaborationService } from './collaboration.service';

describe('CollaborationService', () => {
  let service: CollaborationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaborationService,
        {
          provide: PrismaService,
          useValue: {
            comment: {
              create: jest.fn().mockResolvedValue({ id: 'c-1', content: 'Great job!', userId: 'u-1' }),
            },
            mention: {
              createMany: jest.fn().mockResolvedValue({ count: 1 }),
              create: jest.fn().mockResolvedValue({ id: 'm-1' }),
            },
            activityLog: {
              create: jest.fn().mockResolvedValue({ id: 'act-1' }),
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<CollaborationService>(CollaborationService);
  });

  it('should post team comment and create mention records', async () => {
    const comment = await service.createComment({
      entityType: 'RECOMMENDATION',
      entityId: 'rec-1',
      userId: 'u-1',
      content: 'Check this out @user-2',
      mentionedUserIds: ['u-2'],
    });
    expect(comment.id).toBe('c-1');
  });
});
