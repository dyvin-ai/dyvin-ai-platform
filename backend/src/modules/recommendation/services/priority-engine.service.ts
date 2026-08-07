import { Injectable } from '@nestjs/common';
import { GapSeverity, RecommendationPriority } from '@prisma/client';

@Injectable()
export class PriorityEngineService {
  calculatePriority(severity: GapSeverity, impactScore: number): RecommendationPriority {
    if (severity === GapSeverity.CRITICAL || impactScore >= 75) {
      return RecommendationPriority.CRITICAL;
    }
    if (severity === GapSeverity.HIGH || impactScore >= 50) {
      return RecommendationPriority.HIGH;
    }
    if (severity === GapSeverity.MEDIUM || impactScore >= 30) {
      return RecommendationPriority.MEDIUM;
    }
    return RecommendationPriority.LOW;
  }
}
