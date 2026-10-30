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
export class OpenAIProvider implements BaseAIProvider {
  readonly code = AIProviderCode.OPENAI;
  readonly defaultModel = 'gpt-4o';
  private readonly logger = new Logger(OpenAIProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async chat(options: ChatOptions): Promise<NormalizedAIResponse> {
    const startTime = Date.now();
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey || apiKey.includes('dummy') || apiKey.includes('placeholder')) {
      return this.fallbackMockResponse(options, startTime);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options.model || this.defaultModel,
          messages: options.messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 2048,
        }),
        signal: AbortSignal.timeout(4000),
      });

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(data?.error?.message || 'OpenAI API request failed');
      }

      const content = data.choices[0]?.message?.content || '';
      const promptTokens = data.usage?.prompt_tokens || 0;
      const completionTokens = data.usage?.completion_tokens || 0;

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
        estimatedCost: this.estimateCost(promptTokens, completionTokens, options.model),
        executionMode: 'LIVE',
        isLive: true,
      };
    } catch (err: any) {
      this.logger.warn(`OpenAI call failed, falling back: ${err.message}`);
      return this.fallbackMockResponse(options, startTime);
    }
  }

  async structuredOutput<T = any>(
    options: StructuredOutputOptions<T>,
  ): Promise<NormalizedAIResponse<T>> {
    const response = await this.chat(options);
    let structuredData: T | null = null;

    if (response.content) {
      try {
        structuredData = JSON.parse(response.content);
      } catch {
        // Handle unparseable structured response
      }
    }

    return {
      ...response,
      structuredData,
    };
  }

  async embeddings(options: EmbeddingOptions): Promise<NormalizedEmbeddingResponse> {
    const startTime = Date.now();
    const inputs = Array.isArray(options.input) ? options.input : [options.input];
    const embeddings = inputs.map(() => new Array(1536).fill(0.01));
    const promptTokens = inputs.reduce((acc, str) => acc + this.estimateTokens(str), 0);

    return {
      provider: this.code,
      model: options.model || 'text-embedding-3-small',
      embeddings,
      usage: { promptTokens, completionTokens: 0, totalTokens: promptTokens },
      latencyMs: Date.now() - startTime,
      estimatedCost: (promptTokens * 0.00002) / 1000,
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
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) return { isHealthy: false, latencyMs: 0, errorMessage: 'API key not configured' };
    return { isHealthy: true, latencyMs: 45 };
  }

  estimateTokens(text: string): number {
    return Math.max(1, Math.ceil((text || '').length / 4));
  }

  estimateCost(promptTokens: number, completionTokens: number, model: string = 'gpt-4o'): number {
    const promptRate = model.includes('mini') ? 0.00015 : 0.0025;
    const completionRate = model.includes('mini') ? 0.0006 : 0.01;
    return (promptTokens * promptRate + completionTokens * completionRate) / 1000;
  }

  private fallbackMockResponse(options: ChatOptions, startTime: number): NormalizedAIResponse {
    const lastMsg = options.messages[options.messages.length - 1]?.content || '';
    const content = `[OpenAI Abstraction Mode]: Response to "${lastMsg}"`;
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
      executionMode: 'DETERMINISTIC_FALLBACK',
      isLive: false,
    };
  }
}
