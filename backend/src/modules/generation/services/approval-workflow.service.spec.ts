import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedContentStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { ApprovalWorkflowService } from './approval-workflow.service';

describe('ApprovalWorkflowService', () => {
  let service: ApprovalWorkflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovalWorkflowService,
        {
          provide: PrismaService,
          useValue: {
            generatedContent: {
              findUnique: jest.fn().mockResolvedValue({ id: 'c-1', status: GeneratedContentStatus.PREVIEW }),
              update: jest.fn().mockResolvedValue({ id: 'c-1', status: GeneratedContentStatus.APPROVED }),
            },
            generationHistory: { create: jest.fn().mockResolvedValue({}) },
            approvalRequest: { create: jest.fn().mockResolvedValue({ id: 'req-1' }) },
            approvalHistory: { create: jest.fn().mockResolvedValue({}) },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<ApprovalWorkflowService>(ApprovalWorkflowService);
  });

  it('should approve content asset and update status to APPROVED', async () => {
    const res = await service.approveContent('c-1', 'u-1', 'Looks great');
    expect(res.status).toBe(GeneratedContentStatus.APPROVED);
  });
});
