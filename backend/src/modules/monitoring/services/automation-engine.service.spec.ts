import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { AutomationEngineService } from './automation-engine.service';
import { AutomationStatus } from '@prisma/client';

describe('AutomationEngineService', () => {
  let service: AutomationEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomationEngineService,
        {
          provide: PrismaService,
          useValue: {
            automationRule: { findMany: jest.fn().mockResolvedValue([]) },
            automationHistory: { create: jest.fn().mockResolvedValue({}) },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<AutomationEngineService>(AutomationEngineService);
  });

  it('should trigger automated pipeline steps', async () => {
    const res = await service.triggerAutomatedPipeline('proj-1', 'STRUCTURED_DATA_CHANGE');
    expect(res.status).toBe(AutomationStatus.SUCCESS);
    expect(res.pipelineTriggers).toContain('WEBSITE_RESCAN');
  });
});
