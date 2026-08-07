import { AuthorityEngineService } from './authority-engine.service';

describe('AuthorityEngineService', () => {
  let service: AuthorityEngineService;

  beforeEach(() => {
    service = new AuthorityEngineService();
  });

  it('should evaluate authority signals and calculate score', () => {
    const result = service.evaluateAuthority(true, 90, true);
    expect(result.authorityScore).toBe(100);
    expect(result.signals.length).toBe(3);
  });
});
