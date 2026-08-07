import { VerificationDiffEngineService } from './verification-diff-engine.service';
import { ScoreCategory, VerificationOutcome } from '@prisma/client';

describe('VerificationDiffEngineService', () => {
  let service: VerificationDiffEngineService;

  beforeEach(() => {
    service = new VerificationDiffEngineService();
  });

  it('should calculate score diffs and assign correct outcomes', () => {
    const prev = [{ category: ScoreCategory.OVERALL, score: 60 }];
    const curr = [{ category: ScoreCategory.OVERALL, score: 75 }];

    const diffs = service.compareScores(prev, curr);
    expect(diffs).toHaveLength(1);
    expect(diffs[0].delta).toBe(15);
    expect(diffs[0].outcome).toBe(VerificationOutcome.IMPROVED);
  });
});
