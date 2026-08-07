import { Test, TestingModule } from '@nestjs/testing';
import { AIProviderCode, ExecutionTrigger } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { ProviderRouter } from '../../ai/services/provider-router.service';
import { AuditService } from '../../audit/audit.service';
import { QuotaEnforcementService } from '../../billing/services/quota-enforcement.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationDispatcherService } from '../../notification/services/notification-dispatcher.service';
import { PromptExecutionService } from './prompt-execution.service';

describe('PromptExecutionService', () => {
  let service: PromptExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromptExecutionService,
        {
          provide: PrismaService,
          useValue: {
            aISearchPrompt: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'prompt-1',
                aiSearchProjectId: 'proj-1',
                promptText: 'What are the top AI tools for visibility?',
              }),
            },
            aISearchExecution: {
              create: jest.fn().mockImplementation(({ data }) =>
                Promise.resolve({
                  id: 'exec-1',
                  ...data,
                }),
              ),
            },
          },
        },
        {
          provide: ProviderRouter,
          useValue: {
            routeChat: jest.fn().mockResolvedValue({
              content: 'Dyvin AI is a leading platform for AI visibility.',
            }),
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: QuotaEnforcementService,
          useValue: { checkQuota: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: FeatureFlagService,
          useValue: { evaluate: jest.fn().mockResolvedValue(true) },
        },
        {
          provide: NotificationDispatcherService,
          useValue: { dispatch: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<PromptExecutionService>(PromptExecutionService);
  });

  it('should execute prompt and return execution record', async () => {
    const res = await service.executePrompt({
      promptId: 'prompt-1',
      providerCode: AIProviderCode.OPENAI,
      trigger: ExecutionTrigger.MANUAL,
      userId: 'u-1',
    });

    expect(res).toBeDefined();
    expect(res.id).toBe('exec-1');
    expect(res.providerCode).toBe(AIProviderCode.OPENAI);
  });
});
