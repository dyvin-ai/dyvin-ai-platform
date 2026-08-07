import { Injectable } from '@nestjs/common';
import { AIProviderCode, AIRequestType } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ProviderHealthMonitor } from './services/provider-health-monitor.service';
import { ProviderRegistry } from './services/provider-registry.service';
import { ProviderRouter } from './services/provider-router.service';
import { ResponseNormalizer } from './services/response-normalizer.service';
import { TokenUsageTracker } from './services/token-usage-tracker.service';

@Injectable()
export class AIService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: ProviderRegistry,
    private readonly router: ProviderRouter,
    private readonly normalizer: ResponseNormalizer,
    private readonly tracker: TokenUsageTracker,
    private readonly healthMonitor: ProviderHealthMonitor,
  ) {}

  async getProviders() {
    const providers = this.registry.getAllProviders();
    return providers.map((p) => ({
      code: p.code,
      defaultModel: p.defaultModel,
    }));
  }

  async getModels() {
    return [
      {
        provider: AIProviderCode.OPENAI,
        code: 'gpt-4o',
        name: 'GPT-4o',
        costPer1kPrompt: 0.0025,
        costPer1kCompletion: 0.01,
      },
      {
        provider: AIProviderCode.GEMINI,
        code: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        costPer1kPrompt: 0.00125,
        costPer1kCompletion: 0.00375,
      },
      {
        provider: AIProviderCode.CLAUDE,
        code: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        costPer1kPrompt: 0.003,
        costPer1kCompletion: 0.015,
      },
      {
        provider: AIProviderCode.PERPLEXITY,
        code: 'sonar-pro',
        name: 'Sonar Pro',
        costPer1kPrompt: 0.003,
        costPer1kCompletion: 0.015,
      },
    ];
  }

  async checkHealth() {
    return this.healthMonitor.checkAllProviders();
  }

  async executeTestRequest(prompt: string, preferredProvider?: AIProviderCode) {
    const providerCode = preferredProvider || AIProviderCode.MOCK;
    const response = await this.router.routeChat(
      {
        messages: [{ role: 'user', content: prompt }],
      },
      providerCode,
    );

    const normalized = this.normalizer.normalize(response);

    await this.tracker.recordUsage({
      providerCode: normalized.provider,
      modelCode: normalized.model,
      requestType: AIRequestType.CHAT,
      response: normalized,
    });

    return normalized;
  }
}
