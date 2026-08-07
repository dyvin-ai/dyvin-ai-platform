import { EntityNormalizationService } from './entity-normalization.service';

describe('EntityNormalizationService', () => {
  let service: EntityNormalizationService;

  beforeEach(() => {
    service = new EntityNormalizationService();
  });

  it('should normalize email addresses', () => {
    expect(service.normalizeEmail('  ALEX@COMPANY.COM ')).toBe('alex@company.com');
  });

  it('should format phone numbers to E.164', () => {
    expect(service.normalizePhone('123-456-7890')).toBe('+11234567890');
    expect(service.normalizePhone('+44 20 7946 0958')).toBe('+442079460958');
  });

  it('should canonicalize company names stripping corporate suffixes', () => {
    expect(service.canonicalizeName('Dyvin AI Inc.')).toBe('dyvin ai');
    expect(service.canonicalizeName('Acme Global Corporation, LLC')).toBe('acme global');
  });
});
