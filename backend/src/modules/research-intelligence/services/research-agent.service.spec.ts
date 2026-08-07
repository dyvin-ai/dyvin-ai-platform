import { Test, TestingModule } from '@nestjs/testing';
import { ResearchAgentService } from './research-agent.service';
import { DiscoveryEngineService } from './discovery-engine.service';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { ResearchPriority, ResearchStatus } from '@prisma/client';

describe('ResearchAgentService & DiscoveryEngineService', () => {
  let agentService: ResearchAgentService;
  let discoveryService: DiscoveryEngineService;

  const mockPrismaService = {
    researchProject: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'proj-1', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      findUnique: jest.fn().mockImplementation(({ where }) =>
        Promise.resolve({
          id: where.id,
          title: 'Automated AI Research',
          status: ResearchStatus.COMPLETED,
          topics: [],
          findings: [],
          reports: [],
        }),
      ),
      findMany: jest.fn().mockResolvedValue([]),
    },
    researchTopic: {
      create: jest.fn().mockResolvedValue({ id: 'topic-1', name: 'AI Search Discoveries' }),
    },
    researchFinding: {
      create: jest.fn().mockResolvedValue({ id: 'find-1', title: 'Competitor Discovery' }),
    },
    researchQuestion: {
      create: jest.fn().mockResolvedValue({ id: 'q-1', questionText: 'What changed?' }),
    },
    researchAnswer: {
      create: jest.fn().mockResolvedValue({ id: 'ans-1', answerText: 'Citation share grew +14%.' }),
    },
    researchHistory: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockAuditService = { logAction: jest.fn().mockResolvedValue(true) };
  const mockFeatureFlagService = { evaluate: jest.fn().mockResolvedValue(true) };
  const mockNotificationService = { createNotification: jest.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResearchAgentService,
        DiscoveryEngineService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: NotificationEngineService, useValue: mockNotificationService },
      ],
    }).compile();

    agentService = module.get<ResearchAgentService>(ResearchAgentService);
    discoveryService = module.get<DiscoveryEngineService>(DiscoveryEngineService);
  });

  it('should answer executive research queries', async () => {
    const result = await agentService.answerQuestion('What changed in AI Search visibility?');

    expect(result).toBeDefined();
    expect(result.answer.answerText).toContain('Citation share grew +14%');
  });

  it('should run discovery project and generate findings', async () => {
    const result = await discoveryService.runDiscoveryProject({
      organizationId: 'org-123',
      title: 'Automated AI Research',
    });

    expect(result).toBeDefined();
    expect(result?.id).toBe('proj-1');
    expect(mockAuditService.logAction).toHaveBeenCalled();
  });
});
