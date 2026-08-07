import { PriorityEngineService } from './priority-engine.service';
import { GapSeverity, RecommendationPriority } from '@prisma/client';

describe('PriorityEngineService', () => {
  let service: PriorityEngineService;

  beforeEach(() => {
    service = new PriorityEngineService();
  });

  it('should calculate priority based on severity and impact score', () => {
    expect(service.calculatePriority(GapSeverity.CRITICAL, 50)).toBe(RecommendationPriority.CRITICAL);
    expect(service.calculatePriority(GapSeverity.HIGH, 75)).toBe(RecommendationPriority.CRITICAL);
    expect(service.calculatePriority(GapSeverity.HIGH, 65)).toBe(RecommendationPriority.HIGH);
    expect(service.calculatePriority(GapSeverity.MEDIUM, 45)).toBe(RecommendationPriority.MEDIUM);
  });
});
