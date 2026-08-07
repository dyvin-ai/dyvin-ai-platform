import { Injectable } from '@nestjs/common';

export interface AuthorityEvaluation {
  authorityScore: number;
  signals: Array<{ signalType: string; strength: number; description: string }>;
}

@Injectable()
export class AuthorityEngineService {
  evaluateAuthority(
    hasHttps: boolean,
    securityScore: number,
    hasSchema: boolean,
  ): AuthorityEvaluation {
    const signals: Array<{ signalType: string; strength: number; description: string }> = [];

    if (hasHttps) {
      signals.push({
        signalType: 'HTTPS_ENCRYPTION',
        strength: 90,
        description: 'Site is served securely over HTTPS with TLS transport encryption.',
      });
    }

    if (hasSchema) {
      signals.push({
        signalType: 'STRUCTURED_ENTITY_MARKUP',
        strength: 85,
        description: 'JSON-LD schema markup defines explicit machine-readable entities.',
      });
    }

    if (securityScore >= 80) {
      signals.push({
        signalType: 'STRONG_SECURITY_HEADERS',
        strength: 80,
        description: 'Security headers (HSTS, CSP, X-Frame-Options) properly configured.',
      });
    }

    const authorityScore = Math.min(100, Math.round((signals.length / 3) * 100));

    return {
      authorityScore,
      signals,
    };
  }
}
