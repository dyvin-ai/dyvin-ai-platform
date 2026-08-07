import { Injectable } from '@nestjs/common';
import { AIProviderCode } from '@prisma/client';
import {
  AnalyzeOptions,
  BaseAIProvider,
  ChatOptions,
  EmbeddingOptions,
  NormalizedAIResponse,
  NormalizedEmbeddingResponse,
  ProviderHealthResult,
  StructuredOutputOptions,
  SummarizeOptions,
} from './base-ai-provider.interface';

@Injectable()
export class MockAIProvider implements BaseAIProvider {
  readonly code = AIProviderCode.MOCK;
  readonly defaultModel = 'mock-v1';

  async chat(options: ChatOptions): Promise<NormalizedAIResponse> {
    const startTime = Date.now();
    const lastMessage = options.messages[options.messages.length - 1]?.content || '';
    const content = `Mock AI response to: ${lastMessage}`;
    const promptTokens = this.estimateTokens(lastMessage);
    const completionTokens = this.estimateTokens(content);
    const latencyMs = Date.now() - startTime;

    return {
      provider: this.code,
      model: options.model || this.defaultModel,
      content,
      structuredData: null,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      latencyMs,
      estimatedCost: this.estimateCost(promptTokens, completionTokens),
    };
  }

  async structuredOutput<T = any>(
    options: StructuredOutputOptions<T>,
  ): Promise<NormalizedAIResponse<T>> {
    const startTime = Date.now();
    const mockStructured = {
      summary: 'Mock structured analysis result',
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
    } as unknown as T;

    const content = JSON.stringify(mockStructured);
    const promptTokens = 50;
    const completionTokens = 30;
    const latencyMs = Date.now() - startTime;

    return {
      provider: this.code,
      model: options.model || this.defaultModel,
      content,
      structuredData: mockStructured,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      latencyMs,
      estimatedCost: this.estimateCost(promptTokens, completionTokens),
    };
  }

  async embeddings(options: EmbeddingOptions): Promise<NormalizedEmbeddingResponse> {
    const startTime = Date.now();
    const inputs = Array.isArray(options.input) ? options.input : [options.input];
    const embeddings = inputs.map(() => new Array(1536).fill(0.01));
    const promptTokens = inputs.reduce((acc, str) => acc + this.estimateTokens(str), 0);
    const latencyMs = Date.now() - startTime;

    return {
      provider: this.code,
      model: options.model || 'mock-embedding-v1',
      embeddings,
      usage: {
        promptTokens,
        completionTokens: 0,
        totalTokens: promptTokens,
      },
      latencyMs,
      estimatedCost: 0,
    };
  }

  async summarize(options: SummarizeOptions): Promise<NormalizedAIResponse> {
    return this.chat({
      model: options.model,
      messages: [{ role: 'user', content: `Summarize: ${options.text}` }],
    });
  }

  async analyze(options: AnalyzeOptions): Promise<NormalizedAIResponse> {
    return this.chat({
      model: options.model,
      messages: [{ role: 'user', content: options.prompt }],
    });
  }

  async health(): Promise<ProviderHealthResult> {
    return { isHealthy: true, latencyMs: 5 };
  }

  estimateTokens(text: string): number {
    return Math.max(1, Math.ceil((text || '').length / 4));
  }

  estimateCost(promptTokens: number, completionTokens: number): number {
    return (promptTokens * 0.0015 + completionTokens * 0.002) / 1000;
  }
}
