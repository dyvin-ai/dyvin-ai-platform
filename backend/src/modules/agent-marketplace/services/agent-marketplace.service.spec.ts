import { Test, TestingModule } from '@nestjs/testing';
import { AgentMarketplaceService } from './agent-marketplace.service';
import { AgentSkillToolService } from './agent-skill-tool.service';
import { AgentMemoryService } from './agent-memory.service';
import { AgentPackageExportService } from './agent-package-export.service';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { ListingVisibility, MemoryScope, PricingType, SkillStatus, ToolStatus } from '@prisma/client';

describe('AgentMarketplaceService & AI Ecosystem Services', () => {
  let marketplaceService: AgentMarketplaceService;
  let skillToolService: AgentSkillToolService;
  let memoryService: AgentMemoryService;
  let packageService: AgentPackageExportService;

  const mockPrismaService = {
    marketplaceListing: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'list-1', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      findUnique: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id, title: 'SEO Agent' })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    marketplaceInstall: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'inst-1', ...data })),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    marketplaceReview: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    agentSkill: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'skill-1', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      delete: jest.fn().mockResolvedValue({ id: 'skill-1' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    toolDefinition: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'tool-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    agentMemory: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mem-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    memoryHistory: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    agentPackage: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'pkg-1', ...data })),
    },
    agentVersion: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ver-1', ...data })),
    },
  };

  const mockAuditService = { logAction: jest.fn().mockResolvedValue(true) };
  const mockFeatureFlagService = { evaluate: jest.fn().mockResolvedValue(true) };
  const mockNotificationService = { createNotification: jest.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentMarketplaceService,
        AgentSkillToolService,
        AgentMemoryService,
        AgentPackageExportService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: NotificationEngineService, useValue: mockNotificationService },
      ],
    }).compile();

    marketplaceService = module.get<AgentMarketplaceService>(AgentMarketplaceService);
    skillToolService = module.get<AgentSkillToolService>(AgentSkillToolService);
    memoryService = module.get<AgentMemoryService>(AgentMemoryService);
    packageService = module.get<AgentPackageExportService>(AgentPackageExportService);
  });

  it('should publish listing to AI Agent Marketplace', async () => {
    const listing = await marketplaceService.publishListing({
      organizationId: 'org-100',
      title: 'Perplexity Competitor Tracker Agent',
      summary: 'Autonomous competitive intelligence agent for LLM brand tracking',
      visibility: ListingVisibility.PUBLIC,
      pricingType: PricingType.FREE,
    });

    expect(listing).toBeDefined();
    expect(listing.id).toBe('list-1');
    expect(mockAuditService.logAction).toHaveBeenCalled();
  });

  it('should register reusable AI skill and sandboxed tool', async () => {
    const skill = await skillToolService.createSkill({
      organizationId: 'org-100',
      skillName: 'FAQ Content Generation Skill',
    });

    const tool = await skillToolService.createTool({
      organizationId: 'org-100',
      toolName: 'WordPress Webhook Publisher Tool',
    });

    expect(skill).toBeDefined();
    expect(skill.status).toBe(SkillStatus.ACTIVE);
    expect(tool).toBeDefined();
    expect(tool.status).toBe(ToolStatus.ACTIVE);
  });

  it('should store value in persistent agent memory scope', async () => {
    const memory = await memoryService.setMemory({
      organizationId: 'org-100',
      namespace: 'seo_rankings',
      memoryKey: 'last_citation_score',
      memoryVal: '92.4',
      scope: MemoryScope.PERSISTENT,
    });

    expect(memory).toBeDefined();
    expect(memory.scope).toBe(MemoryScope.PERSISTENT);
  });

  it('should export AI agent package JSON', async () => {
    const pkg = await packageService.exportAgentPackage({
      organizationId: 'org-100',
      packageName: 'seo_recovery_bot',
      version: '1.0.0',
    });

    expect(pkg).toBeDefined();
    expect(pkg.packageName).toBe('seo_recovery_bot');
  });
});
