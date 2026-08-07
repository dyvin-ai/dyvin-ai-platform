import { Test, TestingModule } from '@nestjs/testing';
import { CustomerWarehouseService } from './services/customer-warehouse.service';
import { CustomerTimelineService } from './services/customer-timeline.service';
import { CustomerMemoryService } from './services/customer-memory.service';
import { CustomerKnowledgeGraphService } from './services/customer-knowledge-graph.service';
import { PrivacyIsolationService } from './services/privacy-isolation.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase R.1: Enterprise Customer Intelligence Layer Spec', () => {
  let warehouseService: CustomerWarehouseService;
  let timelineService: CustomerTimelineService;
  let memoryService: CustomerMemoryService;
  let knowledgeGraphService: CustomerKnowledgeGraphService;
  let privacyService: PrivacyIsolationService;

  const mockPrismaService = {
    customerWarehouse: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'wh-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'wh-1', assetType: 'REPORT' }]),
    },
    customerTimeline: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'time-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'time-1', eventKey: 'ORGANIZATION_CREATED' }]),
    },
    customerMemory: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mem-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'mem-1', memoryType: 'STRATEGY_MEMORY' }]),
    },
    customerKnowledgeNode: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'node-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'node-1', nodeLabel: 'Document A' }]),
    },
    customerPrivacyAudit: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'audit-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerWarehouseService,
        CustomerTimelineService,
        CustomerMemoryService,
        CustomerKnowledgeGraphService,
        PrivacyIsolationService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    warehouseService = module.get<CustomerWarehouseService>(CustomerWarehouseService);
    timelineService = module.get<CustomerTimelineService>(CustomerTimelineService);
    memoryService = module.get<CustomerMemoryService>(CustomerMemoryService);
    knowledgeGraphService = module.get<CustomerKnowledgeGraphService>(CustomerKnowledgeGraphService);
    privacyService = module.get<PrivacyIsolationService>(PrivacyIsolationService);
  });

  it('should record append-only customer warehouse assets', async () => {
    const asset = await warehouseService.appendAsset('org-1', 'RESEARCH_REPORT', 'GEO Optimization Snapshot');
    expect(asset.id).toBe('wh-1');
    expect(asset.assetType).toBe('RESEARCH_REPORT');

    const warehouse = await warehouseService.getTenantWarehouse('org-1');
    expect(warehouse.length).toBeGreaterThan(0);
  });

  it('should track customer journey timeline milestones', async () => {
    const event = await timelineService.recordTimelineEvent('org-1', 'FIRST_CRAWL_COMPLETED', 'Initial domain scan performed');
    expect(event.eventKey).toBe('FIRST_CRAWL_COMPLETED');

    const timeline = await timelineService.getTimeline('org-1');
    expect(timeline.length).toBeGreaterThan(0);
  });

  it('should store and retrieve tenant-isolated customer memories', async () => {
    const mem = await memoryService.storeMemory('org-1', 'STRATEGY_MEMORY', 'Focus on Technical Docs Citation');
    expect(mem.memoryType).toBe('STRATEGY_MEMORY');

    const memories = await memoryService.getMemories('org-1');
    expect(memories.length).toBeGreaterThan(0);
  });

  it('should build customer organization knowledge graph nodes', async () => {
    const node = await knowledgeGraphService.addKnowledgeNode('org-1', 'Project Alpha', 'PROJECT_NODE');
    expect(node.nodeType).toBe('PROJECT_NODE');

    const graph = await knowledgeGraphService.getKnowledgeGraph('org-1');
    expect(graph.nodes.length).toBeGreaterThan(0);
  });

  it('should verify strict tenant isolation and zero cross-tenant leakage', async () => {
    const verification = await privacyService.verifyTenantIsolation('org-1');
    expect(verification.isolationStatus).toBe('VERIFIED_ISOLATED');
    expect(verification.crossTenantLeakageRisk).toBe(0.0);
  });
});
