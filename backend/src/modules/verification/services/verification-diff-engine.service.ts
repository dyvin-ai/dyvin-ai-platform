import { Injectable } from '@nestjs/common';
import { ScoreCategory, VerificationOutcome } from '@prisma/client';

export interface CategoryScoreDiff {
  category: ScoreCategory;
  previousScore: number;
  currentScore: number;
  delta: number;
  percentageChange: number;
  outcome: VerificationOutcome;
}

@Injectable()
export class VerificationDiffEngineService {
  compareScores(
    previousScores: Array<{ category: ScoreCategory; score: number }>,
    currentScores: Array<{ category: ScoreCategory; score: number }>,
  ): CategoryScoreDiff[] {
    const prevMap = new Map<ScoreCategory, number>();
    previousScores.forEach((s) => prevMap.set(s.category, s.score));

    return currentScores.map((curr) => {
      const prevScore = prevMap.get(curr.category) || 0;
      const delta = curr.score - prevScore;
      const percentageChange = prevScore > 0 ? Number(((delta / prevScore) * 100).toFixed(2)) : delta > 0 ? 100 : 0;

      let outcome: VerificationOutcome = VerificationOutcome.NO_CHANGE;
      if (delta > 0) outcome = VerificationOutcome.IMPROVED;
      if (delta < 0) outcome = VerificationOutcome.REGRESSED;

      return {
        category: curr.category,
        previousScore: prevScore,
        currentScore: curr.score,
        delta,
        percentageChange,
        outcome,
      };
    });
  }
}
