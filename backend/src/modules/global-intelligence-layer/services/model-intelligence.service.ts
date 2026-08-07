import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ModelIntelligenceService {
  private readonly logger = new Logger(ModelIntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateModelProfile(modelName: string, provider: string, citationPref: string, avgLatencyMs: number) {
    return this.prisma.globalModelProfileRecord.create({
      data: {
        modelName,
        provider,
        hallucinationRate: 0.015,
        citationPref,
        avgLatencyMs,
      },
    });
  }

  async getModelProfiles() {
    return [
      { modelName: 'GPT-4o', provider: 'OPENAI', citationPref: 'DOCUMENTATION_PORTALS', avgLatencyMs: 410.0 },
      { modelName: 'Claude 3.5 Sonnet', provider: 'ANTHROPIC', citationPref: 'RESEARCH_PAPERS', avgLatencyMs: 490.0 },
      { modelName: 'Gemini 1.5 Pro', provider: 'GOOGLE', citationPref: 'KNOWLEDGE_BASE', avgLatencyMs: 370.0 },
    ];
  }
}
