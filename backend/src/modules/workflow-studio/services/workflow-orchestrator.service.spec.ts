import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowOrchestratorService } from './workflow-orchestrator.service';
import { WorkflowTemplateService } from './workflow-template.service';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { WorkflowExecutionMode, WorkflowNodeType, WorkflowStatus } from '@prisma/client';

describe('WorkflowOrchestratorService & WorkflowTemplateService', () => {
  let orchestrator: WorkflowOrchestratorService;
  let templateService: WorkflowTemplateService;

  const mockPrismaService = {
    workflow: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'wf-1', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      findUnique: jest.fn().mockImplementation(({ where }) =>
        Promise.resolve({
          id: where.id,
          name: 'Visual Automation',
          status: WorkflowStatus.ACTIVE,
          nodes: [],
          edges: [],
        }),
      ),
      findMany: jest.fn().mockResolvedValue([]),
    },
    workflowExecution: {
      create: jest.fn().mockResolvedValue({ id: 'exec-1', status: WorkflowStatus.RUNNING }),
      update: jest.fn().mockResolvedValue({ id: 'exec-1', status: WorkflowStatus.COMPLETED }),
      findUnique: jest.fn().mockResolvedValue({ id: 'exec-1', status: WorkflowStatus.COMPLETED, steps: [], logs: [] }),
    },
    workflowTemplate: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockAuditService = { logAction: jest.fn().mockResolvedValue(true) };
  const mockFeatureFlagService = { evaluate: jest.fn().mockResolvedValue(true) };
  const mockNotificationService = { createNotification: jest.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowOrchestratorService,
        WorkflowTemplateService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: NotificationEngineService, useValue: mockNotificationService },
      ],
    }).compile();

    orchestrator = module.get<WorkflowOrchestratorService>(WorkflowOrchestratorService);
    templateService = module.get<WorkflowTemplateService>(WorkflowTemplateService);
  });

  it('should create a visual process workflow with DAG nodes', async () => {
    const result = await orchestrator.createWorkflow({
      organizationId: 'org-123',
      name: 'Visual Recover Visibility Process',
      nodes: [
        { label: 'Website Added', nodeType: WorkflowNodeType.TRIGGER },
        { label: 'Run AI Search Scan', nodeType: WorkflowNodeType.ACTION },
      ],
    });

    expect(result).toBeDefined();
    expect(result.id).toBe('wf-1');
    expect(mockAuditService.logAction).toHaveBeenCalled();
  });

  it('should execute workflow and complete execution run', async () => {
    const result = await orchestrator.runWorkflow('wf-1');

    expect(result).toBeDefined();
    expect(result?.status).toBe(WorkflowStatus.COMPLETED);
  });

  it('should return reusable workflow templates', async () => {
    const templates = await templateService.getTemplates();

    expect(templates).toBeDefined();
    expect(templates.length).toBeGreaterThan(0);
  });
});
