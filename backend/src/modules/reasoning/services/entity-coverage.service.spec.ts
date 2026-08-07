import { EntityCoverageService } from './entity-coverage.service';
import { EntityType } from '@prisma/client';

describe('EntityCoverageService', () => {
  let service: EntityCoverageService;

  beforeEach(() => {
    service = new EntityCoverageService();
  });

  it('should calculate coverage metrics per entity type', () => {
    const coverage = service.calculateCoverage([
      { type: EntityType.COMPANY },
      { type: EntityType.PRODUCT },
      { type: EntityType.PRODUCT },
    ]);

    const companyCov = coverage.find((c) => c.entityType === EntityType.COMPANY);
    expect(companyCov?.coveragePercentage).toBe(100);

    const productCov = coverage.find((c) => c.entityType === EntityType.PRODUCT);
    expect(productCov?.totalFound).toBe(2);
  });
});
