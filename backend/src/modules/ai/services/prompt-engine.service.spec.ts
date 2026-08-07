import { PromptEngine } from './prompt-engine.service';

describe('PromptEngine', () => {
  let engine: PromptEngine;

  beforeEach(() => {
    engine = new PromptEngine();
  });

  it('should assemble system, developer, user prompts and inject Knowledge Graph context', () => {
    const messages = engine.buildMessages({
      systemPrompt: 'You are Dyvin AI Assistant.',
      developerPrompt: 'Use strict reasoning.',
      userPrompt: 'What is the company product?',
      knowledgeGraphContext: { companyName: 'Dyvin AI', product: 'Intelligence Engine' },
      outputSchema: { type: 'object', properties: { answer: { type: 'string' } } },
    });

    expect(messages).toHaveLength(3);
    expect(messages[0].role).toBe('system');
    expect(messages[0].content).toBe('You are Dyvin AI Assistant.');
    expect(messages[1].role).toBe('developer');
    expect(messages[1].content).toContain('[INJECTED KNOWLEDGE GRAPH CONTEXT]');
    expect(messages[2].role).toBe('user');
    expect(messages[2].content).toContain('Return response ONLY as valid JSON');
  });
});
