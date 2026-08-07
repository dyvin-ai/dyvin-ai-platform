import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AI_QUEUES } from './ai.constants';
import { AIController } from './ai.controller';
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
import { RetryManager } from './services/retry-manager.service';
import { TokenUsageTracker } from './services/token-usage-tracker.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: AI_QUEUES.REQUEST },
      { name: AI_QUEUES.RETRY },
      { name: AI_QUEUES.BATCH },
    ),
  ],
  controllers: [AIController],
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
    TokenUsageTracker,
    RetryManager,
    ProviderHealthMonitor,
  ],
  exports: [
    AIService,
    ProviderRegistry,
    ProviderRouter,
    PromptEngine,
    ResponseNormalizer,
    CostCalculator,
    TokenUsageTracker,
    RetryManager,
    ProviderHealthMonitor,
  ],
})
export class AIModule {}
