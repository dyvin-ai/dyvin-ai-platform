import { AIProviderCode } from '@prisma/client';

export interface ChatMessage {
  role: 'system' | 'developer' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface StructuredOutputOptions<T = any> {
  model?: string;
  messages: ChatMessage[];
  schema: Record<string, any>;
  temperature?: number;
  maxTokens?: number;
}

export interface EmbeddingOptions {
  model?: string;
  input: string | string[];
}

export interface SummarizeOptions {
  model?: string;
  text: string;
  maxLengthWords?: number;
}

export interface AnalyzeOptions {
  model?: string;
  prompt: string;
  context?: Record<string, any>;
}

export interface TokenUsageMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface NormalizedAIResponse<T = any> {
  provider: AIProviderCode;
  model: string;
  content: string | null;
  structuredData: T | null;
  usage: TokenUsageMetrics;
  latencyMs: number;
  estimatedCost: number;
  executionMode?: 'LIVE' | 'DETERMINISTIC_FALLBACK' | 'SEEDED';
  isLive?: boolean;
}

export interface NormalizedEmbeddingResponse {
  provider: AIProviderCode;
  model: string;
  embeddings: number[][];
  usage: TokenUsageMetrics;
  latencyMs: number;
  estimatedCost: number;
}

export interface ProviderHealthResult {
  isHealthy: boolean;
  latencyMs: number;
  errorMessage?: string;
}

export interface BaseAIProvider {
  readonly code: AIProviderCode;
  readonly defaultModel: string;

  chat(options: ChatOptions): Promise<NormalizedAIResponse>;

  structuredOutput<T = any>(
    options: StructuredOutputOptions<T>,
  ): Promise<NormalizedAIResponse<T>>;

  embeddings(options: EmbeddingOptions): Promise<NormalizedEmbeddingResponse>;

  summarize(options: SummarizeOptions): Promise<NormalizedAIResponse>;

  analyze(options: AnalyzeOptions): Promise<NormalizedAIResponse>;

  health(): Promise<ProviderHealthResult>;

  estimateTokens(text: string): number;

  estimateCost(promptTokens: number, completionTokens: number, model?: string): number;
}
