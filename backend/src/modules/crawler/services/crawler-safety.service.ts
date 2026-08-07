import { Injectable, Logger } from '@nestjs/common';

export interface CrawlerSafetyOptions {
  maxDepth?: number;
  maxRedirects?: number;
  maxPageSizeBytes?: number;
  blockedExtensions?: string[];
  requestTimeoutMs?: number;
}

@Injectable()
export class CrawlerSafetyService {
  private readonly logger = new Logger(CrawlerSafetyService.name);
  private readonly defaultOptions: Required<CrawlerSafetyOptions> = {
    maxDepth: 5,
    maxRedirects: 3,
    maxPageSizeBytes: 10 * 1024 * 1024, // 10MB
    blockedExtensions: ['.pdf', '.zip', '.exe', '.mp4', '.mp3', '.tar.gz', '.iso', '.dmg'],
    requestTimeoutMs: 10000, // 10s
  };

  validateUrlSafety(url: string, currentDepth: number = 0): { isAllowed: boolean; reason?: string } {
    try {
      const parsed = new URL(url);

      // 1. Check protocol
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { isAllowed: false, reason: `Unsupported protocol: ${parsed.protocol}` };
      }

      // 2. Check blocked file extensions
      const ext = parsed.pathname.substring(parsed.pathname.lastIndexOf('.')).toLowerCase();
      if (this.defaultOptions.blockedExtensions.includes(ext)) {
        return { isAllowed: false, reason: `Blocked file extension: ${ext}` };
      }

      // 3. Check crawl depth limit
      if (currentDepth > this.defaultOptions.maxDepth) {
        return { isAllowed: false, reason: `Crawl depth limit exceeded: ${currentDepth} > ${this.defaultOptions.maxDepth}` };
      }

      return { isAllowed: true };
    } catch {
      return { isAllowed: false, reason: 'Invalid URL structure' };
    }
  }

  normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      parsed.hash = ''; // Remove fragments
      if (parsed.pathname.endsWith('/') && parsed.pathname.length > 1) {
        parsed.pathname = parsed.pathname.slice(0, -1);
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }

  detectLoop(redirectChain: string[]): boolean {
    const set = new Set(redirectChain);
    return set.size !== redirectChain.length;
  }
}
