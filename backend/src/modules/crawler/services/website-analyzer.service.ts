import { Injectable, Logger } from '@nestjs/common';
import { extractDomain, normalizeUrl } from '../../../common/utils/domain.util';

export interface WebsiteAnalysisResult {
  domain: string;
  normalizedUrl: string;
  title: string;
  description: string;
  headings: string[];
  keywords: string[];
  isReachable: boolean;
  rawTextSample?: string;
}

@Injectable()
export class WebsiteAnalyzerService {
  private readonly logger = new Logger(WebsiteAnalyzerService.name);

  validateDomainSafety(domainOrUrl: string): { isValid: boolean; normalizedUrl: string; domain: string; error?: string } {
    try {
      let raw = domainOrUrl.trim();
      if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
        raw = 'https://' + raw;
      }

      const urlObj = new URL(raw);
      const hostname = urlObj.hostname.toLowerCase();

      // 1. Check protocol
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return { isValid: false, normalizedUrl: '', domain: '', error: 'Only HTTP and HTTPS protocols are allowed.' };
      }

      // 2. SSRF Protection - Block private / local / loopback addresses
      const blockedHostnames = ['localhost', '127.0.0.1', '0.0.0.0', '::1', 'metadata.google.internal', '169.254.169.254'];
      if (blockedHostnames.includes(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
        return { isValid: false, normalizedUrl: '', domain: '', error: 'Access to private or local network hosts is prohibited.' };
      }

      if (/^10\./.test(hostname) || /^192\.168\./.test(hostname) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) {
        return { isValid: false, normalizedUrl: '', domain: '', error: 'Private IP space targets are prohibited.' };
      }

      // 3. Check for valid domain structure
      if (!hostname.includes('.') || hostname.startsWith('.') || hostname.endsWith('.')) {
        return { isValid: false, normalizedUrl: '', domain: '', error: 'Invalid domain structure.' };
      }

      const normalized = normalizeUrl(raw);
      const domain = extractDomain(normalized);

      return { isValid: true, normalizedUrl: normalized, domain };
    } catch (err: any) {
      return { isValid: false, normalizedUrl: '', domain: '', error: `Invalid URL: ${err.message}` };
    }
  }

  async analyzeWebsite(domainOrUrl: string, brandNameHint?: string): Promise<WebsiteAnalysisResult> {
    const safety = this.validateDomainSafety(domainOrUrl);
    if (!safety.isValid) {
      throw new Error(`Domain validation failed: ${safety.error}`);
    }

    const domain = safety.domain;
    const normalizedUrl = safety.normalizedUrl;
    let title = brandNameHint || domain;
    let description = '';
    const headings: string[] = [];
    const keywords: string[] = [];
    let isReachable = false;
    let rawTextSample = '';

    try {
      const response = await fetch(normalizedUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'DyvinAI-Bot/1.0 (+https://dyvin.ai/bot; Brand Visibility Indexer)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (response.ok) {
        isReachable = true;
        const html = await response.text();
        const htmlSlice = html.slice(0, 150000); // 150KB limit

        // 1. Extract Title
        const titleMatch = htmlSlice.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        }

        // 2. Extract Meta Description
        const descMatch = htmlSlice.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
          htmlSlice.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
        if (descMatch && descMatch[1]) {
          description = descMatch[1].trim();
        }

        // 3. Extract Headings (H1, H2)
        const h1Matches = htmlSlice.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi);
        for (const m of h1Matches) {
          if (m[1] && m[1].trim()) headings.push(m[1].trim());
        }

        const h2Matches = htmlSlice.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi);
        for (const m of h2Matches) {
          if (m[1] && m[1].trim()) headings.push(m[1].trim());
        }

        // 4. Extract Meta Keywords / OpenGraph
        const kwMatch = htmlSlice.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
        if (kwMatch && kwMatch[1]) {
          keywords.push(...kwMatch[1].split(',').map((k) => k.trim()).filter(Boolean));
        }

        // Extract simple text cues
        rawTextSample = htmlSlice
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 1000);
      }
    } catch (err: any) {
      this.logger.warn(`Website analysis fetch failed for [${normalizedUrl}]: ${err.message}. Using domain heuristics.`);
    }

    return {
      domain,
      normalizedUrl,
      title,
      description,
      headings: headings.slice(0, 8),
      keywords: keywords.slice(0, 10),
      isReachable,
      rawTextSample,
    };
  }
}
