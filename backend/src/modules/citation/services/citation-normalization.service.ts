import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CitationNormalizationService {
  private readonly logger = new Logger(CitationNormalizationService.name);

  normalizeUrl(rawUrl: string): { canonicalUrl: string; domain: string; apexDomain: string; path: string } {
    try {
      let cleaned = rawUrl.trim();
      if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
        cleaned = `https://${cleaned}`;
      }

      const urlObj = new URL(cleaned);
      urlObj.hash = ''; // Remove fragments
      urlObj.search = ''; // Strip query parameters for canonical representation

      let path = urlObj.pathname;
      if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      urlObj.pathname = path;

      const domain = urlObj.hostname.toLowerCase().replace(/^www\./, '');
      const domainParts = domain.split('.');
      const apexDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : domain;

      return {
        canonicalUrl: urlObj.toString(),
        domain,
        apexDomain,
        path,
      };
    } catch {
      return {
        canonicalUrl: rawUrl,
        domain: 'unknown.com',
        apexDomain: 'unknown.com',
        path: '/',
      };
    }
  }
}
