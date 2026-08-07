import { Test, TestingModule } from '@nestjs/testing';
import { ActionEngineService } from './action-engine.service';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { ActionPriority, ActionStatus, ActionTriggerType, ActionType } from '@prisma/client';

describe('ActionEngineService', () => {
  let service: ActionEngineService;

  const mockPrismaService = {
    action: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'action-1', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      findUnique: jest.fn().mockImplementation(({ where }) =>
        Promise.resolve({
          id: where.id,
          title: 'Generate JSON-LD Schema Action',
          type: ActionType.GENERATE_JSON_LD,
          status: ActionStatus.COMPLETED,
          executions: [],
          artifacts: [],
        }),
      ),
      findMany: jest.fn().mockResolvedValue([]),
    },
    actionExecution: {
      create: jest.fn().mockResolvedValue({ id: 'exec-1', status: ActionStatus.RUNNING }),
      update: jest.fn().mockResolvedValue({ id: 'exec-1', status: ActionStatus.COMPLETED }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    actionArtifact: {
      create: jest.fn().mockResolvedValue({ id: 'art-1', title: 'Artifact' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    actionResult: {
      create: jest.fn().mockResolvedValue({ id: 'res-1' }),
    },
    actionHistory: {
      create: jest.fn().mockResolvedValue({ id: 'hist-1' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockAuditService = { logAction: jest.fn().mockResolvedValue(true) };
  const mockFeatureFlagService = { evaluate: jest.fn().mockResolvedValue(true) };
  const mockNotificationService = { createNotification: jest.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionEngineService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: NotificationEngineService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<ActionEngineService>(ActionEngineService);
  });

  it('should create an autonomous action', async () => {
    const result = await service.createAction({
      organizationId: 'org-123',
      title: 'Generate JSON-LD Schema Action',
      type: ActionType.GENERATE_JSON_LD,
      priority: ActionPriority.HIGH,
      triggerType: ActionTriggerType.MANUAL,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe('action-1');
    expect(mockAuditService.logAction).toHaveBeenCalled();
  });

  it('should execute an action and create result artifact', async () => {
    const result = await service.runAction('action-1');

    expect(result).toBeDefined();
    expect(result.status).toBe(ActionStatus.COMPLETED);
    expect(mockPrismaService.actionArtifact.create).toHaveBeenCalled();
  });
});
