import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CrossModelService {
  private readonly logger = new Logger(CrossModelService.name);

  async compareModels() {
    return [
      { provider: 'OPENAI', model: 'gpt-4o', citationPreference: 'DOCUMENTATION', avgLatencyMs: 420.0, confidence: 0.96 },
      { provider: 'ANTHROPIC', model: 'claude-3-5-sonnet', citationPreference: 'RESEARCH_PAPERS', avgLatencyMs: 510.0, confidence: 0.97 },
      { provider: 'GOOGLE', model: 'gemini-1.5-pro', citationPreference: 'PUBLIC_WEB', avgLatencyMs: 380.0, confidence: 0.94 },
      { provider: 'PERPLEXITY', model: 'sonar-pro', citationPreference: 'REALTIME_NEWS', avgLatencyMs: 620.0, confidence: 0.95 },
    ];
  }
}
