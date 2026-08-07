import { BrandConsistencyService } from './brand-consistency.service';

describe('BrandConsistencyService', () => {
  let service: BrandConsistencyService;

  beforeEach(() => {
    service = new BrandConsistencyService();
  });

  it('should evaluate brand name consistency across sources', () => {
    const result = service.evaluateConsistency('Dyvin AI', 'dyvin.ai', ['Dyvin AI', 'Dyvin AI Inc.']);
    expect(result.isNameConsistent).toBe(true);
    expect(result.consistencyScore).toBe(100);
  });
});
