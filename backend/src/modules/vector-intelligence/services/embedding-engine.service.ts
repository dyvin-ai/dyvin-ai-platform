import { Injectable, Logger } from '@nestjs/common';

export type EmbeddingProvider = 'OPENAI' | 'GEMINI' | 'VOYAGE' | 'COHERE';

@Injectable()
export class EmbeddingEngineService {
  private readonly logger = new Logger(EmbeddingEngineService.name);

  async generateEmbedding(text: string, provider: EmbeddingProvider = 'OPENAI') {
    const dimension = provider === 'OPENAI' ? 1536 : provider === 'GEMINI' ? 768 : 1024;
    // Generate deterministic normalized mock float vector for test/demonstration
    const vector = Array.from({ length: dimension }, (_, i) => Math.sin(i + text.length) * 0.05);

    return {
      provider,
      model: provider === 'OPENAI' ? 'text-embedding-3-small' : 'embedding-001',
      dimension,
      tokens: Math.ceil(text.length / 4),
      vector,
      latencyMs: 24,
    };
  }

  async getProviders() {
    return [
      { provider: 'OPENAI', model: 'text-embedding-3-small', dimension: 1536, active: true },
      { provider: 'GEMINI', model: 'text-embedding-004', dimension: 768, active: true },
      { provider: 'VOYAGE', model: 'voyage-3-large', dimension: 1024, active: true },
      { provider: 'COHERE', model: 'embed-english-v3.0', dimension: 1024, active: true },
    ];
  }
}
