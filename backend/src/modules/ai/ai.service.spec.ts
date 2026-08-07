import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from './ai.service';
import { ClaudeProvider } from './providers/claude.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { MockAIProvider } from './providers/mock-ai.provider';
import { OpenAIProvider } from './providers/openai.provider';
import { PerplexityProvider } from './providers/perplexity.provider';
import { CostCalculator } from './services/cost-calculator.service';
import { PromptEngine } from './services/prompt-engine.service';
import { ProviderHealthMonitor } from './services/provider-health-monitor.service';
import { ProviderRegistry } from './services/provider-registry.service';
import { ProviderRouter } from './services/provider-router.service';
import { ResponseNormalizer } from './services/response-normalizer.service';
import { TokenUsageTracker } from './services/token-usage-tracker.service';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AIService', () => {
  let service: AIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        OpenAIProvider,
        GeminiProvider,
        ClaudeProvider,
        PerplexityProvider,
        MockAIProvider,
        ProviderRegistry,
        ProviderRouter,
        PromptEngine,
        ResponseNormalizer,
        CostCalculator,
        {
          provide: TokenUsageTracker,
          useValue: {
            recordUsage: jest.fn().mockResolvedValue({ requestId: 'req-1' }),
          },
        },
        ProviderHealthMonitor,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
  });

  it('should list registered providers', async () => {
    const providers = await service.getProviders();
    expect(providers.length).toBeGreaterThanOrEqual(4);
  });

  it('should execute test request through provider abstraction layer', async () => {
    const response = await service.executeTestRequest('Test Prompt');
    expect(response.content).toBeDefined();
    expect(response.provider).toBeDefined();
  });
});
