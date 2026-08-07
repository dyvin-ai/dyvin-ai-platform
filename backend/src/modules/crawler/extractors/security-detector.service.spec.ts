import { SecurityDetectorService } from './security-detector.service';

describe('SecurityDetectorService', () => {
  let service: SecurityDetectorService;

  beforeEach(() => {
    service = new SecurityDetectorService();
  });

  it('should evaluate security headers and score correctly', () => {
    const url = 'https://dyvin.ai';
    const html = '<html><body></body></html>';
    const headers = {
      'strict-transport-security': 'max-age=31536000; includeSubDomains',
      'content-security-policy': "default-src 'self'",
      'x-frame-options': 'DENY',
    };

    const evalResult = service.evaluateSecurity(url, html, headers);

    expect(evalResult.hasHttps).toBe(true);
    expect(evalResult.hsts).toBe(true);
    expect(evalResult.csp).toBe(true);
    expect(evalResult.xFrameOptions).toBe(true);
    expect(evalResult.score).toBe(100);
  });
});
