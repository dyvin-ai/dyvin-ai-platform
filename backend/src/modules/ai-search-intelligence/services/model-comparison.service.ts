import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ModelComparisonService {
  private readonly logger = new Logger(ModelComparisonService.name);

  constructor(private readonly prisma: PrismaService) {}

  async compareModels() {
    return [
      { modelName: 'ChatGPT (GPT-4o)', visibilityPct: 88.4, citationPct: 91.2 },
      { modelName: 'Claude 3.5 Sonnet', visibilityPct: 86.1, citationPct: 89.5 },
      { modelName: 'Gemini 1.5 Pro', visibilityPct: 84.0, citationPct: 87.8 },
      { modelName: 'Perplexity AI', visibilityPct: 92.5, citationPct: 94.0 },
    ];
  }
}
