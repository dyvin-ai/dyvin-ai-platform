import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AIEconomicsService {
  private readonly logger = new Logger(AIEconomicsService.name);

  async getAIEconomics() {
    return {
      monthlyAITokenCostUsd: 3420.5,
      costPerPromptUsd: 0.0024,
      costPerWorkspaceUsd: 0.38,
      costPerOrganizationUsd: 2.41,
      providerCostBreakdown: {
        openAiUsd: 1850.2,
        anthropicClaudeUsd: 820.0,
        googleGeminiUsd: 315.0,
        perplexityUsd: 435.3,
      },
      roiMultiplier: 18.5,
      grossMarginPercent: 82.5,
    };
  }
}
