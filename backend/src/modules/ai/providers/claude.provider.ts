import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
export class ClaudeProvider implements BaseAIProvider {
  readonly code = AIProviderCode.CLAUDE;
  readonly defaultModel = 'claude-3-5-sonnet';
  private readonly logger = new Logger(ClaudeProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async chat(options: ChatOptions): Promise<NormalizedAIResponse> {
    const startTime = Date.now();
    const lastMsg = options.messages[options.messages.length - 1]?.content || '';
    const content = `[Anthropic Claude Mode]: Response to "${lastMsg}"`;
    const promptTokens = this.estimateTokens(lastMsg);
    const completionTokens = this.estimateTokens(content);

    return {
      provider: this.code,
      model: options.model || this.defaultModel,
      content,
      structuredData: null,
      usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens },
      latencyMs: Date.now() - startTime,
      estimatedCost: this.estimateCost(promptTokens, completionTokens, options.model),
    };
  }

  async structuredOutput<T = any>(
    options: StructuredOutputOptions<T>,
  ): Promise<NormalizedAIResponse<T>> {
    const res = await this.chat(options);
    return { ...res, structuredData: null };
  }

  async embeddings(options: EmbeddingOptions): Promise<NormalizedEmbeddingResponse> {
    const startTime = Date.now();
    const inputs = Array.isArray(options.input) ? options.input : [options.input];
    return {
      provider: this.code,
      model: options.model || 'claude-embedding-v1',
      embeddings: inputs.map(() => new Array(1536).fill(0.01)),
      usage: { promptTokens: 20, completionTokens: 0, totalTokens: 20 },
      latencyMs: Date.now() - startTime,
      estimatedCost: 0,
    };
  }

  async summarize(options: SummarizeOptions): Promise<NormalizedAIResponse> {
    return this.chat({ messages: [{ role: 'user', content: options.text }] });
  }

  async analyze(options: AnalyzeOptions): Promise<NormalizedAIResponse> {
    return this.chat({ messages: [{ role: 'user', content: options.prompt }] });
  }

  async health(): Promise<ProviderHealthResult> {
    return { isHealthy: true, latencyMs: 42 };
  }

  estimateTokens(text: string): number {
    return Math.max(1, Math.ceil((text || '').length / 4));
  }

  estimateCost(promptTokens: number, completionTokens: number, _model?: string): number {
    return (promptTokens * 0.003 + completionTokens * 0.015) / 1000;
  }
}
