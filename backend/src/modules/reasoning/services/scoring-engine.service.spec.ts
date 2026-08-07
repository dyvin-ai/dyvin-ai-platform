import { ScoringEngineService } from './scoring-engine.service';

describe('ScoringEngineService', () => {
  let service: ScoringEngineService;

  beforeEach(() => {
    service = new ScoringEngineService();
  });

  it('should calculate 0-100 scores across all 9 categories', () => {
    const result = service.calculateScores({
      scanPagesCount: 5,
      hasSchema: true,
      hasHttps: true,
      securityScore: 90,
      entityCount: 3,
      factCount: 8,
      hasProducts: true,
      hasServices: true,
      hasFaqs: true,
    });

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.categoryScores.KNOWLEDGE).toBeDefined();
    expect(result.categoryScores.AUTHORITY).toBeDefined();
    expect(result.categoryScores.TRUST).toBeDefined();
    expect(result.categoryScores.SCHEMA).toBe(85);
  });
});
