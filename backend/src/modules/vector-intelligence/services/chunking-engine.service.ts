import { Injectable, Logger } from '@nestjs/common';

export type ChunkingStrategy = 'FIXED' | 'RECURSIVE' | 'SEMANTIC' | 'MARKDOWN';

@Injectable()
export class ChunkingEngineService {
  private readonly logger = new Logger(ChunkingEngineService.name);

  async chunkDocument(content: string, strategy: ChunkingStrategy = 'RECURSIVE', maxChunkTokens = 500) {
    const words = content.split(/\s+/);
    const chunkSize = Math.ceil(maxChunkTokens * 0.75); // approx words
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunkText = words.slice(i, i + chunkSize).join(' ');
      chunks.push({
        chunkIndex: chunks.length,
        chunkContent: chunkText,
        tokenCount: Math.ceil(chunkText.length / 4),
        strategy,
      });
    }

    return chunks;
  }
}
