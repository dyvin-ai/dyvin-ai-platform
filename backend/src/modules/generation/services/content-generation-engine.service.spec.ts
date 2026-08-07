import { getQueueToken } from '@nestjs/bullmq';
import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedContentStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { GENERATION_QUEUES } from '../generation.constants';
import { ApprovalWorkflowService } from './approval-workflow.service';
import { ContentExporterService } from './content-exporter.service';
import { ContentGenerationEngineService } from './content-generation-engine.service';
import { ContentGeneratorService } from './content-generator.service';

describe('ContentGenerationEngineService', () => {
  let service: ContentGenerationEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentGenerationEngineService,
        {
          provide: getQueueToken(GENERATION_QUEUES.CONTENT_GENERATION),
          useValue: { add: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: PrismaService,
          useValue: {
            recommendation: {
              findUnique: jest.fn().mockResolvedValue({ id: 'rec-1', title: 'Add Schema', category: 'SCHEMA', summary: 'Missing schema', analysis: { projectId: 'p-1' } }),
            },
            generatedContent: {
              create: jest.fn().mockResolvedValue({ id: 'gen-1', status: GeneratedContentStatus.DRAFT }),
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue({ id: 'gen-1', status: GeneratedContentStatus.PREVIEW }),
              update: jest.fn().mockResolvedValue({ id: 'gen-1', status: GeneratedContentStatus.PREVIEW }),
            },
            generatedAsset: { createMany: jest.fn().mockResolvedValue({ count: 3 }) },
            generationVersion: { create: jest.fn().mockResolvedValue({ id: 'ver-1' }), findMany: jest.fn().mockResolvedValue([]) },
            generationSession: { create: jest.fn().mockResolvedValue({ id: 'sess-1' }) },
          },
        },
        {
          provide: ContentGeneratorService,
          useValue: {
            generateSchemaAsset: jest.fn().mockResolvedValue({ assetType: 'JSON_LD', codeContent: '{}', exportFormat: 'json' }),
            generateSeoAsset: jest.fn().mockResolvedValue({ assetType: 'HTML', codeContent: '<meta>', exportFormat: 'html' }),
            generateFaqAsset: jest.fn().mockResolvedValue({ assetType: 'MARKDOWN', codeContent: '# FAQ', exportFormat: 'markdown' }),
          },
        },
        { provide: ApprovalWorkflowService, useValue: {} },
        { provide: ContentExporterService, useValue: {} },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<ContentGenerationEngineService>(ContentGenerationEngineService);
  });

  it('should initiate content generation and queue job', async () => {
    const res = await service.initiateContentGeneration('rec-1', 'u-1');
    expect(res.id).toBe('gen-1');
  });

  it('should process generation run and transition to PREVIEW status', async () => {
    await service.processGenerationRun('gen-1', 'rec-1');
  });
});
