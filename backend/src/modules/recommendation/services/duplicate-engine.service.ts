import { Injectable } from '@nestjs/common';
import { RecommendationType } from '@prisma/client';

export interface DraftRecommendation {
  category: RecommendationType;
  title: string;
  summary: string;
  problem: string;
  whyItMatters: string;
  impactScore: number;
}

@Injectable()
export class DuplicateEngineService {
  deduplicate(recommendations: DraftRecommendation[]): DraftRecommendation[] {
    const unique = new Map<string, DraftRecommendation>();

    recommendations.forEach((rec) => {
      const key = `${rec.category}_${rec.title.toLowerCase().trim()}`;
      if (!unique.has(key)) {
        unique.set(key, rec);
      }
    });

    return Array.from(unique.values());
  }
}
