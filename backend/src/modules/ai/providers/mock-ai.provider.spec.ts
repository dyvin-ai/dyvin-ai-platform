import { AIProviderCode } from '@prisma/client';
import { MockAIProvider } from './mock-ai.provider';

describe('MockAIProvider', () => {
  let provider: MockAIProvider;

  beforeEach(() => {
    provider = new MockAIProvider();
  });

  it('should return normalized chat response with usage metrics', async () => {
    const response = await provider.chat({
      messages: [{ role: 'user', content: 'Hello Dyvin AI' }],
    });

    expect(response.provider).toBe(AIProviderCode.MOCK);
    expect(response.content).toContain('Mock AI response to: Hello Dyvin AI');
    expect(response.usage.promptTokens).toBeGreaterThan(0);
    expect(response.usage.completionTokens).toBeGreaterThan(0);
    expect(response.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('should return structured output data', async () => {
    const response = await provider.structuredOutput({
      messages: [{ role: 'user', content: 'Analyze entity' }],
      schema: { type: 'object' },
    });

    expect(response.structuredData).toBeDefined();
    expect(response.structuredData.summary).toBe('Mock structured analysis result');
  });

  it('should evaluate provider health', async () => {
    const health = await provider.health();
    expect(health.isHealthy).toBe(true);
  });
});
