import { Injectable, Logger } from '@nestjs/common';
import { AIProviderCode } from '@prisma/client';
import {
  ChatOptions,
  NormalizedAIResponse,
  StructuredOutputOptions,
} from '../providers/base-ai-provider.interface';
import { ProviderRegistry } from './provider-registry.service';

@Injectable()
export class ProviderRouter {
  private readonly logger = new Logger(ProviderRouter.name);

  constructor(private readonly registry: ProviderRegistry) {}

  async routeChat(
    options: ChatOptions,
    preferredProvider?: AIProviderCode,
  ): Promise<NormalizedAIResponse> {
    const providerCode = preferredProvider || AIProviderCode.OPENAI;
    const provider = this.registry.getProvider(providerCode);

    try {
      return await provider.chat(options);
    } catch (err: any) {
      this.logger.warn(`Primary provider [${providerCode}] failed, trying fallback MOCK: ${err.message}`);
      const fallbackProvider = this.registry.getProvider(AIProviderCode.MOCK);
      return fallbackProvider.chat(options);
    }
  }

  async routeStructuredOutput<T = any>(
    options: StructuredOutputOptions<T>,
    preferredProvider?: AIProviderCode,
  ): Promise<NormalizedAIResponse<T>> {
    const providerCode = preferredProvider || AIProviderCode.OPENAI;
    const provider = this.registry.getProvider(providerCode);

    try {
      return await provider.structuredOutput<T>(options);
    } catch (err: any) {
      this.logger.warn(`Structured output failed for [${providerCode}], falling back to MOCK: ${err.message}`);
      const fallbackProvider = this.registry.getProvider(AIProviderCode.MOCK);
      return fallbackProvider.structuredOutput<T>(options);
    }
  }
}
