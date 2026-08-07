import { Injectable } from '@nestjs/common';
import { ScoreCategory } from '@prisma/client';

export interface ScanAndKnowledgeData {
  scanPagesCount: number;
  hasSchema: boolean;
  hasHttps: boolean;
  securityScore: number;
  entityCount: number;
  factCount: number;
  hasProducts: boolean;
  hasServices: boolean;
  hasFaqs: boolean;
}

export interface CalculatedScores {
  overallScore: number;
  categoryScores: Record<ScoreCategory, number>;
}

@Injectable()
export class ScoringEngineService {
  calculateScores(data: ScanAndKnowledgeData): CalculatedScores {
    const technical = Math.min(100, Math.round((data.hasHttps ? 50 : 0) + data.securityScore * 0.5));
    const schema = data.hasSchema ? 85 : 30;
    const completeness = Math.min(100, Math.round((data.entityCount * 15 + data.factCount * 5) / Math.max(1, data.scanPagesCount)));
    const knowledge = Math.min(100, Math.round((data.factCount > 0 ? 60 : 20) + (data.hasProducts ? 20 : 0) + (data.hasServices ? 20 : 0)));
    const authority = Math.min(100, Math.round(technical * 0.6 + (data.hasSchema ? 40 : 10)));
    const trust = Math.min(100, Math.round((data.hasHttps ? 40 : 0) + (data.hasFaqs ? 30 : 10) + (data.securityScore > 80 ? 30 : 10)));
    const consistency = Math.min(100, Math.round((data.hasSchema ? 50 : 20) + (data.entityCount > 0 ? 50 : 20)));
    const content = Math.min(100, Math.round(data.scanPagesCount * 25));

    const overallScore = Math.round(
      (knowledge * 0.2 +
        authority * 0.15 +
        trust * 0.15 +
        consistency * 0.1 +
        completeness * 0.1 +
        technical * 0.1 +
        content * 0.1 +
        schema * 0.1),
    );

    const categoryScores: Record<ScoreCategory, number> = {
      OVERALL: overallScore,
      KNOWLEDGE: knowledge,
      AUTHORITY: authority,
      TRUST: trust,
      CONSISTENCY: consistency,
      COMPLETENESS: completeness,
      TECHNICAL: technical,
      CONTENT: content,
      SCHEMA: schema,
    };

    return { overallScore, categoryScores };
  }
}
