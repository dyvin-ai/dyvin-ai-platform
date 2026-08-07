import { ImpactEngineService } from './impact-engine.service';
import { RecommendationType } from '@prisma/client';

describe('ImpactEngineService', () => {
  let service: ImpactEngineService;

  beforeEach(() => {
    service = new ImpactEngineService();
  });

  it('should estimate score gains for schema recommendations', () => {
    const impact = service.calculateImpact(RecommendationType.SCHEMA, 80);
    expect(impact.knowledgeIncrease).toBeGreaterThan(0);
    expect(impact.expectedScoreGain).toBeGreaterThan(0);
  });
});
