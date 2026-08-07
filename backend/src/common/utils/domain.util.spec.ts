import {
  extractDomain,
  extractSubdomain,
  generateCanonicalUrl,
  normalizeUrl,
  validateDomain,
} from './domain.util';

describe('Domain & URL Utilities', () => {
  describe('normalizeUrl', () => {
    it('should prepend https protocol and lowercase hostname', () => {
      const input = 'DYVIN.AI/dashboard/';
      const normalized = normalizeUrl(input);
      expect(normalized).toBe('https://dyvin.ai/dashboard');
    });

    it('should preserve existing http protocol', () => {
      const input = 'http://example.com/test/';
      const normalized = normalizeUrl(input);
      expect(normalized).toBe('http://example.com/test');
    });

    it('should throw Error for invalid URL strings', () => {
      expect(() => normalizeUrl('')).toThrow();
    });
  });

  describe('validateDomain', () => {
    it('should validate valid domains', () => {
      expect(validateDomain('dyvin.ai')).toBe(true);
      expect(validateDomain('sub.domain.co.uk')).toBe(true);
    });

    it('should reject invalid domains', () => {
      expect(validateDomain('invalid_domain')).toBe(false);
      expect(validateDomain('http://dyvin.ai')).toBe(false);
    });
  });

  describe('extractDomain', () => {
    it('should extract apex domain correctly', () => {
      expect(extractDomain('https://app.staging.dyvin.ai/dashboard')).toBe(
        'dyvin.ai',
      );
      expect(extractDomain('https://dyvin.ai')).toBe('dyvin.ai');
    });
  });

  describe('extractSubdomain', () => {
    it('should extract subdomain when present', () => {
      expect(extractSubdomain('https://app.dyvin.ai')).toBe('app');
      expect(extractSubdomain('https://staging.api.dyvin.ai')).toBe(
        'staging.api',
      );
    });

    it('should return null for apex domain', () => {
      expect(extractSubdomain('https://dyvin.ai')).toBeNull();
    });
  });

  describe('generateCanonicalUrl', () => {
    it('should strip query parameters and hash fragments', () => {
      const raw = 'https://dyvin.ai/pricing?ref=google#features';
      const canonical = generateCanonicalUrl(raw);
      expect(canonical).toBe('https://dyvin.ai/pricing');
    });
  });
});
