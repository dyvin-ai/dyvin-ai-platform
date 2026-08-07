import { Injectable } from '@nestjs/common';
import { ScoreCategory } from '@prisma/client';
import { PromptEngine } from '../../ai/services/prompt-engine.service';
import { ProviderRouter } from '../../ai/services/provider-router.service';

export interface ReasoningStepOutput {
  category: ScoreCategory;
  explanation: string;
  confidence: number;
  impact: string;
  priority: number;
  evidence: Array<{ evidenceText: string; sourceUrl?: string }>;
}

@Injectable()
export class ReasoningEngineService {
  constructor(
    private readonly providerRouter: ProviderRouter,
    private readonly promptEngine: PromptEngine,
  ) {}

  async generateReasoningForScore(
    category: ScoreCategory,
    score: number,
    contextData: Record<string, any>,
  ): Promise<ReasoningStepOutput> {
    const messages = this.promptEngine.buildMessages({
      systemPrompt:
        'You are Dyvin AI Chief AI Scientist. Analyze the brand visibility score and provide reasoning explanations ("WHY"), confidence, impact, priority, and evidence provenance.',
      userPrompt: `Category: ${category}, Score: ${score}/100. Context: ${JSON.stringify(contextData)}`,
      outputSchema: {
        type: 'object',
        properties: {
          explanation: { type: 'string' },
          confidence: { type: 'number' },
          impact: { type: 'string' },
          priority: { type: 'number' },
          evidence: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                evidenceText: { type: 'string' },
                sourceUrl: { type: 'string' },
              },
            },
          },
        },
      },
    });

    const aiResponse = await this.providerRouter.routeStructuredOutput<ReasoningStepOutput>({
      messages,
      schema: {},
    });

    if (aiResponse.structuredData) {
      return {
        category,
        explanation: aiResponse.structuredData.explanation || `Category ${category} received a score of ${score}/100 based on evaluated intelligence.`,
        confidence: aiResponse.structuredData.confidence || 90,
        impact: aiResponse.structuredData.impact || (score < 60 ? 'HIGH' : 'MEDIUM'),
        priority: aiResponse.structuredData.priority || (score < 60 ? 1 : 3),
        evidence: aiResponse.structuredData.evidence || [
          { evidenceText: `Scored ${score}/100 based on domain metadata & knowledge graph data.` },
        ],
      };
    }

    return {
      category,
      explanation: `Category ${category} received a score of ${score}/100 based on evaluated intelligence.`,
      confidence: 85,
      impact: score < 60 ? 'HIGH' : 'MEDIUM',
      priority: score < 60 ? 1 : 3,
      evidence: [
        { evidenceText: `Evaluated score of ${score}/100 across ${category.toLowerCase()} signals.` },
      ],
    };
  }
}
