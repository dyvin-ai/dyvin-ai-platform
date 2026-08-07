import { Injectable } from '@nestjs/common';
import { RecommendationType } from '@prisma/client';

export interface CalculatedImpact {
  visibilityIncrease: number;
  knowledgeIncrease: number;
  trustIncrease: number;
  authorityIncrease: number;
  expectedScoreGain: number;
}

@Injectable()
export class ImpactEngineService {
  calculateImpact(type: RecommendationType, impactScore: number): CalculatedImpact {
    let visibilityIncrease = 0;
    let knowledgeIncrease = 0;
    let trustIncrease = 0;
    let authorityIncrease = 0;

    switch (type) {
      case RecommendationType.SCHEMA:
        knowledgeIncrease = Math.round(impactScore * 0.4);
        visibilityIncrease = Math.round(impactScore * 0.3);
        authorityIncrease = Math.round(impactScore * 0.2);
        break;
      case RecommendationType.TRUST:
        trustIncrease = Math.round(impactScore * 0.5);
        authorityIncrease = Math.round(impactScore * 0.3);
        break;
      case RecommendationType.KNOWLEDGE_GRAPH:
      case RecommendationType.PRODUCT:
      case RecommendationType.SERVICE:
        knowledgeIncrease = Math.round(impactScore * 0.6);
        visibilityIncrease = Math.round(impactScore * 0.2);
        break;
      default:
        visibilityIncrease = Math.round(impactScore * 0.3);
        knowledgeIncrease = Math.round(impactScore * 0.2);
        trustIncrease = Math.round(impactScore * 0.2);
        authorityIncrease = Math.round(impactScore * 0.2);
        break;
    }

    const expectedScoreGain = Math.min(
      35,
      Math.round(
        (visibilityIncrease + knowledgeIncrease + trustIncrease + authorityIncrease) / 4,
      ),
    );

    return {
      visibilityIncrease,
      knowledgeIncrease,
      trustIncrease,
      authorityIncrease,
      expectedScoreGain,
    };
  }
}
