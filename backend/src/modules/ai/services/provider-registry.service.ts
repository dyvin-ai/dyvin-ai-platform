import { Injectable, Logger } from '@nestjs/common';
import { AIProviderCode } from '@prisma/client';
import { BaseAIProvider } from '../providers/base-ai-provider.interface';
import { ClaudeProvider } from '../providers/claude.provider';
import { GeminiProvider } from '../providers/gemini.provider';
import { MockAIProvider } from '../providers/mock-ai.provider';
import { OpenAIProvider } from '../providers/openai.provider';
import { PerplexityProvider } from '../providers/perplexity.provider';

@Injectable()
export class ProviderRegistry {
  private readonly logger = new Logger(ProviderRegistry.name);
  private readonly providers = new Map<AIProviderCode, BaseAIProvider>();

  constructor(
    private readonly openAIProvider: OpenAIProvider,
    private readonly geminiProvider: GeminiProvider,
    private readonly claudeProvider: ClaudeProvider,
    private readonly perplexityProvider: PerplexityProvider,
    private readonly mockAIProvider: MockAIProvider,
  ) {
    this.registerProvider(this.openAIProvider);
    this.registerProvider(this.geminiProvider);
    this.registerProvider(this.claudeProvider);
    this.registerProvider(this.perplexityProvider);
    this.registerProvider(this.mockAIProvider);
  }

  registerProvider(provider: BaseAIProvider): void {
    this.providers.set(provider.code, provider);
    this.logger.log(`Registered AI provider [${provider.code}]`);
  }

  getProvider(code: AIProviderCode): BaseAIProvider {
    const provider = this.providers.get(code);
    if (!provider) {
      this.logger.warn(`Provider [${code}] not found, defaulting to MockAIProvider`);
      return this.mockAIProvider;
    }
    return provider;
  }

  getAllProviders(): BaseAIProvider[] {
    return Array.from(this.providers.values());
  }
}
