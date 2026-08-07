import { AIProviderCode } from '@prisma/client';
import { ResponseNormalizer } from './response-normalizer.service';

describe('ResponseNormalizer', () => {
  let normalizer: ResponseNormalizer;

  beforeEach(() => {
    normalizer = new ResponseNormalizer();
  });

  it('should normalize vendor responses into uniform internal format', () => {
    const raw = {
      provider: AIProviderCode.OPENAI,
      model: 'gpt-4o',
      content: '  Trimmed Content  ',
      structuredData: { key: 'val' },
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
      latencyMs: 150,
      estimatedCost: 0.0005,
    };

    const normalized = normalizer.normalize(raw);

    expect(normalized.content).toBe('Trimmed Content');
    expect(normalized.usage.totalTokens).toBe(30);
    expect(normalized.latencyMs).toBe(150);
  });
});
