import { Test, TestingModule } from '@nestjs/testing';
import { StrategyEngineService } from './strategy-engine.service';
import { RootCauseEngineService } from './root-cause-engine.service';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { StrategyPriorityLevel, StrategyStatus, StrategyType } from '@prisma/client';

describe('StrategyEngineService', () => {
  let service: StrategyEngineService;

  const mockPrismaService = {
    strategy: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'strat-1', ...data })),
      findUnique: jest.fn().mockImplementation(({ where }) =>
        Promise.resolve({
          id: where.id,
          title: 'Comprehensive AI_SEARCH Strategy Roadmap',
          type: StrategyType.AI_SEARCH,
          status: StrategyStatus.ACTIVE,
          rootCauses: [],
          recommendations: [],
        }),
      ),
      findMany: jest.fn().mockResolvedValue([]),
    },
    strategyRootCause: {
      create: jest.fn().mockResolvedValue({ id: 'rc-1' }),
    },
    strategyRecommendation: {
      create: jest.fn().mockResolvedValue({ id: 'rec-1' }),
    },
    strategyEvidence: {
      create: jest.fn().mockResolvedValue({ id: 'ev-1' }),
    },
  };

  const mockAuditService = { logAction: jest.fn().mockResolvedValue(true) };
  const mockFeatureFlagService = { evaluate: jest.fn().mockResolvedValue(true) };
  const mockNotificationService = { createNotification: jest.fn().mockResolvedValue(true) };
  const mockRootCauseEngine = {
    diagnoseRootCauses: jest.fn().mockResolvedValue([
      { causeType: 'SCHEMA_ISSUES', title: 'Missing Schema', description: 'Missing JSON-LD', severity: 'CRITICAL' },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StrategyEngineService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: NotificationEngineService, useValue: mockNotificationService },
        { provide: RootCauseEngineService, useValue: mockRootCauseEngine },
      ],
    }).compile();

    service = module.get<StrategyEngineService>(StrategyEngineService);
  });

  it('should analyze and create explainable strategy', async () => {
    const result = await service.analyzeAndCreateStrategy({
      organizationId: 'org-123',
      strategyType: StrategyType.AI_SEARCH,
    });

    expect(result).toBeDefined();
    expect(result?.id).toBe('strat-1');
    expect(mockAuditService.logAction).toHaveBeenCalled();
    expect(mockRootCauseEngine.diagnoseRootCauses).toHaveBeenCalledWith('org-123');
  });
});
